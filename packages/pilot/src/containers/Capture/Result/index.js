import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'former-kit'

import decimalCurrency from '../../../formatters/decimalCurrency'
import CaptureDetails from '../../../components/CaptureDetails'

import style from './style.css'

const Result = ({
  customer, t, transaction,
}) => (
  <div>
    <div className={style.image} />
    <CaptureDetails
      labels={{
        amount: t('pages.transaction.header.card_amount'),
        captureAmount: t('pages.capture.value_to_capture'),
        cardBrand: t('models.card.brand'),
        cardNumber: t('models.card.number'),
        customerName: t('models.customer.name'),
        customerEmail: t('models.customer.email'),
        installments: t('installments'),
      }}
      contents={{
        amount: decimalCurrency(transaction.authorized_amount),
        captureAmount: decimalCurrency(transaction.paid_amount),
        cardBrand: transaction.card_brand,
        cardNumber: `${transaction.card_first_digits} •••• •••• ${transaction.card_last_digits}`,
        customerName: customer.name,
        customerEmail: customer.email,
        installments: transaction.installments,
      }}
    />
    <div className={style.actions}>
      <Button>{t('view_transaction')}</Button>
    </div>
  </div>
)

Result.propTypes = {
  transaction: PropTypes.shape({
    authorized_amount: PropTypes.number.isRequired,
    installments: PropTypes.number,
    card_first_digits: PropTypes.string,
    card_last_digits: PropTypes.string,
    card_brand: PropTypes.string,
    payment_method: PropTypes.string,
  }).isRequired,
  customer: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  t: PropTypes.func.isRequired,
}

Result.defaultProps = {
  customer: null,
}

export default Result
