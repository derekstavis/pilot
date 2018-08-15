import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'

import {
  Button,
  CardActions,
  CardContent,
  Col,
  FormDropdown,
  Grid,
  Row,
  Spacing,
} from 'former-kit'

import style from '../style.css'

const toDropdownOptions = ({ name, id }) => ({ name, value: id })

const SelectAccount = ({
  accounts,
  onBack,
  onCancel,
  onContinue,
  data,
  t,
}) => {
  const options = accounts.map(toDropdownOptions)

  return (
    <Form
      onSubmit={onContinue}
      data={{
        account_id: options[0].value,
        ...data,
      }}
    >
      <CardContent>
        <Grid>
          <Row>
            <Col>
              <label htmlFor="account_id">{t('selectAccountLabel')}</label>
              <FormDropdown
                name="account_id"
                title={t('selectAccountLabel')}
                options={options}
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

SelectAccount.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  data: PropTypes.shape({
    account_id: PropTypes.string.isRequired,
  }),
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

SelectAccount.defaultProps = {
  accounts: [],
  data: {},
}

export default SelectAccount
