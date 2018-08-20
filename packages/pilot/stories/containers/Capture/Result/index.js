import React from 'react'

import Result from '../../../../src/containers/Capture/Result'

const CaptureResult = () => (
  <Result
    t={string => string}
    transaction={{
      authorized_amount: 1000,
      card_brand: 'Mastercard',
      card_first_digits: '4141',
      card_last_digits: '4141',
      installments: 5,
      paid_amount: 1000,
      payment_method: 'credit_card',
    }}
    customer={{
      name: 'Vagner S',
      email: 'vagnervst17@gmail.com',
    }}
  />
)

export default CaptureResult
