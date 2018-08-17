import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  Alert,
  Button,
  Card,
  CardContent,
  CardSection,
  Col,
  Grid,
  Row,
} from 'former-kit'
import {
  always,
  cond,
  equals,
  gte,
  lt,
} from 'ramda'
import IconChecked from 'emblematic-icons/svg/Check32.svg'
import IconError from 'emblematic-icons/svg/ClearClose32.svg'
import IconExtract from 'emblematic-icons/svg/Extract24.svg'

import DataDisplay from '../../../components/DataDisplay'
import DetailsHead from '../../../components/DetailsHead'
import formatAccountType from '../../../formatters/accountType'
import formatAgencyAccount from '../../../formatters/agencyAccount'
import formatCpfCnpj from '../../../formatters/cpfCnpj'
import formatLongDate from '../../../formatters/longDate'
import Summary from '../../../components/Summary'
import TotalDisplay from '../../../components/TotalDisplay'
import TransferError from '../../../components/TransferError'

import style from './style.css'

const getIcon = cond([
  [equals('success'), always(<IconChecked height={16} width={16} />)],
  [equals('error'), always(<IconError height={16} width={16} />)],
])

const chooseTotalDisplayColor = cond([
  [Number.isNaN, always('#757575')],
  [lt(0), always('#37cc9a')],
  [gte(0), always('#ff796f')],
])

class AnticipationResult extends Component {
  constructor () {
    super()

    this.renderRecipient = this.renderRecipient.bind(this)
  }

  renderInformationRow () {
    const {
      amount,
      date,
      requested,
      t,
      totalCost,
    } = this.props

    return (
      <Summary>
        <DataDisplay
          title={t('pages.anticipation.date.label')}
          titleSize="small"
          value={formatLongDate(date)}
        />
        <TotalDisplay
          align="center"
          amount={requested}
          amountSize="large"
          color="#37cc9a"
          title={t('pages.anticipation.requested.title')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          align="center"
          amount={totalCost}
          amountSize="large"
          color="#ff796f"
          title={t('pages.anticipation.cost.title')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          align="center"
          amount={amount}
          amountSize="large"
          color={chooseTotalDisplayColor(amount)}
          title={t('pages.anticipation.amount.title')}
          titleColor="#757575"
          titleSize="small"
        />
      </Summary>
    )
  }

  renderRecipient () {
    const {
      bankAccount: {
        agencia,
        agencia_dv: agenciaDv,
        bank_code: bankCode,
        conta,
        conta_dv: contaDv,
        document_number: documentNumber,
        legal_name: legalName,
        type,
      },
      t,
    } = this.props

    return (
      <Row>
        <Col
          desk={12}
          palm={12}
          tablet={12}
          tv={12}
        >
          <CardSection>
            <CardContent>
              <DetailsHead
                identifier={legalName}
                properties={[
                  {
                    children: bankCode,
                    title: t('models.bank_account.bank'),
                  },
                  {
                    children: formatAgencyAccount(agencia, agenciaDv),
                    title: t('models.bank_account.agency'),
                  },
                  {
                    children: formatAgencyAccount(conta, contaDv),
                    title: t('models.bank_account.account'),
                  },
                  {
                    children: formatAccountType(t, type),
                    title: t('models.bank_account.account_type'),
                  },
                  {
                    children: formatCpfCnpj(documentNumber),
                    title: t('models.bank_account.document'),
                  },
                ]}
                title={t('models.bank_account.legal_name')}
              />
            </CardContent>
          </CardSection>
        </Col>
      </Row>
    )
  }

  render () {
    const {
      automaticTransfer,
      onTryAgain,
      onViewStatement,
      status,
      statusMessage,
      t,
      timeframe,
    } = this.props

    return (
      <Grid className={style.grid}>
        <Row>
          <Col
            desk={12}
            palm={12}
            tablet={12}
            tv={12}
          >
            <Alert
              icon={getIcon(status)}
              type={status}
            >
              <span>{statusMessage}</span>
            </Alert>
          </Col>
        </Row>
        {status === 'error' &&
          <Row>
            <Col
              className={style.errorCol}
              desk={12}
              palm={12}
              tablet={12}
              tv={12}
            >
              <TransferError
                actionLabel={t('pages.anticipation.try_again')}
                message={t('pages.anticipation.result_error')}
                onClick={onTryAgain}
              />
            </Col>
          </Row>
        }
        {status === 'success' &&
          <Row>
            <Col
              desk={12}
              palm={12}
              tablet={12}
              tv={12}
            >
              <Card>
                <CardContent>
                  <Grid>
                    <Row>
                      <Col
                        desk={12}
                        palm={12}
                        tablet={12}
                        tv={12}
                      >
                        <div className={style.head}>
                          <div className={style.advise}>
                            {automaticTransfer
                              ? t('pages.anticipation.result_advise_with_transfer')
                              : t('pages.anticipation.result_advise_without_transfer')
                            }
                          </div>
                          <div className={style.headActions}>
                            <Button
                              fill="outline"
                              icon={<IconExtract width={12} height={12} />}
                              onClick={onViewStatement}
                            >
                              {t('pages.anticipation.view_statement')}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {automaticTransfer && this.renderRecipient()}
                    {this.renderInformationRow()}
                    <Row>
                      <Col>
                        <span className={style.information}>
                          {t('pages.anticipation.anticipation_timeframe')}
                          &nbsp;
                          {t(`pages.anticipation.${timeframe}`)}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span className={style.information}>
                          {t('pages.anticipation.result_information')}
                        </span>
                      </Col>
                    </Row>
                  </Grid>
                </CardContent>
              </Card>
            </Col>
          </Row>
        }
      </Grid>
    )
  }
}

AnticipationResult.propTypes = {
  amount: PropTypes.number.isRequired,
  automaticTransfer: PropTypes.bool.isRequired,
  bankAccount: PropTypes.shape({
    agencia_dv: PropTypes.string,
    agencia: PropTypes.string,
    bank_code: PropTypes.string,
    conta_dv: PropTypes.string,
    conta: PropTypes.string,
    document_number: PropTypes.string,
    document_type: PropTypes.string,
    legal_name: PropTypes.string,
    type: PropTypes.string,
  }),
  date: PropTypes.instanceOf(moment).isRequired,
  onTryAgain: PropTypes.func.isRequired,
  onViewStatement: PropTypes.func.isRequired,
  requested: PropTypes.number.isRequired,
  status: PropTypes.oneOf([
    'error',
    'current',
    'success',
  ]).isRequired,
  statusMessage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  timeframe: PropTypes.oneOf([
    'distributed',
    'end',
    'start',
  ]).isRequired,
  totalCost: PropTypes.number.isRequired,
}

AnticipationResult.defaultProps = {
  bankAccount: null,
}

export default AnticipationResult
