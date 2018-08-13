import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  compose,
  curry,
  defaultTo,
  find,
  head,
  map,
  merge,
  path,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  uncurryN,
} from 'ramda'
import { translate } from 'react-i18next'

import CompanySettings from '../../containers/Settings/Company'
import environment from '../../environment'

const mapStateToProps = ({
  account: { client, user, company },
}) => ({ client, user, company })

const enhanced = compose(
  withRouter,
  connect(mapStateToProps),
  translate()
)

const formatErrors = pipe(
  pathOr([], ['response', 'errors']),
  map(error => error.message),
  head
)

const getPropFromBoleto = (propName, company) =>
  pathOr(null, ['boletos', propName], company)

const getPropExpiration = pipe(
  propOr('', 'expiration'),
  defaultTo(''),
  String
)

const getPropFromInstructions = (search, propName) =>
  uncurryN(2, instructions => pipe(
    find(propEq(search, instructions)),
    prop(propName)
  ))

const getNameFromInstructions = getPropFromInstructions('value', 'name')
const getValueFromInstructions = getPropFromInstructions('name', 'value')

const getCurrentCompany = client => client.company.current()

const getSelectedAccount = curry((client, id) =>
  client.recipients.find({ id })
    .then(path(['bank_account']))
)

const getBankAccounts = curry((client, bankAccount) =>
  client.bankAccounts.find({
    count: 100,
    document_number: bankAccount.document_number,
  }).then(accounts => ({
    selectedAccount: bankAccount,
    accounts,
  }))
)

const buildBankAccount = account => ({
  agencia: account.agency || account.agencia,
  agencia_dv: account.agencyCd || account.agencia_dv,
  bank_code: account.bankCode || account.bank_code,
  conta: account.account || account.conta,
  conta_dv: account.accountCd || account.conta_dv,
  document_number: account.documentNumber || account.document_number,
  legal_name: account.legalName || account.legal_name,
  type: account.type,
})

const updateBankAccount = ({ client, account, recipiendId }) =>
  client.recipients.update({
    id: recipiendId,
    bank_account: buildBankAccount(account),
  })

const boletoOptions = t => ([
  {
    name: t('pages.settings.company.boleto.options.accept'),
    value: 'accept_payment',
  },
  {
    name: t('pages.settings.company.boleto.options.refuse'),
    value: 'deny_payment',
  },
])

const defaultBankAccountState = {
  account: '',
  accountCd: '',
  agency: '',
  agencyCd: '',
  bankCode: '',
  documentNumber: '',
  legalName: '',
  type: '',
}

const defaultBankAccountErrorsState = {
  account: '',
  accountCd: '',
  agency: '',
  agencyCd: '',
  bankCode: '',
  type: '',
}

class CompanySettingsPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      defaultRecipientId: null,
      bankAccount: {
        accounts: [],
        actionsDisabled: true,
        actionSelectDisabled: false,
        data: defaultBankAccountState,
        errors: defaultBankAccountErrorsState,
        loading: false,
        selectedAccount: {},
        selectedView: 'selection',
      },
      boleto: {
        actionsDisabled: true,
        error: null,
        expiration: null,
        instructions: null,
        loading: false,
      },
      companyInfo: {
        address: {},
        apiKeys: null,
        apiVersion: null,
        general: {},
        managingPartner: {},
        pricing: [],
        team: [],
      },
      createUserStatus: {
        error: null,
        success: false,
        loading: false,
      },
      deleteUserStatus: {
        error: null,
        success: false,
      },
    }

    this.getInitialState = this.getInitialState.bind(this)
    this.handleAccountCancel = this.handleAccountCancel.bind(this)
    this.handleAccountChange = this.handleAccountChange.bind(this)
    this.handleAccountCreate = this.handleAccountCreate.bind(this)
    this.handleAccountSelect = this.handleAccountSelect.bind(this)
    this.handleBoletoCancel = this.handleBoletoCancel.bind(this)
    this.handleBoletoChange = this.handleBoletoChange.bind(this)
    this.handleBoletoSubmit = this.handleBoletoSubmit.bind(this)
    this.handleCreateUser = this.handleCreateUser.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
    this.requestData = this.requestData.bind(this)
    this.resetCreateUserState = this.resetCreateUserState.bind(this)
  }

  getInitialState () {
    const { client, t } = this.props
    const { bankAccount, boleto } = this.state

    const getBoletoOptions = company => ({
      expiration: getPropFromBoleto(
        'days_to_add_in_expiration_date',
        company
      ),
      instructions: getValueFromInstructions(
        company.boletos.instrucoes,
        boletoOptions(t)
      ),
    })

    const getDefaultRecipientId = path(['default_recipient_id', environment])

    getCurrentCompany(client)
      .then(company => ({
        boletoInstructions: getBoletoOptions(company),
        defaultRecipientId: getDefaultRecipientId(company),
      }))
      .then(({ boletoInstructions, defaultRecipientId }) => {
        this.setState({
          boleto: {
            ...boleto,
            actionsDisabled: true,
            ...boletoInstructions,
          },
          defaultRecipientId,
        })

        return defaultRecipientId
      })
      .then(getSelectedAccount(client))
      .then(getBankAccounts(client))
      .then(({ selectedAccount, accounts }) => this.setState({
        bankAccount: {
          ...bankAccount,
          accounts,
          selectedAccount,
          data: {
            ...defaultBankAccountState,
            documentNumber: selectedAccount.document_number,
            legalName: selectedAccount.legal_name,
          },
        },
      }))
  }

  componentDidMount () {
    this.requestData()
    this.getInitialState()
  }

  requestData () {
    this.props.client.company.info()
      .then((companyInfo) => {
        this.setState({ companyInfo })
      })
  }

  handleAccountCancel () {
    const { bankAccount } = this.state

    this.setState({
      bankAccount: {
        ...bankAccount,
        actionsDisabled: true,
        data: {
          ...defaultBankAccountState,
          documentNumber: bankAccount.data.documentNumber,
          legalName: bankAccount.data.legalName,
        },
        errors: defaultBankAccountErrorsState,
      },
    })
  }

  handleAccountChange (data, errors) {
    const { bankAccount } = this.state

    this.setState({
      bankAccount: {
        ...bankAccount,
        actionsDisabled: false,
        data: merge(bankAccount.data, data),
        errors,
        selectedView: 'addition',
      },
    })
  }

  handleAccountCreate (data, errors) {
    const { bankAccount, defaultRecipientId } = this.state
    const { client } = this.props
    const account = merge(bankAccount.data, data)

    if (!errors) {
      this.setState({
        bankAccount: {
          ...bankAccount,
          actionsDisabled: true,
        },
      }, () => updateBankAccount({
        account,
        client,
        recipiendId: defaultRecipientId,
      })
        .then(prop('bank_account'))
        .then(getBankAccounts(client))
        .then(({ selectedAccount, accounts }) => this.setState({
          bankAccount: {
            ...bankAccount,
            accounts,
            actionsDisabled: true,
            data: {
              ...defaultBankAccountState,
              documentNumber: account.documentNumber,
              legalName: account.legalName,
            },
            errors: defaultBankAccountErrorsState,
            selectedAccount,
            selectedView: 'selection',
          },
        })))
    } else {
      this.setState({
        bankAccount: {
          ...bankAccount,
          errors,
        },
      })
    }
  }

  handleAccountSelect (accountId) {
    const { bankAccount, defaultRecipientId } = this.state
    const { client } = this.props
    const account = find(propEq('id', accountId), bankAccount.accounts)

    this.setState({
      bankAccount: {
        ...bankAccount,
        actionSelectDisabled: true,
      },
    }, () => updateBankAccount({
      account,
      client,
      recipiendId: defaultRecipientId,
    })
      .then(({ bank_account: selectedAccount }) => this.setState({
        bankAccount: {
          ...bankAccount,
          actionSelectDisabled: false,
          selectedAccount,
        },
      }))
    )
  }

  handleBoletoCancel () {
    const { company, t } = this.props
    const { boleto } = this.state

    this.setState({
      boleto: {
        ...boleto,
        actionsDisabled: true,
        expiration: getPropFromBoleto(
          'days_to_add_in_expiration_date', company
        ),
        instructions: getValueFromInstructions(
          company.boletos.instrucoes,
          boletoOptions(t)
        ),
      },
    })
  }

  handleBoletoChange (data) {
    this.setState({
      boleto: {
        actionsDisabled: false,
        error: null,
        expiration: data.daysToAddInExpirationDate,
        instructions: data.instructions,
        loading: false,
      },
    })
  }

  handleBoletoSubmit (data, error) {
    const { boleto } = this.state
    const { client: { company }, t } = this.props

    const handleSuccess = ({ boletos }) => {
      this.setState({
        boleto: {
          ...boleto,
          actionsDisabled: true,
          loading: false,
          expiration: boletos.days_to_add_in_expiration_date,
          instructions: getValueFromInstructions(
            boletos.instrucoes, boletoOptions(t)
          ),
        },
      })
    }

    const handleError = response => this.setState({
      boleto: {
        ...boleto,
        error: formatErrors(response),
        actionsDisabled: true,
        loading: false,
      },
    })

    if (!error) {
      this.setState({
        boleto: {
          ...boleto,
          loading: true,
          actionsDisabled: true,
        },
      }, () => {
        company.update({
          boletos: {
            days_to_add_in_expiration_date: data.daysToAddInExpirationDate,
            instrucoes: getNameFromInstructions(
              data.instructions,
              boletoOptions(t)
            ),
          },
          instrucoes_type: data.instructions,
        })
          .then(handleSuccess)
          .catch(handleError)
      })
    }
  }

  handleCreateUser (user) {
    const handleSuccess = () => this.setState({
      createUserStatus: {
        error: null,
        success: true,
        loading: false,
      },
    })

    const handleFailure = (response) => {
      this.setState({
        createUserStatus: {
          error: formatErrors(response),
          success: false,
          loading: false,
        },
      })
    }

    this.setState({
      createUserStatus: {
        error: null,
        success: false,
        loading: true,
      },
    }, () => this.props.client.invites
      .create(user)
      .then(handleSuccess)
      .catch(handleFailure)
    )
  }

  resetCreateUserState () {
    this.setState({
      createUserStatus: {
        error: null,
        success: false,
        loading: false,
      },
    })
  }

  handleDeleteUser (id) {
    this.props.client.user.destroy({ id })
      .then(() => {
        this.requestData()
        this.setState({
          deleteUserStatus: {
            error: null,
            success: true,
          },
        })
      })
      .catch((response) => {
        this.setState({
          deleteUserStatus: {
            error: formatErrors(response),
            success: false,
          },
        })
      })
  }

  render () {
    const {
      t,
    } = this.props

    const {
      bankAccount,
      boleto,
      companyInfo: {
        address,
        apiKeys,
        apiVersion,
        general,
        managingPartner,
        pricing,
        team,
      },
    } = this.state

    return (
      <CompanySettings
        address={address}
        apiKeys={apiKeys}
        apiVersion={apiVersion}
        bankAccounts={bankAccount.accounts}
        bankActionsDisabled={bankAccount.actionsDisabled}
        bankAccountSelected={bankAccount.selectedAccount}
        bankAccountSelectActionDisabled={bankAccount.actionSelectDisabled}
        bankAccountSelectedView={bankAccount.selectedView}
        bankData={bankAccount.data}
        bankErrors={bankAccount.errors}
        boletoActionsDisabled={boleto.actionsDisabled || boleto.loading}
        boletoDaysToAddInExpirationDate={getPropExpiration(boleto)}
        boletoDisabled={boleto.loading}
        boletoInstructions={boleto.instructions}
        boletoInstructionsOptions={boletoOptions(t)}
        createUserStatus={this.state.createUserStatus}
        deleteUserStatus={this.state.deleteUserStatus}
        environment={environment}
        general={general}
        handleCreateUser={this.handleCreateUser}
        handleDeleteUser={this.handleDeleteUser}
        managingPartner={managingPartner}
        onBankAccountCancel={this.handleAccountCancel}
        onBankAccountChange={this.handleAccountChange}
        onBankAccountCreate={this.handleAccountCreate}
        onBankAccountSelect={this.handleAccountSelect}
        onBoletoSettingsCancel={this.handleBoletoCancel}
        onBoletoSettingsChange={this.handleBoletoChange}
        onBoletoSettingsSubmit={this.handleBoletoSubmit}
        pricing={pricing}
        resetCreateUserState={this.resetCreateUserState}
        t={t}
        team={team}
      />
    )
  }
}

CompanySettingsPage.propTypes = {
  client: PropTypes.shape({
    company: PropTypes.shape({
      info: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
    }),
    invites: PropTypes.shape({
      create: PropTypes.func.isRequired,
    }),
    user: PropTypes.shape({
      destroy: PropTypes.func.isRequired,
    }),
  }).isRequired,
  company: PropTypes.shape({
    boletos: PropTypes.shape({
      days_to_add_in_expiration_date: PropTypes.number.isRequired,
      instrucoes: PropTypes.string.isRequired,
    }).isRequired,
  }),
  t: PropTypes.func.isRequired,
}

CompanySettingsPage.defaultProps = {
  company: null,
}

export default enhanced(CompanySettingsPage)
