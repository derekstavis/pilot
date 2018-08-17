import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Form from 'react-vanilla-form'
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
import {
  always,
  cond,
  gte,
  lt,
} from 'ramda'

import CurrencyInput from '../../../components/CurrencyInput'
import DataDisplay from '../../../components/DataDisplay'
import formatCurrency from '../../../formatters/currency'
import greaterThanValidation from '../../../validation/greaterThan'
import lessThanOrEqualValidation from '../../../validation/lessThanOrEqual'
import numberValidation from '../../../validation/number'
import requiredValidation from '../../../validation/required'
import Summary from '../../../components/Summary'
import TotalDisplay from '../../../components/TotalDisplay'

import style from './style.css'

const chooseTransferCardColor = cond([
  [Number.isNaN, always('#757575')],
  [lt(0), always('#37cc9a')],
  [gte(0), always('#ff796f')],
])

class WithdrawFormContainer extends Component {
  constructor (props) {
    super(props)

    this.renderCardActions = this.renderCardActions.bind(this)
    this.renderInformationRow = this.renderInformationRow.bind(this)
    this.renderInputRow = this.renderInputRow.bind(this)
  }

  renderCardActions () {
    const {
      maximum,
      requested,
      t,
      transferCost,
    } = this.props

    return (
      <CardActions>
        <Button
          disabled={
            requested > maximum ||
            requested <= Math.abs(transferCost) ||
            !requested
          }
          type="submit"
        >
          {t('pages.withdraw.continue')}
        </Button>
      </CardActions>
    )
  }

  renderInputRow () {
    const {
      available,
      maximum,
      t,
    } = this.props

    return (
      <Row stretch>
        <Col
          desk={3}
          palm={3}
          tablet={3}
          tv={3}
        />
        <Col
          desk={6}
          palm={6}
          tablet={6}
          tv={6}
        >
          <CardSection>
            <CardContent className={style.formContent}>
              <div className={style.formMessage}>
                {t('pages.withdraw.form_message')}
              </div>
              <div className={style.balance}>
                {t('pages.withdraw.balance')}
                <span
                  className={style.available}
                >
                  &nbsp;{formatCurrency(available)}
                </span>
              </div>
              <div className={style.inputSection}>
                <span>
                  {t('pages.withdraw.max_value_to_be')}<br /> {t('pages.withdraw.transferred')}
                  <span className={style.maximum}>
                    &nbsp;{formatCurrency(maximum)}
                  </span>
                </span>
                <FormInput
                  label={t('pages.withdraw.withdraw_value')}
                  name="requested"
                  renderer={props => (
                    <CurrencyInput
                      max={99999999999}
                      {...props}
                    />
                  )}
                />
              </div>
            </CardContent>
          </CardSection>
        </Col>
        <Col
          desk={3}
          palm={3}
          tablet={3}
          tv={3}
        />
      </Row>
    )
  }

  renderInformationRow () {
    const {
      date,
      requested,
      t,
      transferCost,
    } = this.props

    const amount = requested + transferCost

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
          color={chooseTransferCardColor(amount)}
          title={t('pages.withdraw.value_to_transfer')}
          titleColor="#757575"
          titleSize="small"
        />
      </Summary>
    )
  }

  render () {
    const {
      maximum,
      onRequestedChange,
      requested,
      t,
      transferCost,
    } = this.props

    const isRequired = requiredValidation(t('pages.withdraw.required'))
    const isNumber = numberValidation(t('pages.withdraw.number'))

    const amount = requested + transferCost

    const buildAmountValidation = lessThanOrEqualValidation(
      0,
      t('pages.withdraw.negative_transfer_value')
    )

    return (
      <Card>
        <Form
          data={{
            requested: requested.toString(),
          }}
          validateOn="blur"
          validation={{
            requested: [
              isRequired,
              isNumber,
              always(buildAmountValidation(amount)),
              greaterThanValidation(
                maximum, t('pages.withdraw.requested_value_greater_max')
              ),
            ],
          }}
          onChange={data => onRequestedChange(Number(data.requested))}
          onSubmit={this.props.onSubmit}
        >
          <CardContent>
            <Grid>
              {this.renderInputRow()}
              {this.renderInformationRow()}
            </Grid>
          </CardContent>
          {this.renderCardActions()}
        </Form>
      </Card>
    )
  }
}

WithdrawFormContainer.propTypes = {
  available: PropTypes.number,
  date: PropTypes.instanceOf(moment).isRequired,
  maximum: PropTypes.number,
  onRequestedChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  requested: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
  transferCost: PropTypes.number.isRequired,
}

WithdrawFormContainer.defaultProps = {
  available: null,
  maximum: null,
}

export default WithdrawFormContainer
