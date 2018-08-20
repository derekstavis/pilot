import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ModalContent,
} from 'former-kit'

import decimalCurrency from '../../../formatters/decimalCurrency'
import CurrencyInput from '../../../components/CurrencyInput'
import CaptureDetails from '../../../components/CaptureDetails'

import style from './style.css'

const CaptureForm = ({ customer, t, transaction }) => (
  <form>
    <ModalContent>
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
          captureAmount: <CurrencyInput value="0" />,
          cardBrand: transaction.card_brand,
          cardNumber: `${transaction.card_first_digits} •••• •••• ${transaction.card_last_digits}`,
          customerName: customer.name,
          customerEmail: customer.email,
          installments: transaction.installments,
        }}
      />
    </ModalContent>
    <div className={style.actions}>
      <Button
        type="submit"
      >
        {t('pages.capture.capture_action')}
      </Button>
    </div>
  </form>
)

CaptureForm.propTypes = {
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

CaptureForm.defaultProps = {
  customer: null,
}

export default CaptureForm
