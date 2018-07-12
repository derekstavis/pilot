import React from 'react'
import { storiesOf } from '@storybook/react'

import AnticipationForm from './Anticipation/Form'
import AddAccount from './AddRecipient/BankAccountStep/AddAccount'
import BankAccountStep from './AddRecipient/BankAccountStep'
import BoletoForm from './Refund/BoletoForm'
import BoletoRefundConfirm from './Refund/BoletoConfirmation'
import BoletoRefundResult from './Refund/BoletoResult'
import CardConfirmation from './Refund/CardConfirmation'
import CardForm from './Refund/CardForm'
import CardResult from './Refund/CardResult'
import Balance from './Balance'
import {
  ManualReviewApproveForm,
  ManualReviewRefuseForm,
} from './ManualReview/Form'
import RecipientListState from './RecipientList'

import {
  ManualReviewApproveResult,
  ManualReviewRefuseResult,
  ManualReviewErrorResult,
} from './ManualReview/Result'
import {
  ManualReviewStepApproveConfirmation,
  ManualReviewStepApproveResult,
  ManualReviewStepRefuseConfirmation,
  ManualReviewStepRefuseResult,
  ManualReviewStepResultError,
} from './ManualReview'
import {
  BoletoRefund,
  CreditCardRefund,
} from './Refund'
import IdentificationStep from './AddRecipient/IdentificationStep'
import Reprocess from './Reprocess'
import ReprocessForm from './Reprocess/Form'
import ReprocessResult from './Reprocess/Result'
import SelectAccount from './AddRecipient/BankAccountStep/SelectAccount'
import Withdraw from './Withdraw'
import WithdrawConfirmation from './Withdraw/Confirmation'
import WithdrawForm from './Withdraw/Form'
import WithdrawResultSuccess from './Withdraw/Result/Success'
import WithdrawResultError from './Withdraw/Result/Error'
import {
  AnticipationConfirmationDisabled,
  AnticipationConfirmationWithAutomaticTransfer,
  AnticipationConfirmationWithError,
  AnticipationConfirmationWithoutAutomaticTransfer,
} from './Anticipation/Confirmation'
import {
  AnticipationResultError,
  AnticipationResultWithAutomaticTransfer,
  AnticipationResultWithoutAutomaticTransfer,
} from './Anticipation/Result'
import Anticipation from './Anticipation'

storiesOf('Containers', module)
  .add('Anticipation Form', () => (
    <AnticipationForm />
  ))
  .add('Add Account', () => (
    <AddAccount />
  ))
  .add('Bank Account Step', () => (
    <BankAccountStep />
  ))
  .add('Recipient list', () => (
    <RecipientListState />
  ))
  .add('Recipient identification step', () => (
    <IdentificationStep />
  ))
  .add('Manual review approve form', () => (
    <ManualReviewApproveForm />
  ))
  .add('Manual review refuse form', () => (
    <ManualReviewRefuseForm />
  ))
  .add('Manual review approve result', () => (
    <ManualReviewApproveResult />
  ))
  .add('Manual review refuse result', () => (
    <ManualReviewRefuseResult />
  ))
  .add('Manual review result error', () => (
    <ManualReviewErrorResult />
  ))
  .add('Manual review step approve confirmation', () => (
    <ManualReviewStepApproveConfirmation />
  ))
  .add('Manual review step approve result', () => (
    <ManualReviewStepApproveResult />
  ))
  .add('Manual review step refuse confirmation', () => (
    <ManualReviewStepRefuseConfirmation />
  ))
  .add('Manual review step refuse result', () => (
    <ManualReviewStepRefuseResult />
  ))
  .add('Manual review step result error', () => (
    <ManualReviewStepResultError />
  ))
  .add('Boleto form', () => (
    <BoletoForm />
  ))
  .add('Boleto refund confirm', () => (
    <BoletoRefundConfirm />
  ))
  .add('Boleto refund result', () => (
    <BoletoRefundResult />
  ))
  .add('Card refund confirmation', () => (
    <CardConfirmation />
  ))
  .add('Card refund result', () => (
    <CardResult />
  ))
  .add('Card refund form', () => (
    <CardForm />
  ))
  .add('Boleto transaction refund', () => (
    <BoletoRefund />
  ))
  .add('Card transaction refund', () => (
    <CreditCardRefund />
  ))
  .add('Balance', () => (
    <Balance />
  ))
  .add('Reprocess form', () => (
    <ReprocessForm />
  ))
  .add('Reprocess result', () => (
    <ReprocessResult />
  ))
  .add('Reprocess step confirmation', () => (
    <Reprocess
      statusMessage=""
      stepStatus={{
        confirmation: 'current',
        result: null,
      }}
    />
  ))
  .add('Reprocess step result', () => (
    <Reprocess
      statusMessage="Success!"
      stepStatus={{
        confirmation: 'success',
        result: 'current',
      }}
    />
  ))
  .add('Reprocess step result error', () => (
    <Reprocess
      statusMessage="Internal server error"
      stepStatus={{
        confirmation: 'success',
        result: 'error',
      }}
    />
  ))
  .add('Select Account', () => (
    <SelectAccount />
  ))
  .add('Withdraw', () => (
    <Withdraw />
  ))
  .add('WithdrawConfirmation', () => (
    <WithdrawConfirmation />
  ))
  .add('WithdrawForm', () => (
    <WithdrawForm />
  ))
  .add('Withdraw Result Success', () => (
    <WithdrawResultSuccess />
  ))
  .add('Withdraw Result Error', () => (
    <WithdrawResultError />
  ))
  .add('Anticipation Confirmation with automatic transfer', () => (
    <AnticipationConfirmationWithAutomaticTransfer />
  ))
  .add('Anticipation Confirmation without automatic transfer', () => (
    <AnticipationConfirmationWithoutAutomaticTransfer />
  ))
  .add('Anticipation Confirmation with error', () => (
    <AnticipationConfirmationWithError />
  ))
  .add('Anticipation Confirmation disabled', () => (
    <AnticipationConfirmationDisabled />
  ))
  .add('Anticipation Result with automatic transfer', () => (
    <AnticipationResultWithAutomaticTransfer />
  ))
  .add('Anticipation Result without automatic transfer', () => (
    <AnticipationResultWithoutAutomaticTransfer />
  ))
  .add('Anticipation Result error', () => (
    <AnticipationResultError />
  ))
  .add('Anticipation', () => (
    <Anticipation />
  ))
