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
} from 'ramda'
import IconChecked from 'emblematic-icons/svg/Check32.svg'
import IconError from 'emblematic-icons/svg/ClearClose32.svg'
import IconExtract from 'emblematic-icons/svg/Extract24.svg'

import DataDisplay from '../../../components/DataDisplay'
import DetailsHead from '../../../components/DetailsHead'
import formatAccountType from '../../../formatters/accountType'
import formatAgencyAccount from '../../../formatters/agencyAccount'
import formatCpfCnpj from '../../../formatters/cpfCnpj'
import Summary from '../../../components/Summary'
import TotalDisplay from '../../../components/TotalDisplay'
import TransferError from '../../../components/TransferError'

import style from './style.css'

const getIcon = cond([
  [equals('success'), always(<IconChecked height={16} width={16} />)],
  [equals('error'), always(<IconError height={16} width={16} />)],
])

class WithdrawResult extends Component {
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
      transferCost,
    } = this.props

    return (
      <Summary>
        <DataDisplay
          title={t('pages.withdraw.date')}
          titleSize="small"
          value={date.format('DD/MM/YYYY')}
        />
        <TotalDisplay
          amount={requested}
          amountSize="large"
          color="#37cc9a"
          title={t('pages.withdraw.requested_value')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          amount={transferCost}
          amountSize="large"
          color="#ff796f"
          title={t('pages.withdraw.transfer_cost')}
          titleColor="#757575"
          titleSize="small"
        />
        <TotalDisplay
          amount={amount}
          amountSize="large"
          color="#37cc9a"
          title={t('pages.withdraw.value_to_transfer')}
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
      onTryAgain,
      onViewStatement,
      status,
      statusMessage,
      t,
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
                actionLabel={t('pages.withdraw.try_again')}
                message={t('pages.withdraw.result_error')}
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
                            {t('pages.withdraw.result_advise')}
                          </div>
                          <div className={style.headActions}>
                            <Button
                              fill="outline"
                              icon={<IconExtract width={12} height={12} />}
                              onClick={onViewStatement}
                            >
                              {t('pages.withdraw.view_statement')}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {this.renderRecipient()}
                    {this.renderInformationRow()}
                    <Row>
                      <Col>
                        <span className={style.information}>
                          {t('pages.withdraw.result_information')}
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

WithdrawResult.propTypes = {
  amount: PropTypes.number.isRequired,
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
  }).isRequired,
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
  transferCost: PropTypes.number.isRequired,
}

export default WithdrawResult
