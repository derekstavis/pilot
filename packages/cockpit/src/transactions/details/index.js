import {
  all,
  props,
  resolve,
} from 'bluebird'

import {
  __,
  always,
  assoc,
  either,
  head,
  ifElse,
  isEmpty,
  isNil,
  map,
  merge,
  of,
  path,
  pathSatisfies,
  pick,
  pipe,
  prop,
  uncurryN,
} from 'ramda'

import buildResult from './result'
import isCapturable from './isCapturable'
import isRefundable from './isRefundable'
import isReprocessable from './isReprocessable'

const fetchRecipient = client => object =>
  client.recipients.find({ id: object.recipient_id })
    .then(recipient => merge(object, { recipient }))

const payableToRecipient = ifElse(
  either(isNil, isEmpty),
  always([]),
  pipe(
    head,
    pick(['recipient_id']),
    merge({
      charge_processing_fee: true,
      id: null,
      liable: true,
    }),
    of
  )
)

const fetchRecipients = uncurryN(2, client =>
  pipe(
    ifElse(
      pathSatisfies(isNil, ['transaction', 'split_rules']),
      pipe(
        prop('payables'),
        payableToRecipient
      ),
      path(['transaction', 'split_rules'])
    ),
    map(fetchRecipient(client)),
    all
  ))

const findReprocessedTransaction = ({ id }) => ({
  metadata: {
    pagarme_original_transaction_id: id,
  },
})

const addCapabilities = client => (data) => {
  const canReprocess = client
    .transactions
    .find(findReprocessedTransaction(data.transaction))
    .then(res => (
      isReprocessable(data.transaction, res)
    ))

  return props({
    capturable: resolve(isCapturable(data.transaction)),
    refundable: resolve(isRefundable(data.transaction)),
    reprocessable: canReprocess,
  })
    .then(assoc('capabilities', __, data))
}

const details = client => transactionId =>
  props({
    antifraudAnalyses: client.antifraudAnalyses.find({ transactionId }),
    chargebackOperations: client.chargebackOperations.find({ transactionId }),
    gatewayOperations: client.gatewayOperations.find({ transactionId }),
    payables: client.payables.find({ transactionId }),
    reprocessed: client.transactions
      .find({
        metadata: {
          pagarme_original_transaction_id: transactionId,
        },
      }),
    transaction: client.transactions.find({ id: transactionId }),
  })
    .then(data => fetchRecipients(client, data)
      .then(assoc('split_rules', __, data)))
    .then(addCapabilities(client))
    .then(buildResult)

export default details
