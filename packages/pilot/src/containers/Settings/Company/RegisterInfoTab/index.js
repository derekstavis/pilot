import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  CardContent,
  CardTitle,
} from 'former-kit'
import CompanyGeneral from './CompanyGeneral'
import CompanyAddress from './CompanyAddress'
import CompanyAccountManager from './CompanyAccountManager'
import CompanyBankAccount from '../../BankAccount'

const RegisterInfoTab = ({
  address,
  bankAccounts,
  bankAccountActionsDisabled,
  bankAccountData,
  bankAccountErrors,
  bankAccountSelected,
  bankAccountSelectActionDisabled,
  bankAccountSelectedView,
  general,
  managingPartner,
  onBankAccountCancel,
  onBankAccountChange,
  onBankAccountCreate,
  onBankAccountSelect,
  t,
}) => (
  <Fragment>
    <CardContent>
      <p>{t('pages.settings.company.card.register.card_title')}</p>
    </CardContent>

    <CardTitle
      title={t('pages.settings.company.card.register.card_company')}
    />

    <CardContent>
      <CompanyGeneral
        t={t}
        general={general}
      />
    </CardContent>

    <CardContent>
      <CompanyAddress
        t={t}
        address={address}
      />
    </CardContent>

    <CardTitle
      title={t('pages.settings.company.card.register.bank_title')}
    />

    <CardContent>
      <CompanyBankAccount
        accounts={bankAccounts}
        data={bankAccountData}
        disabled={bankAccountActionsDisabled}
        errors={bankAccountErrors}
        onAccountSelect={onBankAccountSelect}
        onCancel={onBankAccountCancel}
        onChange={onBankAccountChange}
        onSubmit={onBankAccountCreate}
        selectedAccount={bankAccountSelected}
        selectionActionDisabled={bankAccountSelectActionDisabled}
        selectedView={bankAccountSelectedView}
        t={t}
      />
    </CardContent>

    <CardTitle
      title={t('pages.settings.company.card.register.account_manager')}
    />

    <CardContent>
      <CompanyAccountManager
        t={t}
        managingPartner={managingPartner}
      />
    </CardContent>
  </Fragment>
)

const bankAccountShape = {
  agencia: PropTypes.string,
  agencia_dv: PropTypes.string,
  bank_code: PropTypes.string,
  conta: PropTypes.string,
  conta_dv: PropTypes.string,
  document_number: PropTypes.string,
  document_type: PropTypes.string,
  id: PropTypes.number,
  legal_name: PropTypes.string,
  type: PropTypes.string,
}

RegisterInfoTab.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    complementary: PropTypes.string,
    neighborhood: PropTypes.string,
    street: PropTypes.string,
    streetNumber: PropTypes.string,
    state: PropTypes.string,
    zipcode: PropTypes.string,
  }).isRequired,
  bankAccounts: PropTypes.arrayOf(
    PropTypes.shape(bankAccountShape).isRequired
  ).isRequired,
  bankAccountActionsDisabled: PropTypes.bool.isRequired,
  bankAccountData: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    documentNumber: PropTypes.string.isRequired,
    legalName: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
  bankAccountErrors: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    type: PropTypes.string,
  }),
  bankAccountSelected: PropTypes.shape(bankAccountShape).isRequired,
  bankAccountSelectedView: PropTypes.oneOf([
    'addition', 'selection',
  ]).isRequired,
  bankAccountSelectActionDisabled: PropTypes.bool.isRequired,
  general: PropTypes.shape({
    cnpj: PropTypes.string,
    fullName: PropTypes.string,
    name: PropTypes.string,
    siteUrl: PropTypes.string,
  }).isRequired,
  managingPartner: PropTypes.shape({
    cpf: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onBankAccountCancel: PropTypes.func.isRequired,
  onBankAccountChange: PropTypes.func.isRequired,
  onBankAccountCreate: PropTypes.func.isRequired,
  onBankAccountSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

RegisterInfoTab.defaultProps = {
  bankAccountData: {
    account: '',
    accountCd: '',
    agency: '',
    agencyCd: '',
    bankCode: '',
    type: '',
  },
  bankAccountErrors: null,
}

export default RegisterInfoTab
