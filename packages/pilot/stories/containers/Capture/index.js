import React from 'react'
import PropTypes from 'prop-types'

import Capture from '../../../src/containers/Capture'

const CaptureExample = ({ stepStatus }) => (
  <Capture
    isOpen
    stepStatus={stepStatus}
    t={string => string}
    transaction={{
      authorized_amount: 1000,
      installments: 1,
      card_first_digits: '4111',
      card_last_digits: '1111',
      card_brand: 'Mastercard',
      payment_method: 'credit_card',
      customer: {
        name: 'John Doe',
        email: 'johndoe@email.com',
      },
    }}
  />
)

CaptureExample.propTypes = {
  stepStatus: PropTypes.shape({
    confirmation: PropTypes.oneOf([
      'current', 'error', 'pending', 'success',
    ]),
    result: PropTypes.oneOf([
      'current', 'error', 'pending', 'success',
    ]),
  }),
}

CaptureExample.defaultProps = {
  stepStatus: {
    confirmation: 'current',
    result: 'pending',
  },
}

export default CaptureExample
