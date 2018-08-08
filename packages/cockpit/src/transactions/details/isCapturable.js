import moment from 'moment'
import {
  allPass,
  propEq,
} from 'ramda'

const isCapturable = (transaction) => {
  const isAuthorized = propEq('status', 'authorized')
  const isApiKey = propEq('referer', 'api_key')
  const isCreditCard = propEq('payment_method', 'credit_card')

  const checkTransaction = allPass([
    isAuthorized,
    isApiKey,
    isCreditCard,
  ])

  return checkTransaction(transaction)
}

export default isCapturable
