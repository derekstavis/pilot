import React from 'react'

import CaptureForm from '../../../../src/containers/Capture/Form'

const CaptureFormExample = () => (
  <CaptureForm
    t={string => string}
    transaction={{
      authorized_amount: 1000,
      card_brand: 'Mastercard',
      card_first_digits: '4141',
      card_last_digits: '4141',
      installments: 5,
      payment_method: 'credit_card',
    }}
    customer={{
      name: 'Vagner S',
      email: 'vagnervst17@gmail.com',
    }}
  />
)

export default CaptureFormExample
