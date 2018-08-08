import moment from 'moment'
import {
  assoc,
  merge,
} from 'ramda'
import isCapturable from './isCapturable'
import { transaction as transactionMock } from './mocks/fromRequests.json'

describe('isCapturable', () => {
  it('should return false if status is not authorized', () => {
    const transaction = assoc('status', 'processing', transactionMock)
    expect(isCapturable(transaction)).toBe(false)
  })

  it('should return true if status is authorized', () => {
    const transaction = assoc('status', 'authorized', transactionMock)
    expect(isCapturable(transaction)).toBe(true)
  })

  it('should return false if it is a banking ticket', () => {
    const transaction = assoc('payment_method', 'boleto', transactionMock)
    expect(isCapturable(transaction)).toBe(false)
  })

  it('should return false if it was created with encryption key', () => {
    const transaction = merge(transactionMock, {
      status: 'authorized',
      referer: 'encryption_key',
    })
    expect(isCapturable(transaction)).toBe(false)
  })
})
