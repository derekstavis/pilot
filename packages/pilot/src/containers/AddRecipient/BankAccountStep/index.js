import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { SegmentedSwitch, CardContent } from 'former-kit'

import {
  complement,
  either,
  isEmpty,
  isNil,
} from 'ramda'

import AddAccount from './AddAccount'
import SelectAccount from './SelectAccount'

const hasItems = complement(either(isEmpty, isNil))

const ADD_ACCOUNT = 'addAccount'
const SELECT_ACCOUNT = 'selectAccount'

export default class BankAccountStep extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedForm: SELECT_ACCOUNT,
    }

    this.handleFormSelectionChange = this.handleFormSelectionChange.bind(this)
  }

  handleFormSelectionChange (selectedForm) {
    this.setState({ selectedForm })
  }

  renderSelectedForm () {
    const { selectedForm } = this.state
    const { data } = this.props

    if (selectedForm === ADD_ACCOUNT) {
      return (
        <AddAccount
          {...this.props}
          data={data.addAccount}
        />
      )
    }

    return (
      <SelectAccount
        {...this.props}
        data={data.selectAccount}
      />
    )
  }

  render () {
    const {
      data,
      accounts,
      t,
    } = this.props

    const displaySelectAccount = hasItems(accounts)

    if (displaySelectAccount) {
      return (
        <Fragment>
          <CardContent>
            <strong>{t('bankAccountLabel')}</strong>
            <p>{t('addOrSelectAccount')}</p>
            <SegmentedSwitch
              options={[
                {
                  title: t('selectAccountOption'),
                  value: SELECT_ACCOUNT,
                },
                {
                  title: t('addAccountOption'),
                  value: ADD_ACCOUNT,
                },
              ]}
              onChange={this.handleFormSelectionChange}
              name="select_form"
              value={this.state.selectedForm}
            />
          </CardContent>
          { this.renderSelectedForm() }
        </Fragment>
      )
    }

    return (
      <Fragment>
        <CardContent>
          <strong>{t('bankAccountLabel')}</strong>
          <p>{t('addNewAccount')}</p>
        </CardContent>
        <AddAccount
          {...this.props}
          data={data.addAccount}
        />
      </Fragment>
    )
  }
}

BankAccountStep.propTypes = {
  data: PropTypes.shape({
    addAccount: PropTypes.shape({
      account_name: PropTypes.string,
      account_number: PropTypes.string,
      account_type: PropTypes.string,
      agency: PropTypes.string,
      bank: PropTypes.string,
    }),
    selectAccount: PropTypes.shape({
      account_id: PropTypes.string,
    }),
  }),
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  errors: PropTypes.shape({
    account_name: PropTypes.string,
    account_number: PropTypes.string,
    account_type: PropTypes.string,
    agency: PropTypes.string,
    bank: PropTypes.string,
  }),
  onContinue: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

BankAccountStep.defaultProps = {
  accounts: [],
  data: {
    addAccount: {
      account_name: '',
      account_number: '',
      account_type: 'conta_corrente',
      agency: '',
      bank: '',
    },
    selectAccount: {
      account_id: '',
    },
  },
  errors: {},
}
