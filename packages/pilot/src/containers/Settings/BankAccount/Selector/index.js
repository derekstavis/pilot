import React from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  CardContent,
  Table,
} from 'former-kit'

import IconCheck from 'emblematic-icons/svg/Check32.svg'

import agencyAccountFormetter from '../../../../formatters/agencyAccount'
import accountTypeFormatter from '../../../../formatters/accountType'

const getColumns = (selectedAccountId, onSelect, t, disabled) => [
  {
    accessor: ['legal_name'],
    orderable: false,
    title: t('pages.settings.company.card.register.bank.account_name'),
  },
  {
    accessor: ['bank_code'],
    orderable: false,
    renderer: item => t(`models.bank_code.${item.bank_code}`),
    title: t('pages.settings.company.card.register.bank.name'),
  },
  {
    accessor: ['agencia'],
    align: 'end',
    orderable: false,
    renderer: item => agencyAccountFormetter(item.agencia, item.agencia_dv),
    title: t('pages.settings.company.card.register.bank.agency'),
  },
  {
    accessor: ['conta'],
    align: 'end',
    orderable: false,
    renderer: item => agencyAccountFormetter(item.conta, item.conta_dv),
    title: t('pages.settings.company.card.register.bank.account'),
  },
  {
    accessor: ['type'],
    orderable: false,
    renderer: item => accountTypeFormatter(t, item.type),
    title: t('pages.settings.company.card.register.bank.account_type'),
  },
  {
    align: 'center',
    isAction: true,
    renderer: (item) => {
      if (item.id === selectedAccountId) {
        return (
          <IconCheck
            color="#37cc9a"
            height={16}
            width={16}
          />
        )
      }

      return (
        <Button
          disabled={disabled}
          fill="outline"
          onClick={() => onSelect(item.id)}
          size="tiny"
        >
          {t('pages.settings.company.card.register.bank.select')}
        </Button>
      )
    },
    title: '',
  },
]

const BankAccountSelector = ({
  accounts,
  disabled,
  onSelect,
  selectedAccountId,
  t,
}) => (
  <CardContent>
    <Table
      columns={getColumns(selectedAccountId, onSelect, t, disabled)}
      rows={accounts}
    />
  </CardContent>
)

BankAccountSelector.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      agencia: PropTypes.string.isRequired,
      agencia_dv: PropTypes.string,
      bank_code: PropTypes.string.isRequired,
      conta: PropTypes.string.isRequired,
      conta_dv: PropTypes.string,
      document_number: PropTypes.string.isRequired,
      document_type: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      legal_name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selectedAccountId: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
}

BankAccountSelector.defaultProps = {
  disabled: false,
}

export default BankAccountSelector
