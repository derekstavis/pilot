import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  Col,
  FormDropdown,
  FormInput,
  Grid,
  ModalActions,
  ModalContent,
  Row,
} from 'former-kit'

import { map } from 'ramda'

import accountCDValidation from '../../../validation/accountCheckDigit'
import accountTypes from '../../../models/accountTypes'
import agencyCDValidation from '../../../validation/agencyCheckDigit'
import banks from '../../../models/banks'
import cpfCnpjValidation from '../../../validation/cpfCnpj'
import CurrencyInput from '../../../components/CurrencyInput'
import formatCurrency from '../../../formatters/currency'
import greaterThanValidation from '../../../validation/greaterThan'
import lessThanOrEqualValidation from '../../../validation/lessThanOrEqual'
import maxLengthValidation from '../../../validation/maxLength'
import minLengthValidation from '../../../validation/minLength'
import numberValidation from '../../../validation/number'
import Property from '../../../components/Property'
import requiredValidation from '../../../validation/required'

import style from './style.css'

const optionGenerator = (t, prefix) => data => ({
  name: t(`${prefix}.${data}`),
  value: data,
})

const legalNameMinLength = 5
const legalNameMaxLength = 30

class BoletoForm extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (data, errors) {
    if (!errors) {
      this.props.onSubmit(data)
    }
  }

  render () {
    const {
      amount,
      bankAccount: {
        agencia_dv, // eslint-disable-line camelcase
        agencia,
        bank_code, // eslint-disable-line camelcase
        conta_dv, // eslint-disable-line camelcase
        conta,
        document_number, // eslint-disable-line camelcase
        legal_name, // eslint-disable-line camelcase
        type,
      },
      refundAmount,
      t,
    } = this.props
    const bankGenerator = optionGenerator(t, 'models.bank_code')
    const bankOptions = map(bankGenerator, banks)
    const accountTypeGenerator = optionGenerator(t, 'models.account_type')
    const accountTypeOptions = map(accountTypeGenerator, accountTypes)

    const isRequired = requiredValidation(t('pages.refund.required'))
    const isNumber = numberValidation(t('pages.refund.number'))

    return (
      <Form
        data={{
          bank_account: {
            agencia,
            agencia_dv,
            bank_code,
            conta_dv,
            conta,
            document_number,
            legal_name,
            type,
          },
          amount: refundAmount || amount.toString(),
        }}
        validateOn="blur"
        validation={{
          bank_account: {
            agencia: [isRequired, isNumber],
            agencia_dv: agencyCDValidation(t('pages.refund.invalid_agency_check_digit')),
            bank_code: isRequired,
            conta: [isRequired, isNumber],
            conta_dv: [
              isRequired,
              accountCDValidation(t('pages.refund.invalid_account_check_digit')),
            ],
            document_number: [
              isRequired,
              cpfCnpjValidation(t('pages.refund.invalid_document_number')),
            ],
            legal_name: [
              isRequired,
              minLengthValidation(
                legalNameMinLength,
                t('pages.refund.min_length', { length: legalNameMinLength })
              ),
              maxLengthValidation(
                legalNameMaxLength,
                t('pages.refund.max_length', { length: legalNameMaxLength })
              ),
            ],
            type: isRequired,
          },
          amount: [
            isRequired,
            isNumber,
            greaterThanValidation(amount, t('pages.refund.invalid_amount')),
            lessThanOrEqualValidation(0, t('pages.refund.greater_than_zero')),
          ],
        }}
        onSubmit={this.handleSubmit}
      >
        <ModalContent>
          <fieldset name="bank_account">
            <Grid>
              <Row>
                <Col palm={12} tablet={8} desk={8} tv={8}>
                  <FormDropdown
                    label={t('models.bank_account.bank')}
                    name="bank_code"
                    options={bankOptions}
                  />
                </Col>
                <Col palm={12} tablet={4} desk={4} tv={4}>
                  <FormDropdown
                    label={t('models.bank_account.account_type')}
                    name="type"
                    options={accountTypeOptions}
                  />
                </Col>
                <Col palm={12} tablet={12} desk={3} tv={3}>
                  <div className={style.agencyAccountFields} >
                    <FormInput
                      label={t('models.bank_account.agency')}
                      maxLength={5}
                      name="agencia"
                      size={5}
                      type="text"
                    />
                    <span className={style.separator}>-</span>
                    <FormInput
                      label={t('models.bank_account.dv')}
                      maxLength={1}
                      name="agencia_dv"
                      size={1}
                      type="text"
                    />
                  </div>
                </Col>
                <Col palm={12} tablet={12} desk={5} tv={5}>
                  <div className={style.agencyAccountFields} >
                    <FormInput
                      label={t('models.bank_account.account')}
                      maxLength={13}
                      name="conta"
                      size={13}
                      type="text"
                    />
                    <span className={style.separator}>-</span>
                    <FormInput
                      label={t('models.bank_account.dv')}
                      maxLength={2}
                      name="conta_dv"
                      size={2}
                      type="text"
                    />
                  </div>
                </Col>
                <Col palm={12} tablet={12} desk={4} tv={4}>
                  <FormInput
                    label={t('models.bank_account.document')}
                    maxLength={18}
                    name="document_number"
                    size={18}
                    type="text"
                  />
                </Col>
                <Col palm={12} tablet={12} desk={12} tv={12}>
                  <FormInput
                    className={style.legalName}
                    label={t('models.bank_account.legal_name')}
                    maxLength={30}
                    name="legal_name"
                    type="text"
                  />
                </Col>
              </Row>
            </Grid>
          </fieldset>
          <Grid className={style.amountGrid}>
            <Row>
              <Col palm={12} tablet={8} desk={8} tv={8}>
                <Property
                  title={t('models.transaction.amount')}
                  value={formatCurrency(amount)}
                />
              </Col>
              <Col palm={12} tablet={4} desk={4} tv={4}>
                <FormInput
                  label={t('pages.refund.refund_amount_with_symbol')}
                  name="amount"
                  renderer={props => (
                    <CurrencyInput
                      {...props}
                    />
                  )}
                  type="text"
                />
              </Col>
            </Row>
          </Grid>
        </ModalContent>
        <ModalActions>
          <Button
            fill="gradient"
            type="submit"
          >
            {t('pages.refund.continue')}
          </Button>
        </ModalActions>
      </Form>
    )
  }
}

BoletoForm.propTypes = {
  amount: PropTypes.number.isRequired,
  bankAccount: PropTypes.shape({
    agencia_dv: PropTypes.string,
    agencia: PropTypes.string,
    bank_code: PropTypes.string,
    conta_dv: PropTypes.string,
    conta: PropTypes.string,
    document_number: PropTypes.string,
    legal_name: PropTypes.string,
    type: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  refundAmount: PropTypes.string,
  t: PropTypes.func.isRequired,
}

BoletoForm.defaultProps = {
  bankAccount: {
    agencia_dv: '',
    agencia: '',
    bank_code: '',
    conta_dv: '',
    conta: '',
    document_number: '',
    legal_name: '',
    type: '',
  },
  refundAmount: null,
}
export default BoletoForm
