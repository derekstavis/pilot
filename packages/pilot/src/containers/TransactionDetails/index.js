/* eslint-disable camelcase */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  __,
  always,
  applySpec,
  anyPass,
  both,
  contains,
  either,
  equals,
  flatten,
  head,
  ifElse,
  isEmpty,
  isNil,
  juxt,
  map,
  negate,
  path,
  pathOr,
  pipe,
  prop,
  propEq,
  reject,
  sum,
  unless,
  when,
} from 'ramda'
import {
  Alert,
  Card,
  CardContent,
  CardTitle,
  Col,
  Grid,
  Row,
  Legend,
} from 'former-kit'
import IconInfo from 'emblematic-icons/svg/Info32.svg'
import IconCheck from 'emblematic-icons/svg/Check24.svg'
import IconClearClose from 'emblematic-icons/svg/ClearClose24.svg'
import IconReverse from 'emblematic-icons/svg/Reverse24.svg'
import ReprocessIcon from 'emblematic-icons/svg/Reprocess24.svg'
import currencyFormatter from '../../formatters/currency'
import CustomerCard from '../../components/CustomerCard'
import decimalCurrencyFormatter from '../../formatters/decimalCurrency'
import DetailsHead from '../../components/DetailsHead'
import Event from '../../components/Event'
import PaymentBoleto from '../../components/PaymentBoleto'
import PaymentCard from '../../components/PaymentCard'
import RecipientList from '../../containers/RecipientList'
import RiskLevel from '../../components/RiskLevel'
import statusLegends from '../../models/statusLegends'
import TotalDisplay from '../../components/TotalDisplay'
import TransactionDetailsCard from '../../components/TransactionDetailsCard'
import transactionOperationTypes from '../../models/transactionOperationTypes'
import TreeView from '../../components/TreeView'
import style from './style.css'
import formatCpfCnpj from '../../formatters/cpfCnpj'
import formatDate from '../../formatters/longDate'

const isZeroOrNegative = value => value <= 0

const formatValues = map(when(
  isNil,
  always(0)
))

const getOutAmount = pipe(
  formatValues,
  sum,
  unless(
    isZeroOrNegative,
    negate
  )
)

const getOperationLegendStatus = pipe(
  juxt([
    prop('type'),
    always('status'),
    prop('status'),
  ]),
  pathOr({}, __, transactionOperationTypes)
)

const isEmptyOrNull = anyPass([isEmpty, isNil])

const isChargebackStatus = either(
  contains('chargeback'),
  contains('chargedback')
)

const isChargebackedTransaction = pipe(
  prop('status'),
  isChargebackStatus
)

const isBoletoTransaction = pipe(
  path(['payment', 'method']),
  equals('boleto')
)

const isWaitingPaymentTransaction = pipe(
  prop('status'),
  equals('waiting_payment')
)

const isBoletoWaitingPayment = both(
  isBoletoTransaction,
  isWaitingPaymentTransaction
)

const isPendingReviewTransaction = propEq('status', 'pending_review')

const showStatusAlert = either(
  isChargebackedTransaction,
  isBoletoWaitingPayment
)

const formatDocument = applySpec({
  type: prop('type'),
  number: pipe(
    prop('number'),
    formatCpfCnpj
  ),
})

const formatCustomerBirthDay = customer => ({
  ...customer,
  birthday: !isNil(customer.birthday) ? formatDate(customer.birthday) : null,
})

const getDefaultDocumentNumber = pipe(
  prop('documents'),
  ifElse(
    either(isNil, isEmpty),
    always(null),
    pipe(
      head,
      formatDocument,
      prop('number')
    )
  )
)

const formatCustomerAddress = (customer) => {
  if (!customer.address) {
    return customer
  }

  const { id, ...address } = customer.address

  return {
    ...address,
    ...customer,
  }
}

const formatCustomerDocuments = customer => ({
  ...customer,
  document_number: getDefaultDocumentNumber(customer),
})

const formatCustomerData = pipe(
  formatCustomerBirthDay,
  formatCustomerDocuments,
  formatCustomerAddress
)

const getHeaderAmountLabel = (transaction, headerLabels) => {
  if (isBoletoTransaction(transaction)) {
    return headerLabels.boletoAmountLabel
  }
  return headerLabels.cardAmountLabel
}

const renderLegend = status => (
  <Legend
    color={statusLegends[status].color}
    acronym={statusLegends[status].text}
    hideLabel
  >
    { statusLegends[status].acronym }
  </Legend>
)

const validatePreviousTransactionRedirect = (props, propName) => {
  if (propName === 'onPreviousTransactionRedirect') {
    const {
      onPreviousTransactionRedirect,
      transaction: {
        previousId,
      },
    } = props

    if (previousId && isNil(onPreviousTransactionRedirect)) {
      throw new Error('The prop onPreviousTransactionRedirect must be a function when transaction.previousId is not null')
    }
  }
}

const validateNextTransactionRedirect = (props, propName) => {
  if (propName === 'onNextTransactionRedirect') {
    const {
      onNextTransactionRedirect,
      transaction: {
        nextId,
      },
      nextTransactionId,
    } = props

    if ((nextId || nextTransactionId) && isNil(onNextTransactionRedirect)) {
      throw new Error('The prop onNextTransactionRedirect must be a function when transaction.nextId is not null')
    }
  }
}

const validateRefundFunction = (props, propName) => {
  if (propName === 'onRefund') {
    const {
      onRefund,
      transaction: {
        capabilities,
      },
    } = props

    if (capabilities && capabilities.refundable && isNil(onRefund)) {
      throw new Error('The prop onRefund must be a function when transaction.capabilities.refundable is true')
    }
  }
}

const validateReprocessFunction = (props, propName) => {
  if (propName === 'onReprocess') {
    const {
      onReprocess,
      transaction: {
        capabilities,
      },
    } = props

    if (capabilities && capabilities.reprocessable && isNil(onReprocess)) {
      throw new Error('The prop onReprocess must be a function when transaction.capabilities.reprocessable is true')
    }
  }
}

class TransactionDetails extends Component {
  constructor (props) {
    super(props)

    this.getActions = this.getActions.bind(this)
    this.renderAlertInfo = this.renderAlertInfo.bind(this)
    this.renderBoleto = this.renderBoleto.bind(this)
    this.renderEvents = this.renderEvents.bind(this)
    this.renderOutAmountSubTitle = this.renderOutAmountSubTitle.bind(this)
    this.renderPayment = this.renderPayment.bind(this)
    this.renderPaymentCard = this.renderPaymentCard.bind(this)
  }


  getActions () {
    const {
      headerLabels,
      nextTransactionId,
      transaction,
      onManualReviewRefuse,
      onManualReviewApprove,
      permissions,
      onRefund,
      onReprocess,
      transaction: {
        capabilities,
      },
    } = this.props

    const onReprocessAction = {
      icon: <ReprocessIcon width={12} height={12} />,
      onClick: onReprocess,
      title: 'Reprocessar',
    }

    const onRefundAction = {
      icon: <IconReverse width={12} height={12} />,
      onClick: onRefund,
      title: 'Estornar',
    }

    const getManualReviewTransactionActions = (trx) => {
      if (isPendingReviewTransaction(trx) && permissions.manualReview) {
        return [
          {
            icon: <IconClearClose width={12} height={12} />,
            onClick: onManualReviewRefuse,
            title: headerLabels.refuseLabel,
          },
          {
            icon: <IconCheck width={12} height={12} />,
            onClick: onManualReviewApprove,
            title: headerLabels.approveLabel,
          },
        ]
      }
      return []
    }

    const detailsHeadActions = pipe(
      juxt([
        ifElse(
          both(
            propEq('reprocessable', true),
            always(isEmptyOrNull(nextTransactionId))
          ),
          always(onReprocessAction),
          always(null)
        ),
        ifElse(
          propEq('refundable', true),
          always(onRefundAction),
          always(null)
        ),
        always(getManualReviewTransactionActions(transaction)),
      ]),
      flatten,
      reject(isNil)
    )

    return detailsHeadActions(capabilities)
  }

  renderAlertInfo () {
    const {
      alertLabels,
      boletoWarningMessage,
      transaction,
    } = this.props

    if (isBoletoWaitingPayment(transaction)) {
      return (
        <span>
          {boletoWarningMessage}
        </span>
      )
    }
    return (
      <span>
        <strong> {alertLabels.chargeback_reason_label} </strong>
        <span> {alertLabels.chargeback_reason} </span>
        <strong>
          {alertLabels.reason_code}
        </strong>
      </span>
    )
  }

  renderBoleto () {
    const {
      transaction: {
        boleto: {
          barcode,
          due_date,
        },
      },
      paymentBoletoLabels,
      onCopyBoletoUrl,
      onShowBoleto,
    } = this.props

    return (
      <PaymentBoleto
        barcode={barcode}
        copyBarcodeFeedback={paymentBoletoLabels.feedback}
        copyBarcodeLabel={paymentBoletoLabels.copy}
        dueDate={moment(due_date).format('L')}
        dueDateLabel={paymentBoletoLabels.due_date}
        onCopy={onCopyBoletoUrl}
        onShow={onShowBoleto}
        showBoletoLabel={paymentBoletoLabels.show}
        title={paymentBoletoLabels.title}
      />
    )
  }

  renderPaymentCard () {
    const {
      transaction: {
        card: {
          first_digits,
          last_digits,
          brand_name,
          holder_name,
        },
      },
      paymentCardLabels,
    } = this.props

    return (
      <PaymentCard
        title={paymentCardLabels.title}
        first={first_digits}
        last={last_digits}
        holderName={holder_name}
        brand={brand_name}
      />
    )
  }

  renderPayment () {
    const { payment } = this.props.transaction

    if (payment.method === 'credit_card') {
      return this.renderPaymentCard()
    }
    return this.renderBoleto()
  }

  renderOutAmountSubTitle () {
    const { totalDisplayLabels } = this.props

    return (
      <span>
        <div>
          {totalDisplayLabels.mdr}
        </div>
        <div>
          {totalDisplayLabels.cost}
        </div>
        <div>
          {totalDisplayLabels.refund}
        </div>
      </span>
    )
  }

  renderEvents () {
    const {
      transaction: { operations },
      atLabel,
    } = this.props

    return operations.map((operation, index) => {
      const {
        created_at,
        cycle,
        status,
        type,
      } = operation
      const date = moment(created_at)
      const key = `${type}_${status}_${(cycle || 0)}_${index}`
      const legendStatus = getOperationLegendStatus(operation)
      const number = operations.length - index

      return (
        <Event
          active={index === 0}
          collapsed={index !== 0}
          color={legendStatus.color}
          key={key}
          number={number}
          title={legendStatus.title}
        >
          <section>
            <p>
              {
                `${date.format('L')} ${atLabel} ${date.format('HH:mm')}`
              }
            </p>
          </section>
        </Event>
      )
    })
  }

  renderReprocessAlerts () {
    const {
      nextTransactionId,
      onNextTransactionRedirect,
      onPreviousTransactionRedirect,
      reprocessLabels,
      transaction,
    } = this.props
    const nextId = transaction.nextId || nextTransactionId

    return (
      <Fragment>
        {(nextId && nextId !== transaction.id) &&
          <Row stretch>
            <Col
              desk={12}
              palm={12}
              tablet={12}
              tv={12}
            >
              <Alert
                action={reprocessLabels.showNext}
                icon={<IconInfo height={16} width={16} />}
                onDismiss={onNextTransactionRedirect}
                type="info"
              >
                <span>
                  {reprocessLabels.nextAlert}
                  <strong> {nextId} </strong>
                </span>
              </Alert>
            </Col>
          </Row>
        }
        {transaction.previousId &&
          <Row stretch>
            <Col
              desk={12}
              tv={12}
              tablet={12}
              palm={12}
            >
              <Alert
                action={reprocessLabels.showPrevious}
                icon={<IconInfo height={16} width={16} />}
                onDismiss={onPreviousTransactionRedirect}
                type="info"
              >
                <span>
                  {reprocessLabels.previousAlert}
                  <strong> {transaction.previousId} </strong>
                </span>
              </Alert>
            </Col>
          </Row>
        }
      </Fragment>
    )
  }

  render () {
    const {
      alertLabels,
      customerLabels,
      eventsLabels,
      headerLabels,
      installmentColumns,
      metadataTitle,
      recipientsLabels,
      riskLevelsLabels,
      totalDisplayLabels,
      transaction,
      transactionDetailsLabels,
    } = this.props

    const {
      acquirer,
      amount,
      card,
      customer,
      id,
      payment,
      recipients,
      soft_descriptor,
      status,
      subscription,
      metadata,
    } = transaction

    const transactionDetailsContent = {
      acquirer_name: acquirer ? acquirer.name : null,
      acquirer_response_code: acquirer ? acquirer.response_code : null,
      authorization_code: acquirer ? acquirer.response_code : null,
      capture_method: card ? card.capture_method : null,
      nsu: acquirer ? acquirer.sequence_number : null,
      soft_descriptor,
      subscription_id: subscription ? subscription.id : null,
      tid: id,
    }

    if (isEmpty(transaction)) {
      return (<div />)
    }

    const detailsHeadProperties = [
      {
        children: renderLegend(status),
        title: headerLabels.statusLabel,
      },
      {
        children: headerLabels.installments,
        title: headerLabels.installmentsLabel,
      },
      {
        children: currencyFormatter(amount),
        title: getHeaderAmountLabel(transaction, headerLabels),
      },
    ]

    if (transaction.risk_level !== 'unknown') {
      detailsHeadProperties.push({
        children: <RiskLevel level={transaction.risk_level} />,
        title: riskLevelsLabels[transaction.risk_level],
      })
    }

    return (
      <Grid>
        <Row stretch>
          <Col
            desk={12}
            tv={12}
            tablet={12}
            palm={12}
          >
            <Card>
              <CardContent>
                <DetailsHead
                  actions={this.getActions()}
                  identifier={`#${id}`}
                  properties={detailsHeadProperties}
                  title={headerLabels.title}
                />
              </CardContent>
            </Card>
          </Col>
        </Row>

        {this.renderReprocessAlerts()}

        <Row stretch>
          <Col
            desk={3}
            palm={12}
            tablet={6}
            tv={3}
          >
            { this.renderPayment() }
          </Col>
          <Col
            desk={3}
            palm={12}
            tablet={6}
            tv={3}
          >
            <Card>
              <CardContent className={style.content}>
                <TotalDisplay
                  amount={payment.paid_amount}
                  color="#37cc9a"
                  subtitle={totalDisplayLabels.captured_at}
                  title={totalDisplayLabels.paid_amount}
                />
              </CardContent>
            </Card>
          </Col>
          <Col
            desk={3}
            palm={12}
            tablet={6}
            tv={3}
          >
            <Card>
              <CardContent className={style.content}>
                <TotalDisplay
                  amount={
                    getOutAmount([
                      payment.refund_amount,
                      payment.cost_amount,
                      payment.mdr_amount,
                    ])
                  }
                  color="#ff796f"
                  subtitle={this.renderOutAmountSubTitle()}
                  title={totalDisplayLabels.out_amount}
                />
              </CardContent>
            </Card>
          </Col>
          <Col
            desk={3}
            palm={12}
            tablet={6}
            tv={3}
          >
            <Card>
              <CardContent className={style.content}>
                <TotalDisplay
                  amount={payment.net_amount}
                  color="#4ca9d7"
                  subtitle={totalDisplayLabels.receive_date}
                  title={totalDisplayLabels.net_amount}
                />
              </CardContent>
            </Card>
          </Col>
        </Row>

        {showStatusAlert(transaction) &&
          <Row stretch>
            <Col
              desk={12}
              palm={12}
              tablet={12}
              tv={12}
            >
              <Alert
                action={alertLabels.resubmit}
                icon={<IconInfo height={16} width={16} />}
                type="info"
              >
                {this.renderAlertInfo()}
              </Alert>
            </Col>
          </Row>
        }

        <Row>
          <Col
            desk={9}
            palm={12}
            tablet={12}
            tv={9}
          >
            <Grid>
              {!isEmptyOrNull(recipients) &&
                <Row>
                  <Col
                    desk={12}
                    palm={12}
                    tablet={12}
                    tv={12}
                  >
                    <RecipientList
                      collapseInstallmentTitle={recipientsLabels.collapseInstallmentTitle}
                      expandInstallmentTitle={recipientsLabels.expandInstallmentTitle}
                      installmentsTableColumns={installmentColumns}
                      installmentTotalLabel={recipientsLabels.installmentTotalLabel}
                      liabilitiesLabel={recipientsLabels.liabilitiesLabel}
                      netAmountLabel={recipientsLabels.netAmountLabel}
                      noRecipientLabel={recipientsLabels.noRecipientLabel}
                      outAmountLabel={recipientsLabels.outAmountLabel}
                      paymentMethod={payment.method}
                      recipients={recipients}
                      statusLabel={recipientsLabels.statusLabel}
                      title={recipientsLabels.title}
                      total={decimalCurrencyFormatter(payment.paid_amount)}
                      totalRecipientsLabel={recipientsLabels.totalRecipientsLabel}
                      totalTitle={recipientsLabels.totalTitle}
                    />
                  </Col>
                </Row>
              }
              {!isEmptyOrNull(customer) &&
                <Row>
                  <Col
                    desk={12}
                    palm={12}
                    tablet={12}
                    tv={12}
                  >
                    <CustomerCard
                      contents={formatCustomerData(customer)}
                      labels={customerLabels}
                      title={customerLabels.title}
                    />
                  </Col>
                </Row>
              }
              <Row>
                <Col
                  desk={12}
                  palm={12}
                  tablet={12}
                  tv={12}
                >
                  <TransactionDetailsCard
                    contents={transactionDetailsContent}
                    labels={transactionDetailsLabels}
                    title={transactionDetailsLabels.title}
                  />
                </Col>
              </Row>
              {!isEmptyOrNull(metadata) &&
                <Row>
                  <Col
                    desk={12}
                    palm={12}
                    tablet={12}
                    tv={12}
                  >
                    <TreeView
                      data={metadata}
                      title={metadataTitle}
                    />
                  </Col>
                </Row>
              }
            </Grid>
          </Col>
          <Col
            desk={3}
            palm={12}
            tablet={12}
            tv={3}
          >
            <Card>
              <CardTitle title={eventsLabels.title} />
              <div>
                {this.renderEvents()}
              </div>
            </Card>
          </Col>
        </Row>
      </Grid>
    )
  }
}

TransactionDetails.propTypes = {
  alertLabels: PropTypes.shape({
    chargeback_reason: PropTypes.string,
    chargeback_reason_label: PropTypes.string,
    reason_code: PropTypes.string,
    resubmit: PropTypes.string,
  }).isRequired,
  atLabel: PropTypes.string.isRequired,
  boletoWarningMessage: PropTypes.string.isRequired,
  customerLabels: PropTypes.shape({
    birthday: PropTypes.string,
    city: PropTypes.string,
    complement: PropTypes.string,
    document_number: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    neighborhood: PropTypes.string,
    number: PropTypes.string,
    phone: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    title: PropTypes.string,
    zip_code: PropTypes.string,
  }).isRequired,
  eventsLabels: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  headerLabels: PropTypes.shape({
    installments: PropTypes.string,
    status: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  installmentColumns: PropTypes.arrayOf(PropTypes.shape({
    costs: PropTypes.shape({
      mdr: PropTypes.number,
      anticipation: PropTypes.number,
      chargeback: PropTypes.number,
      refund: PropTypes.number,
    }),
    net_amount: PropTypes.number,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    original_payment_date: PropTypes.instanceOf(moment),
    payment_date: PropTypes.instanceOf(moment),
    status: PropTypes.string,
  })).isRequired,
  nextTransactionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onCopyBoletoUrl: PropTypes.func,
  onDismissAlert: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  onManualReviewApprove: PropTypes.func,
  onManualReviewRefuse: PropTypes.func,
  onNextTransactionRedirect: validateNextTransactionRedirect,
  onPreviousTransactionRedirect: validatePreviousTransactionRedirect,
  onRefund: validateRefundFunction,
  onReprocess: validateReprocessFunction,
  onShowBoleto: PropTypes.func,
  paymentBoletoLabels: PropTypes.shape({
    copy: PropTypes.string,
    due_date: PropTypes.string,
    show: PropTypes.string,
    title: PropTypes.string,
    feedback: PropTypes.string,
  }).isRequired,
  paymentCardLabels: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  permissions: PropTypes.shape({
    manualReview: PropTypes.bool.isRequired,
    refund: PropTypes.bool.isRequired,
    reprocess: PropTypes.bool.isRequired,
  }).isRequired,
  riskLevelsLabels: PropTypes.shape({
    very_low: PropTypes.string,
    low: PropTypes.string,
    moderated: PropTypes.string,
    high: PropTypes.string,
    very_high: PropTypes.string,
  }).isRequired,
  recipientsLabels: PropTypes.shape({
    collapseInstallmentTitle: PropTypes.string,
    expandInstallmentTitle: PropTypes.string,
    installmentTotalLabel: PropTypes.string,
    liabilitiesLabel: PropTypes.string,
    netAmountLabel: PropTypes.string,
    noRecipientLabel: PropTypes.string,
    outAmountLabel: PropTypes.string,
    statusLabel: PropTypes.string,
    title: PropTypes.string,
    totalRecipientsLabel: PropTypes.string,
    totalTitle: PropTypes.string,
  }).isRequired,
  reprocessLabels: PropTypes.shape({
    previousAlert: PropTypes.string,
    nextAlert: PropTypes.string,
    showPrevious: PropTypes.string,
    showNext: PropTypes.string,
  }).isRequired,
  totalDisplayLabels: PropTypes.shape({
    captured_at: PropTypes.string,
    mdr: PropTypes.string,
    cost: PropTypes.string,
    net_amount: PropTypes.string,
    out_amount: PropTypes.string,
    paid_amount: PropTypes.string,
    receive_date: PropTypes.string,
    refund: PropTypes.string,
  }).isRequired,
  transaction: PropTypes.shape({
    boleto: PropTypes.shape({
      barcode: PropTypes.string,
      due_date: PropTypes.instanceOf(moment),
      url: PropTypes.string,
    }),
    capabilities: PropTypes.shape({
      reprocessable: PropTypes.bool,
      refundable: PropTypes.bool,
    }),
    created_at: PropTypes.instanceOf(moment),
    external_id: PropTypes.string,
    id: PropTypes.number,
    updated_at: PropTypes.instanceOf(moment),
    soft_descriptor: PropTypes.string,
    status: PropTypes.string,
    status_reason: PropTypes.string,
    payment: PropTypes.shape({
      method: PropTypes.string,
      paid_amount: PropTypes.number,
      net_amount: PropTypes.number,
      cost_amount: PropTypes.number,
      refund_amount: PropTypes.number,
      installments: PropTypes.number,
    }),
    acquirer: PropTypes.shape({
      name: PropTypes.string,
      response_code: PropTypes.string,
      sequence_number: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      transaction_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
    antifraud: PropTypes.object, // eslint-disable-line
    customer: PropTypes.shape({
      name: PropTypes.string,
      document_number: PropTypes.string,
      document_type: PropTypes.string,
      email: PropTypes.string,
      birth_date: PropTypes.string,
      country: PropTypes.string,
      phones: PropTypes.arrayOf(PropTypes.string),
    }),
    card: PropTypes.shape({
      brand_name: PropTypes.string,
      first_digits: PropTypes.string,
      holder_name: PropTypes.string,
      international: PropTypes.bool,
      last_digits: PropTypes.string,
      pin_mode: PropTypes.string,
    }),
    metadata: PropTypes.object, // eslint-disable-line
    operations: PropTypes.arrayOf(PropTypes.shape({
      created_at: PropTypes.instanceOf(moment),
      type: PropTypes.string,
      status: PropTypes.string,
      cycle: PropTypes.number,
    })),
    recipients: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.number,
      net_amount: PropTypes.number,
      liabilities: PropTypes.arrayOf(PropTypes.string),
      installments: PropTypes.arrayOf(PropTypes.shape({
        number: PropTypes.number,
        payment_date: PropTypes.instanceOf(moment),
        original_payment_date: PropTypes.instanceOf(moment),
        created_at: PropTypes.instanceOf(moment),
        amount: PropTypes.number,
        net_amount: PropTypes.number,
        costs: PropTypes.shape({
          mdr: PropTypes.number,
          anticipation: PropTypes.number,
        }),
      })),
    })),
  }).isRequired,
  transactionDetailsLabels: PropTypes.shape({
    acquirer_name: PropTypes.string,
    acquirer_response_code: PropTypes.string,
    authorization_code: PropTypes.string,
    capture_method: PropTypes.string,
    nsu: PropTypes.string,
    soft_descriptor: PropTypes.string,
    subscription_id: PropTypes.string,
    tid: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  metadataTitle: PropTypes.string.isRequired,
}

TransactionDetails.defaultProps = {
  nextTransactionId: null,
  onCopyBoletoUrl: null,
  onDismissAlert: null,
  onManualReviewApprove: null,
  onManualReviewRefuse: null,
  onExport: null,
  onNextTransactionRedirect: null,
  onPreviousTransactionRedirect: null,
  onRefund: null,
  onReprocess: null,
  onShowBoleto: null,
}

export default TransactionDetails
