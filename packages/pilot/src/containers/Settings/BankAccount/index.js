import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardSection,
  CardSectionDoubleLineTitle,
  SegmentedSwitch,
  Spacing,
} from 'former-kit'
import IconWithdraw from 'emblematic-icons/svg/Withdraw32.svg'

import agencyAccountFormatter from '../../../formatters/agencyAccount'

import BankAccountForm from './Add'
import BankAccountSelector from './Selector'

class BankAccount extends Component {
  constructor () {
    super()

    this.state = {
      collapsed: true,
      selected: 'selection',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCollapse = this.handleCollapse.bind(this)
    this.renderSubtitle = this.renderSubtitle.bind(this)
  }

  componentWillReceiveProps ({ selectedView }) {
    this.handleChange(selectedView)
  }

  handleChange (selected) {
    this.setState({
      selected,
    })
  }

  handleCollapse () {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  renderSubtitle (account) {
    const { t } = this.props

    const bankName = t(`models.bank_code.${account.bank_code}`)
    const textAccount = t('pages.settings.company.card.register.bank.account')
    const textAgency = t('pages.settings.company.card.register.bank.agency')
    const textMainAccount = t('pages.settings.company.card.register.bank.main_account')

    const renderAgency = agencyAccountFormatter(account.agencia, account.agencia_dv)
    const renderAccount = agencyAccountFormatter(account.conta, account.conta_dv)

    return (
      <Fragment>
        {`${textMainAccount} ${account.legal_name}`}
        <Spacing size="large" />
        {`${bankName} | `}
        {`${textAgency}: ${renderAgency} | `}
        {`${textAccount}: ${renderAccount}`}
      </Fragment>
    )
  }

  render () {
    const {
      collapsed,
      selected,
    } = this.state

    const {
      accounts,
      data,
      disabled,
      errors,
      onAccountSelect,
      onCancel,
      onChange,
      onSubmit,
      selectedAccount,
      selectionActionDisabled,
      t,
    } = this.props

    const viewAddAccount = selected === 'addition'
    const viewSelectAccount = selected === 'selection'

    return (
      <Card>
        <CardSection>
          <CardSectionDoubleLineTitle
            collapsed={collapsed}
            icon={<IconWithdraw width={16} height={16} />}
            onClick={this.handleCollapse}
            subtitle={this.renderSubtitle(selectedAccount)}
            title={t('pages.settings.company.card.register.title.bank')}
          />
          {!collapsed &&
            <Fragment>
              <CardContent>
                <SegmentedSwitch
                  name="select"
                  onChange={this.handleChange}
                  options={[
                    {
                      title: t('pages.settings.company.card.register.title.select'),
                      value: 'selection',
                    },
                    {
                      title: t('pages.settings.company.card.register.title.add'),
                      value: 'addition',
                    },
                  ]}
                  value={selected}
                />
              </CardContent>

              {viewSelectAccount &&
                <BankAccountSelector
                  accounts={accounts}
                  disabled={selectionActionDisabled}
                  onSelect={onAccountSelect}
                  selectedAccountId={selectedAccount.id}
                  t={t}
                />
              }

              {viewAddAccount &&
                <BankAccountForm
                  actionsDisabled={disabled}
                  data={data}
                  errors={errors}
                  onChange={onChange}
                  onCancel={onCancel}
                  onSubmit={onSubmit}
                  t={t}
                />
              }
            </Fragment>
          }
        </CardSection>
      </Card>
    )
  }
}

const accountShape = {
  agencia: PropTypes.string,
  agencia_dv: PropTypes.string,
  bank_code: PropTypes.string,
  conta: PropTypes.string,
  conta_dv: PropTypes.string,
  document_number: PropTypes.string,
  document_type: PropTypes.string,
  id: PropTypes.number,
  legal_name: PropTypes.string,
  type: PropTypes.string,
}

BankAccount.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)).isRequired,
  data: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    documentNumber: PropTypes.string.isRequired,
    legalName: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
  disabled: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    type: PropTypes.string,
  }),
  onAccountSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedAccount: PropTypes.shape(accountShape).isRequired,
  selectionActionDisabled: PropTypes.bool.isRequired,
  selectedView: PropTypes.oneOf([
    'addition', 'selection',
  ]),
  t: PropTypes.func.isRequired,
}

BankAccount.defaultProps = {
  data: {
    account: '',
    accountCd: '',
    agency: '',
    agencyCd: '',
    bankCode: '',
    type: '',
  },
  errors: null,
  selectedView: 'selection',
}

export default BankAccount
