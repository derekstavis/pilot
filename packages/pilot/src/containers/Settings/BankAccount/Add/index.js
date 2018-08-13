import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  CardActions,
  Col,
  FormDropdown,
  FormInput,
  Grid,
  Row,
  Spacing,
} from 'former-kit'

import { map } from 'ramda'

import accountCDValidation from '../../../../validation/accountCheckDigit'
import accountTypes from '../../../../models/accountTypes'
import agencyCDValidation from '../../../../validation/agencyCheckDigit'
import banks from '../../../../models/banks'
import formatCpfCnpj from '../../../../formatters/cpfCnpj'
import numberValidation from '../../../../validation/number'
import Property from '../../../../components/Property'
import requiredValidation from '../../../../validation/required'
import style from './style.css'

const optionGenerator = (t, prefix) => value => ({
  name: t(`${prefix}.${value}`),
  value,
})

const BankAccountForm = ({
  actionsDisabled,
  data: {
    account,
    accountCd,
    agency,
    agencyCd,
    bankCode,
    documentNumber,
    legalName,
    type,
  },
  errors,
  onCancel,
  onChange,
  onSubmit,
  t,
}) => {
  const bankGenerator = optionGenerator(t, 'models.bank_code')
  const bankOptions = map(bankGenerator, banks)
  const accountTypeGenerator = optionGenerator(t, 'models.account_type')
  const accountTypeOptions = map(accountTypeGenerator, accountTypes)

  const isRequired = requiredValidation(t('pages.settings.company.card.register.bank.required'))
  const isNumber = numberValidation(t('pages.settings.company.card.register.bank.number'))

  return (
    <Form
      data={{
        account,
        accountCd,
        agency,
        agencyCd,
        bankCode,
        type,
      }}
      errors={errors}
      onChange={onChange}
      onSubmit={(data, formErrors) => {
        if (!formErrors) {
          onSubmit(data)
        }
      }}
      validateOn="blur"
      validation={{
        account: [isRequired, isNumber],
        accountCd: [
          isRequired,
          accountCDValidation(
            t('pages.settings.company.card.register.bank.invalid_cd')
          ),
        ],
        agency: [isRequired, isNumber],
        agencyCd: agencyCDValidation(
          t('pages.settings.company.card.register.bank.invalid_cd')
        ),
        bankCode: isRequired,
        type: isRequired,
      }}
    >
      <div className={style.content}>
        <Grid>
          <Row>
            <Col palm={12} tablet={4} desk={4} tv={4}>
              <Property
                title={t('models.bank_account.legal_name')}
                value={legalName}
              />
            </Col>
            <Col palm={12} tablet={3} desk={3} tv={3}>
              <Property
                title={t('models.bank_account.document')}
                value={formatCpfCnpj(documentNumber)}
              />
            </Col>
          </Row>
          <Row>
            <Col palm={12} tablet={4} desk={4} tv={4}>
              <FormDropdown
                key={bankCode}
                label={t('models.bank_account.bank')}
                name="bankCode"
                options={bankOptions}
              />
            </Col>
            <Col palm={12} tablet={3} desk={3} tv={3}>
              <FormDropdown
                key={type}
                label={t('models.bank_account.account_type')}
                name="type"
                options={accountTypeOptions}
              />
            </Col>
          </Row>
          <Row>
            <Col palm={12} tablet={8} desk={4} tv={4}>
              <div className={style.agencyAccountContainer}>
                <div className={style.agencyAccountFields} >
                  <FormInput
                    label={t('models.bank_account.agency')}
                    maxLength={5}
                    name="agency"
                    size={5}
                    type="text"
                  />
                  <span className={style.separator}>-</span>
                  <FormInput
                    label={t('models.bank_account.dv')}
                    maxLength={1}
                    name="agencyCd"
                    size={1}
                    type="text"
                  />
                </div>
                <Spacing size="large" />
                <div className={style.agencyAccountFields} >
                  <FormInput
                    label={t('models.bank_account.account')}
                    maxLength={13}
                    name="account"
                    size={13}
                    type="text"
                  />
                  <span className={style.separator}>-</span>
                  <FormInput
                    label={t('models.bank_account.dv')}
                    maxLength={2}
                    name="accountCd"
                    size={2}
                    type="text"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
      <CardActions>
        <Button
          disabled={actionsDisabled}
          fill="outline"
          onClick={onCancel}
          type="reset"
        >
          {t('pages.settings.company.card.register.bank.cancel')}
        </Button>
        <Button
          disabled={actionsDisabled}
          fill="gradient"
          type="submit"
        >
          {t('pages.settings.company.card.register.bank.confirm')}
        </Button>
      </CardActions>
    </Form>
  )
}


BankAccountForm.propTypes = {
  actionsDisabled: PropTypes.bool,
  data: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    documentNumber: PropTypes.string.isRequired,
    legalName: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
  errors: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    type: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

BankAccountForm.defaultProps = {
  actionsDisabled: false,
  data: {
    account: '',
    accountCd: '',
    agency: '',
    agencyCd: '',
    bankCode: '',
    type: '',
  },
  errors: null,
}
export default BankAccountForm
