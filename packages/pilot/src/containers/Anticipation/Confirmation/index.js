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
  Spacing,
} from 'former-kit'
import {
  always,
  cond,
  gte,
  lt,
} from 'ramda'
import DataDisplay from '../../../components/DataDisplay'
import TotalDisplay from '../../../components/TotalDisplay'
import DetailsHead from '../../../components/DetailsHead'
import Summary from '../../../components/Summary'
import formatAccountType from '../../../formatters/accountType'
import formatAgencyAccount from '../../../formatters/agencyAccount'
import formatCpfCnpj from '../../../formatters/cpfCnpj'
import formatLongDate from '../../../formatters/longDate'
import style from './style.css'

const chooseTotalDisplayColor = cond([
  [Number.isNaN, always('#757575')],
  [lt(0), always('#37cc9a')],
  [gte(0), always('#ff796f')],
])

class AnticipationConfirmation extends Component {
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
      totalCost,
    } = this.props

    return (
      <Summary>
        <DataDisplay
          title={t('pages.anticipation.date.label')}
          titleSize="small"
          value={formatLongDate(date)}
        />
        <TotalDisplay
          align="center"
          amount={requested}
          amountSize="large"
          color="#37cc9a"
          title={t('pages.anticipation.requested.title')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          align="center"
          amount={totalCost}
          amountSize="large"
          color="#ff796f"
          title={t('pages.anticipation.cost.title')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          align="center"
          amount={amount}
          amountSize="large"
          color={chooseTotalDisplayColor(amount)}
          title={t('pages.anticipation.amount.title')}
          titleColor="#757575"
          titleSize="small"
        />
      </Summary>
    )
  }

  renderPasswordInput () {
    const {
      disabled,
      error,
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
              {t('pages.anticipation.type_password')}
            </div>
            <FormInput
              disabled={disabled}
              error={error}
              label={t('pages.anticipation.password')}
              name="password"
              onChange={this.handlePasswordChange}
              placeholder={t('pages.anticipation.password')}
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
      disabled,
      onCancel,
      onReturn,
      t,
    } = this.props

    return (
      <CardActions>
        <Button
          disabled={disabled}
          fill="outline"
          onClick={onCancel}
          relevance="low"
          type="button"
        >
          {t('pages.anticipation.cancel')}
        </Button>
        <Spacing />
        <Button
          disabled={disabled}
          fill="outline"
          onClick={onReturn}
          relevance="low"
          type="button"
        >
          {t('pages.anticipation.return')}
        </Button>
        <Button
          disabled={!this.state.password || disabled}
          type="submit"
        >
          {t('pages.anticipation.confirm')}
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
    const {
      automaticTransfer,
      t,
    } = this.props
    return (
      <form
        className={style.form}
        onSubmit={this.handleConfirm}
      >
        <Card>
          <CardContent>
            <Grid>
              <Row>
                <Col
                  desk={12}
                  palm={12}
                  tablet={12}
                  tv={12}
                >
                  <span className={style.advise}>
                    {automaticTransfer
                      ? t('pages.anticipation.confirmation_advise_with_transfer')
                      : t('pages.anticipation.confirmation_advise_without_transfer')
                    }
                  </span>
                </Col>
              </Row>
              {automaticTransfer && this.renderRecipient()}
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

AnticipationConfirmation.propTypes = {
  amount: PropTypes.number.isRequired,
  automaticTransfer: PropTypes.bool.isRequired,
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
  }),
  date: PropTypes.instanceOf(moment).isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
  requested: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  totalCost: PropTypes.number.isRequired,
}

AnticipationConfirmation.defaultProps = {
  bankAccount: null,
  disabled: false,
  error: '',
}

export default AnticipationConfirmation

