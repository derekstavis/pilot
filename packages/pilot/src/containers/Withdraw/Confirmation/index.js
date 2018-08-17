import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardSection,
  Col,
  FormInput,
  Grid,
  Row,
} from 'former-kit'
import DataDisplay from '../../../components/DataDisplay'
import DetailsHead from '../../../components/DetailsHead'
import formatAccountType from '../../../formatters/accountType'
import formatAgencyAccount from '../../../formatters/agencyAccount'
import formatCpfCnpj from '../../../formatters/cpfCnpj'
import style from './style.css'
import Summary from '../../../components/Summary'
import TotalDisplay from '../../../components/TotalDisplay'

class WithdrawConfirmationContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
    }

    this.handleConfirm = this.handleConfirm.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.renderCardActions = this.renderCardActions.bind(this)
    this.renderPasswordInput = this.renderPasswordInput.bind(this)
  }

  handlePasswordChange (e) {
    this.setState({
      password: e.target.value,
    })
  }

  handleConfirm (e) {
    e.preventDefault()
    this.props.onConfirm(this.state.password)
  }

  renderInformationRow () {
    const {
      amount,
      date,
      requested,
      t,
      transferCost,
    } = this.props

    return (
      <Summary>
        <DataDisplay
          title={t('pages.withdraw.date')}
          titleSize="small"
          value={moment(date).format('DD/MM/YYYY')}
        />
        <TotalDisplay
          align="center"
          amount={requested}
          amountSize="large"
          color="#37cc9a"
          title={t('pages.withdraw.requested_value')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          align="center"
          amount={transferCost}
          amountSize="large"
          color="#ff796f"
          title={t('pages.withdraw.transfer_cost')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          align="center"
          amount={amount}
          amountSize="large"
          color="#37cc9a"
          title={t('pages.withdraw.value_to_transfer')}
          titleColor="#757575"
          titleSize="small"
        />
      </Summary>
    )
  }

  renderPasswordInput () {
    const {
      passwordError,
      t,
    } = this.props

    const { password } = this.state

    return (
      <Row stretch>
        <Col
          desk={4}
          palm={4}
          tablet={4}
          tv={4}
        />
        <Col
          className={style.passwordContainer}
          desk={4}
          palm={4}
          tablet={4}
          tv={4}
        >
          <div>
            <div className={style.password}>
              {t('pages.withdraw.type_password')}
            </div>
            <FormInput
              error={passwordError}
              label={t('pages.withdraw.password')}
              name="password"
              onChange={this.handlePasswordChange}
              placeholder={t('pages.withdraw.password')}
              type="password"
              value={password}
            />
          </div>
        </Col>
        <Col
          desk={4}
          palm={4}
          tablet={4}
          tv={4}
        />
      </Row>
    )
  }

  renderCardActions () {
    const {
      disabledButtons,
      onReturn,
      t,
    } = this.props

    return (
      <CardActions>
        <Button
          disabled={disabledButtons}
          fill="outline"
          onClick={onReturn}
          relevance="low"
          type="button"
        >
          {t('pages.withdraw.return')}
        </Button>
        <Button
          disabled={!this.state.password || disabledButtons}
          type="submit"
        >
          {t('pages.withdraw.confirm')}
        </Button>
      </CardActions>
    )
  }

  renderRecipient () {
    const {
      bankAccount: {
        agencia_dv: agenciaDv,
        agencia,
        bank_code: bankCode,
        conta_dv: contaDv,
        conta,
        document_number: documentNumber,
        legal_name: legalName,
        type,
      },
      t,
    } = this.props

    return (
      <Row>
        <Col
          desk={12}
          palm={12}
          tablet={12}
          tv={12}
        >
          <CardSection>
            <CardContent>
              <DetailsHead
                identifier={legalName}
                properties={[
                  {
                    children: bankCode,
                    title: t('models.bank_account.bank'),
                  },
                  {
                    children: formatAgencyAccount(agencia, agenciaDv),
                    title: t('models.bank_account.agency'),
                  },
                  {
                    children: formatAgencyAccount(conta, contaDv),
                    title: t('models.bank_account.account'),
                  },
                  {
                    children: formatAccountType(t, type),
                    title: t('models.bank_account.account_type'),
                  },
                  {
                    children: formatCpfCnpj(documentNumber),
                    title: t('models.bank_account.document'),
                  },
                ]}
                title={t('models.bank_account.legal_name')}
              />
            </CardContent>
          </CardSection>
        </Col>
      </Row>
    )
  }

  render () {
    return (
      <form onSubmit={this.handleConfirm}>
        <Card>
          <CardContent>
            <Grid>
              <Row>
                <Col>
                  <span className={style.advise}>
                    {this.props.t('pages.withdraw.confirmation_advise')}
                  </span>
                </Col>
              </Row>
              {this.renderRecipient()}
              {this.renderInformationRow()}
              {this.renderPasswordInput()}
            </Grid>
          </CardContent>
          {this.renderCardActions()}
        </Card>
      </form>
    )
  }
}

WithdrawConfirmationContainer.propTypes = {
  amount: PropTypes.number.isRequired,
  bankAccount: PropTypes.shape({
    agencia_dv: PropTypes.string,
    agencia: PropTypes.string,
    bank_code: PropTypes.string,
    conta_dv: PropTypes.string,
    conta: PropTypes.string,
    document_number: PropTypes.string,
    document_type: PropTypes.string,
    legal_name: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  disabledButtons: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
  passwordError: PropTypes.string.isRequired,
  requested: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  transferCost: PropTypes.number.isRequired,
}

export default WithdrawConfirmationContainer

