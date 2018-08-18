import {
  allPass,
  propEq,
} from 'ramda'

const isCapturable = (transaction) => {
  const isAuthorized = propEq('status', 'authorized')

  const checkTransaction = allPass([
    isAuthorized,
  ])

  return checkTransaction(transaction)
}

export default isCapturable
