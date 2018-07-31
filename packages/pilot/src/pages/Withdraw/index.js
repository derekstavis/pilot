import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import {
  always,
  compose,
  cond,
  contains,
  equals,
  isNil,
  path,
  pathOr,
} from 'ramda'
import { translate } from 'react-i18next'
import { Alert } from 'former-kit'
import IconError from 'emblematic-icons/svg/ClearClose32.svg'
import WithdrawContainer from '../../containers/Withdraw'
import partnersBankCodes from '../../models/partnersBanksCodes'
import env from '../../environment'

import { receiveWithdraw } from './actions/'

const mapStateToProps = ({
  account: {
    client,
    company: {
      pricing,
    } = {},
  },
}) => ({
  client,
  pricing,
})

const mapDispatchToProps = ({
  onWithdrawReceive: receiveWithdraw,
})

const enhanced = compose(
  translate('translations'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)

const getDefaultRecipient = client => (
  client.company.current()
    .then(path(['default_recipient_id', env]))
    .then(id => (
      Promise.all([
        client.recipients.find({ id }),
        client.recipient.balance(id),
      ])
        .then(([recipientData, balance]) => (
          { ...recipientData, balance }
        ))
    ))
)

const getRecipientById = (id, client) => (
  client.recipients.find({ id })
    .then(recipient => (
      Promise.all([
        Promise.resolve(recipient),
        client.recipient.balance(id),
      ])
        .then(([recipientData, balance]) => (
          { ...recipientData, balance }
        ))
    ))
)


const getAvailableAmount = pathOr(null, ['balance', 'available', 'amount'])

const stepsId = {
  confirmation: 'confirmation',
  data: 'data',
  result: 'result',
}

const defaultStepsState = {
  currentStep: stepsId.data,
  statusMessage: '',
  stepsStatus: {
    [stepsId.data]: 'current',
    [stepsId.confirmation]: 'pending',
    [stepsId.result]: 'pending',
  },
}


const getStepsStatus = (nextStep, nextStepStatus) => {
  const buildStepsStatus = cond([
    [
      equals(stepsId.data),
      always({
        data: nextStepStatus,
        confirmation: 'pending',
        result: 'pending',
      }),
    ],
    [
      equals(stepsId.confirmation),
      always({
        data: 'success',
        confirmation: nextStepStatus,
        result: 'pending',
      }),
    ],
    [
      equals(stepsId.result),
      always({
        data: 'success',
        confirmation: 'success',
        result: nextStepStatus,
      }),
    ],
  ])

  return buildStepsStatus(nextStep)
}

class Withdraw extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...defaultStepsState,
      confirmationDisabledButtons: false,
      confirmationPasswordError: '',
      error: '',
      requested: '0',
    }

    this.createTransfer = this.createTransfer.bind(this)
    this.goTo = this.goTo.bind(this)
    this.handleConfirmationConfirm = this.handleConfirmationConfirm.bind(this)
    this.handleRequestChange = this.handleRequestChange.bind(this)
    this.handleTryAgain = this.handleTryAgain.bind(this)
    this.getTransferCost = this.getTransferCost.bind(this)
  }

  componentDidMount () {
    const {
      client,
      history,
      match: {
        params: {
          id,
        },
      },
      t,
    } = this.props

    let recipientPromise

    if (!id) {
      recipientPromise = getDefaultRecipient(client)
    } else {
      recipientPromise = getRecipientById(id, client)
    }

    recipientPromise
      .then((recipient) => {
        this.setState({
          error: '',
          recipient,
        })

        if (!id) {
          history.replace(`/withdraw/${recipient.id}`)
        }
      })
      .catch(({ response }) => {
        const { type } = response.errors[0]
        if (type === 'not_found') {
          this.setState({
            error: t('pages.withdraw.no_recipient'),
          })
        }
      })
  }

  getTransferCost () {
    const { recipient } = this.state
    const bankCode = path(['bank_account', 'bank_code'], recipient)

    if (recipient && bankCode) {
      // eslint-disable-next-line camelcase
      const { pricing: { transfers: { ted, credito_em_conta } } } = this.props

      if (contains(partnersBankCodes, bankCode)) {
        return credito_em_conta // eslint-disable-line camelcase
      }

      return -ted
    }

    return 0
  }

  createTransfer () {
    const {
      client,
      t,
      onWithdrawReceive,
    } = this.props

    const {
      recipient,
      requested,
    } = this.state

    client.transfers.create({
      amount: requested,
      recipient_id: recipient.id,
    })
      .then(() => {
        this.setState({
          confirmationDisabledButtons: false,
          currentStep: 'result',
          statusMessage: t('pages.withdraw.withdraw_success'),
          stepsStatus: getStepsStatus('result', 'success'),
        })

        onWithdrawReceive()
      })
      .catch(() => {
        this.setState({
          confirmationDisabledButtons: false,
          currentStep: 'result',
          statusMessage: t('pages.withdraw.withdraw_error'),
          stepsStatus: getStepsStatus('result', 'error'),
        })
      })
  }

  goTo (nextStep, nextStepStatus) {
    this.setState({
      currentStep: nextStep,
      stepsStatus: getStepsStatus(nextStep, nextStepStatus),
    })
  }

  handleConfirmationConfirm (password) {
    const {
      client,
      t,
    } = this.props

    const {
      recipient,
      requested,
    } = this.state

    const { session_id: sessionId } = client.authentication

    this.setState({
      confirmationDisabledButtons: true,
      confirmationPasswordError: '',
    })

    client.session.verify({
      id: sessionId,
      password,
    })
      .then(({ valid }) => {
        if (valid) {
          this.setState({
            confirmationPasswordError: '',
          })

          this.createTransfer({
            client,
            recipient,
            requested,
            t,
          })
        } else {
          this.setState({
            confirmationDisabledButtons: false,
            confirmationPasswordError: t('pages.withdraw.wrong_pass'),
          })
        }
      })
  }

  handleRequestChange (requested) {
    this.setState({ requested })
  }

  handleTryAgain () {
    this.goTo('data', 'current')
  }

  render () {
    const {
      confirmationDisabledButtons,
      confirmationPasswordError,
      currentStep,
      error,
      recipient,
      requested,
      statusMessage,
      stepsStatus,
    } = this.state

    const {
      history,
      t,
    } = this.props

    const transferCost = this.getTransferCost()

    return (
      <Fragment>
        {!isNil(recipient) &&
          <WithdrawContainer
            amount={Number(requested) + transferCost}
            available={getAvailableAmount(recipient)}
            confirmationPasswordError={confirmationPasswordError}
            currentStep={currentStep}
            date={moment()}
            disabled={confirmationDisabledButtons}
            maximum={getAvailableAmount(recipient)}
            onConfirmationConfirm={this.handleConfirmationConfirm}
            onConfirmationReturn={() => this.goTo('data', 'current')}
            onFormSubmit={() => this.goTo('confirmation', 'current')}
            onRequestedChange={this.handleRequestChange}
            onTryAgain={this.handleTryAgain}
            onViewStatement={() => history.push(`/balance/${recipient.id}`)}
            recipient={recipient}
            requested={Number(requested)}
            statusMessage={statusMessage}
            stepsStatus={stepsStatus}
            t={t}
            transferCost={transferCost}
          />
        }
        {error &&
          <Alert
            icon={<IconError height={16} width={16} />}
            type="error"
          >
            <span>{error}</span>
          </Alert>
        }
      </Fragment>
    )
  }
}

Withdraw.propTypes = {
  client: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  history: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  pricing: PropTypes.shape({
    transfers: PropTypes.shape({
      credito_em_conta: PropTypes.number,
      ted: PropTypes.number,
    }),
  }),
  onWithdrawReceive: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

Withdraw.defaultProps = {
  pricing: {},
}

export default enhanced(Withdraw)
