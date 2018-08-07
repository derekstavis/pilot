import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  ModalActions,
  ModalContent,
  Col,
  FormInput,
  Grid,
  Row,
} from 'former-kit'

import CurrencyInput from '../../../components/CurrencyInput'
import formatterCardNumber from '../../../formatters/cardNumber'
import formatterCurrency from '../../../formatters/currency'
import greaterThanValidation from '../../../validation/greaterThan'
import lessThanOrEqualValidation from '../../../validation/lessThanOrEqual'
import numberValidation from '../../../validation/number'
import Property from '../../../components/Property'
import requiredValidation from '../../../validation/required'

class CardForm extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (data, errors) {
    if (!errors) {
      this.props.onConfirm(data)
    }
  }

  render () {
    const {
      amount,
      brand,
      cardFirstDigits,
      cardLastDigits,
      email,
      holderName,
      installments,
      refundAmount,
      t,
    } = this.props

    const isRequired = requiredValidation(t('pages.refund.required'))
    const isNumber = numberValidation(t('pages.refund.number'))

    return (
      <Form
        data={{
          amount: refundAmount || amount.toString(),
        }}
        validateOn="blur"
        validation={{
          amount: [
            isRequired,
            isNumber,
            greaterThanValidation(amount, t('pages.refund.invalid_amount')),
            lessThanOrEqualValidation(0, t('pages.refund.greater_than_zero')),
          ],
        }}
        onSubmit={this.handleSubmit}
      >
        <ModalContent>
          <Grid>
            <Row>
              <Col palm={12} tablet={7} desk={7} tv={7}>
                <Property
                  title={t('models.card.holder_name')}
                  value={holderName}
                />
              </Col>

              <Col palm={12} tablet={5} desk={5} tv={5}>
                <Property
                  title={t('models.customer.email')}
                  value={email}
                />
              </Col>

              <Col palm={12} tablet={4} desk={4} tv={4}>
                <Property
                  title={t('models.card.number')}
                  value={
                    `${formatterCardNumber(cardFirstDigits)} ${cardLastDigits}`
                  }
                />
              </Col>

              <Col palm={12} tablet={3} desk={3} tv={3}>
                <Property
                  title={t('models.card.brand')}
                  value={brand}
                />
              </Col>

              <Col palm={12} tablet={5} desk={5} tv={5}>
                <Property
                  title={t('models.transaction.installments')}
                  value={t('models.transaction.installments_count', { count: installments })}
                />
              </Col>

              <Col palm={12} tablet={7} desk={7} tv={7}>
                <Property
                  title={t('models.transaction.amount')}
                  value={formatterCurrency(amount)}
                />
              </Col>

              <Col palm={12} tablet={5} desk={5} tv={5}>
                <FormInput
                  label={t('pages.refund.refund_amount_with_symbol')}
                  name="amount"
                  renderer={props => (
                    <CurrencyInput
                      {...props}
                    />
                  )}
                />
              </Col>
            </Row>
          </Grid>
        </ModalContent>
        <ModalActions>
          <Button
            fill="gradient"
            type="submit"
          >
            {t('pages.refund.continue')}
          </Button>
        </ModalActions>
      </Form>
    )
  }
}

CardForm.propTypes = {
  amount: PropTypes.number.isRequired,
  brand: PropTypes.string.isRequired,
  cardFirstDigits: PropTypes.string.isRequired,
  cardLastDigits: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  holderName: PropTypes.string.isRequired,
  installments: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  refundAmount: PropTypes.string,
  t: PropTypes.func.isRequired,
}

CardForm.defaultProps = {
  refundAmount: null,
}

export default CardForm
