import { assoc } from 'ramda'
import isCapturable from './isCapturable'
import { transaction as transactionMock } from './mocks/fromRequests.json'

describe('isCapturable', () => {
  it('should return false if status is not authorized', () => {
    const processing = assoc('status', 'processing', transactionMock)
    const waitingPayment = assoc('status', 'waiting_payment', transactionMock)
    const refused = assoc('status', 'refused', transactionMock)
    const paid = assoc('status', 'paid', transactionMock)

    expect(isCapturable(processing)).toBe(false)
    expect(isCapturable(waitingPayment)).toBe(false)
    expect(isCapturable(refused)).toBe(false)
    expect(isCapturable(paid)).toBe(false)
  })

  it('should return true if status is authorized', () => {
    const transaction = assoc('status', 'authorized', transactionMock)
    expect(isCapturable(transaction)).toBe(true)
  })
})
