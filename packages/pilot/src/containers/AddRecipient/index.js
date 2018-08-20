
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Card,
  Steps,
} from 'former-kit'

import BankAccountStep from './BankAccountStep'
import IdentificationStep from './IdentificationStep'
import style from './style.css'

const IDENTIFICATION = 'identification'
const BANK_ACCOUNT = 'bankAccount'
const CONFIGURATION = 'configuration'
const CONFIRMATION = 'confirmation'
const CONCLUSION = 'conclusion'

const createSteps = t => [
  {
    id: IDENTIFICATION,
    title: t('Dados'),
    order: 1,
  },
  {
    id: BANK_ACCOUNT,
    order: 2,
    title: t('Conta Bancaria'),
    fetch: () => {},
  },
  {
    id: CONFIGURATION,
    title: t('Configurações'),
    order: 3,
  },
  {
    id: CONFIRMATION,
    title: t('Confirmação'),
    order: 4,
  },
  {
    id: CONCLUSION,
    title: t('Conclusão'),
    order: 5,
  },
]

const StepMock = ({
  onBack,
  onCancel,
  onContinue,
}) => (
  <Fragment>
    <Button onClick={onBack}>
      Back
    </Button>
    <Button onClick={onCancel}>
      Cancel
    </Button>
    <Button onClick={onContinue}>
      Continue
    </Button>
  </Fragment>
)

StepMock.propTypes = {
  onContinue: PropTypes.func,
  onBack: PropTypes.func,
  onCancel: PropTypes.func,
}

StepMock.defaultProps = {
  onContinue: () => {},
  onBack: () => {},
  onCancel: () => {},
}

export default class AddRecipients extends Component {
  constructor (props) {
    super(props)
    const {
      currentStepOrder,
      t,
    } = props

    this.state = {
      currentStepOrder: currentStepOrder || IDENTIFICATION,
      data: {},
      status: [
        { id: IDENTIFICATION, status: 'current' },
        { id: BANK_ACCOUNT, status: 'pending' },
        { id: CONFIGURATION, status: 'pending' },
        { id: CONFIRMATION, status: 'pending' },
        { id: CONCLUSION, status: 'pending' },
      ],
    }

    this.steps = createSteps(t)

    this.onContinue = this.onContinue.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onBack = this.onBack.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.renderStep = this.renderStep.bind(this)
  }

  onContinue (stepData) {
    const {
      currentStepOrder,
      data,
    } = this.state

    const currentStep = this.steps.find(step => (
      step.order === currentStepOrder
    ))

    const nextStepOrder = currentStepOrder + 1
    const status = this.updateStatus(nextStepOrder)

    this.setState({
      status,
      currentStepOrder: nextStepOrder,
      data: {
        ...data,
        [currentStep.id]: stepData,
      },
    })
  }

  /* eslint-disable */
  onCancel () {
    console.log('cancel')
  }
  /* eslint-enable */

  onBack () {
    const {
      currentStepOrder,
    } = this.state

    const previusStepOrder = currentStepOrder - 1
    const status = this.updateStatus(previusStepOrder)

    this.setState({
      status,
      currentStepOrder: previusStepOrder,
    })

    console.log('back')
  }

  updateStatus (nextStepOrder) {
    const updatedStatus = this.steps.map((step) => {
      let status = 'current'

      if (step.order < nextStepOrder) {
        status = 'success'
      }

      if (step.order > nextStepOrder) {
        status = 'pending'
      }

      return {
        id: step.id,
        order: step.order,
        status,
      }
    })

    return updatedStatus
  }

  renderStep () {
    const { currentStepOrder } = this.state
    const { t } = this.props

    const currentStep = this.steps.find(step => (
      step.order === currentStepOrder
    ))

    switch (currentStep.id) {
      case IDENTIFICATION:
        return (
          <IdentificationStep
            data={this.state.data[currentStep.id]}
            onBack={this.onBack}
            onCancel={this.onCancel}
            onContinue={this.onContinue}
            t={t}
          />
        )

      case BANK_ACCOUNT:
        return (
          <BankAccountStep
            onBack={this.onBack}
            onCancel={this.onCancel}
            onContinue={this.onContinue}
            t={t}
          />
        )

      default:
        return (
          <StepMock
            onBack={this.onBack}
            onCancel={this.onCancel}
            onContinue={this.onContinue}
          />
        )
    }
  }

  render () {
    console.log('status', this.state.status)
    console.log('steps', this.steps)

    return (
      <Fragment>
        <Card>
          <Steps
            status={this.state.status}
            steps={this.steps}
          />
        </Card>
        <Card className={style.marginTop}>
          {this.renderStep()}
        </Card>
      </Fragment>
    )
  }
}

AddRecipients.propTypes = {
  currentStepOrder: PropTypes.number,
  t: PropTypes.func.isRequired,
}

AddRecipients.defaultProps = {
  currentStepOrder: 1,
}
