import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'

import {
  Button,
  CardActions,
  CardContent,
  Col,
  FormDropdown,
  FormInput,
  Grid,
  Row,
  Spacing,
} from 'former-kit'

import { isEmpty } from 'ramda'

import accountTypes from '../../../../models/accountTypes'
import createNumberValidation from '../../../../validation/number'
import createRequiredValidation from '../../../../validation/required'
import style from '../style.css'

const AddAccount = ({
  data,
  errors,
  onBack,
  onCancel,
  onContinue,
  t,
}) => {
  const required = createRequiredValidation(t('requiredMessage'))
  const number = createNumberValidation(t('numberMessage'))

  const accountTypeOptions = accountTypes.map(accountType => ({
    name: t(`models.account_type.${accountType}`),
    value: accountType,
  }))

  return (
    <Form
      data={data}
      validateOn="blur"
      validation={{
        account_name: [required],
        account_number: [required, number],
        account_type: [required],
        agency: [required, number],
        bank: [required],
      }}
      onSubmit={(formData, formErrors = {}) => {
        if (isEmpty(formErrors)) onContinue(formData)
      }}
      errors={errors}
    >
      <CardContent>
        <Grid>
          <Row>
            <Col tv={2} desk={2} tablet={4} palm={4}>
              <FormInput
                type="text"
                label={t('bankLabel')}
                name="bank"
                placeholder={t('bankPlaceholder')}
              />
            </Col>
          </Row>
          <Row>
            <Col tv={3} desk={3} tablet={6} palm={6}>
              <FormInput
                type="text"
                label={t('agencyLabel')}
                name="agency"
                placeholder={t('agencyPlaceholder')}
              />
            </Col>
            <Col tv={3} desk={3} tablet={4} palm={4}>
              <FormInput
                type="text"
                label={t('accountNumberLabel')}
                name="account_number"
                placeholder={t('accountNumberPlaceholder')}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <label htmlFor="account_type">{t('accountTypeLabel')}</label>
              <FormDropdown
                name="account_type"
                title={t('accountTypeLabel')}
                options={accountTypeOptions}
              />
            </Col>
          </Row>
          <Row>
            <Col tv={3} desk={3} tablet={6} palm={6}>
              <FormInput
                type="text"
                label={t('accountNameLabel')}
                name="account_name"
                placeholder={t('accountNamePlaceholder')}
              />
            </Col>
          </Row>
        </Grid>
      </CardContent>
      <div className={style.paddingTop}>
        <CardActions>
          <Button
            type="button"
            onClick={onCancel}
            relevance="low"
            fill="outline"
          >
            {t('cancelText')}
          </Button>
          <Spacing />
          <Button
            type="button"
            onClick={onBack}
            fill="outline"
          >
            {t('backText')}
          </Button>
          <Button
            type="submit"
          >
            {t('continueText')}
          </Button>
        </CardActions>
      </div>
    </Form>
  )
}

AddAccount.propTypes = {
  data: PropTypes.shape({
    account_name: PropTypes.string,
    account_number: PropTypes.string,
    account_type: PropTypes.string,
    agency: PropTypes.string,
    bank: PropTypes.string,
  }),
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

AddAccount.defaultProps = {
  data: {
    account_name: '',
    account_number: '',
    account_type: 'conta_corrente',
    agency: '',
    bank: '',
  },
  errors: {},
}

export default AddAccount
