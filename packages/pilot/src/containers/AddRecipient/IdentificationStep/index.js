import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Col,
  FormCheckbox,
  FormDropdown,
  FormInput,
  Grid,
  RadioGroup,
  Row,
  Spacing,
} from 'former-kit'

import { range } from 'ramda'

import createCpfCnpjValidation from '../../../validation/cpfCnpj'
import createEmailValidation from '../../../validation/email'
import createPhoneValidation from '../../../validation/phone'
import createRequiredValidation from '../../../validation/required'
import style from './style.css'

const PARTNER_LIMIT = 5

const partnerOptions = range(0, PARTNER_LIMIT + 1)
  .map(index => ({ name: index.toString(), value: index.toString() }))

const masks = {
  cnpj: '11.111.111/1111-11',
  cpf: '111.111.111-11',
  phone: '(11) 11111-1111',
}

const partnerInitialization = {
  cpf: '',
  name: '',
  phone: '',
}

const getValidations = (documentType, t) => {
  const requiredMessage =
    t('pages.recipients.identification.error_validate_required')

  const validateCpfCnpjMessage =
    t('pages.recipients.identification.error_validate_cpf')

  const validateEmailMessage =
    t('pages.recipients.identification.error_validate_email')

  const validatePhoneMessage =
    t('pages.recipients.identification.error_validate_phone')

  const required = createRequiredValidation(requiredMessage)
  const validateCpfCnpj = createCpfCnpjValidation(validateCpfCnpjMessage)
  const validateEmail = createEmailValidation(validateEmailMessage)
  const validatePhone = createPhoneValidation(validatePhoneMessage)

  if (documentType === 'cnpj') {
    const partnerValidations = {
      cpf: [required, validateCpfCnpj],
      name: [required],
      phone: [required, validatePhone],
    }

    return {
      cnpj: [required, validateCpfCnpj],
      cnpjEmail: [validateEmail],
      cnpjName: [required],
      cnpjPhone: [validatePhone],
      documentInformation: [required, validatePhone, validateEmail],
      documentType: [],
      partner0: partnerValidations,
      partner1: partnerValidations,
      partner2: partnerValidations,
      partner3: partnerValidations,
      partner4: partnerValidations,
    }
  }

  return {
    cpf: [required, validateCpfCnpj],
    cpfEmail: [required, validateEmail],
    cpfName: [required],
    cpfPhone: [required, validatePhone],
    cpfUrl: [required],
  }
}

class IdentificationStep extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        cnpj: '',
        cnpjEmail: '',
        cnpjInformation: false,
        cnpjName: '',
        cnpjPhone: '',
        cnpjUrl: '',
        cpf: '',
        cpfEmail: '',
        cpfInformation: false,
        cpfName: '',
        cpfPhone: '',
        cpfUrl: '',
        documentType: 'cpf',
        partner0: partnerInitialization,
        partner1: partnerInitialization,
        partner2: partnerInitialization,
        partner3: partnerInitialization,
        partner4: partnerInitialization,
        partnerNumber: '0',
        ...props.data,
      },
    }

    this.onChangeWithMask = this.onChangeWithMask.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.renderDocumentInput = this.renderDocumentInput.bind(this)
    this.toggleAdditionalInformation =
      this.toggleAdditionalInformation.bind(this)
    this.validateRepeatedDocuments = this.validateRepeatedDocuments.bind(this)
  }

  onFormSubmit (formData, formErrors) {
    const updatedErrors = this.validateRepeatedDocuments(formErrors)
    if (updatedErrors) {
      this.setState({
        formErrors: updatedErrors,
      })
      return
    }
    this.props.onContinue(formData)
  }

  onFormChange (formData) {
    this.setState({
      formData,
    })
  }

  onChangeWithMask (event, partner) {
    const {
      name,
      value = '',
    } = event.target

    let data = { [name]: value }

    if (partner) {
      data = {
        [partner]: {
          ...this.state.formData[partner],
          [name]: value,
        },
      }
    }

    const formData = {
      ...this.state.formData,
      ...data,
    }

    this.onFormChange(formData)
  }

  validateRepeatedDocuments (errors) {
    const { t } = this.props
    let formErrors = errors

    const {
      partner0,
      partner1,
      partner2,
      partner3,
      partner4,
    } = this.state.formData

    const partners = {
      partner0,
      partner1,
      partner2,
      partner3,
      partner4,
    }

    const uniqueDocuments = {}
    const repeatedErrorMessage =
      t('pages.recipients.identification.error_repeated_document')

    Object.keys(partners).forEach((partner) => {
      const { cpf } = partners[partner]
      if (cpf) {
        if (!uniqueDocuments[cpf]) {
          uniqueDocuments[cpf] = true
        } else {
          if (!formErrors) formErrors = {}
          if (!formErrors[partner]) formErrors[partner] = {}
          formErrors[partner].cpf = repeatedErrorMessage
        }
      }
    })

    return formErrors
  }

  toggleAdditionalInformation () {
    const { documentType } = this.state.formData
    const additionalInfo = `${documentType}Information`
    const shouldShowInfo = !this.state.formData[additionalInfo]

    this.setState({
      formData: {
        ...this.state.formData,
        [additionalInfo]: shouldShowInfo,
      },
    })
  }

  renderDocumentInput () {
    const { documentType } = this.state.formData
    const { t } = this.props

    if (documentType === 'cpf') {
      return (
        <FormInput
          key="cpf"
          label={t('pages.recipients.identification.type_label_cpf')}
          mask={masks.cpf}
          name="cpf"
          onChange={this.onChangeWithMask}
          size={35}
        />
      )
    }

    return (
      <FormInput
        key="cnpj"
        label={t('pages.recipients.identification.type_label_cnpj')}
        mask={masks.cnpj}
        name="cnpj"
        onChange={this.onChangeWithMask}
        size={35}
      />
    )
  }

  renderInformationCheck () {
    const { documentType } = this.state.formData
    const { t } = this.props

    const info =
      t(`pages.recipients.identification.${documentType}_check_label`)

    return (
      <FormCheckbox
        checked={this.state.formData[`${documentType}Information`]}
        label={info}
        name={`${documentType}Information`}
        onChange={this.toggleAdditionalInformation}
        value=""
      />
    )
  }

  renderDocumentInformationInput () {
    const {
      formData: {
        documentType,
      },
    } = this.state

    const { t } = this.props

    return (
      <Fragment>
        <Row>
          <Col>
            <h2 className={style.title}>
              {t(`pages.recipients.identification.${documentType}_title`)}
            </h2>
            <h3 className={style.subtitle}>
              {t(`pages.recipients.identification.${documentType}_subtitle`)}
            </h3>
            <FormInput
              label={t(`pages.recipients.identification.${documentType}_name`)}
              name={`${documentType}Name`}
              size={35}
            />
          </Col>
        </Row>
        <Row stretch>
          <Col>
            <FormInput
              label={t(`pages.recipients.identification.${documentType}_email`)}
              name={`${documentType}Email`}
              size={35}
            />
          </Col>
          <Col>
            <FormInput
              label={t(`pages.recipients.identification.${documentType}_url`)}
              name={`${documentType}Url`}
              size={35}
            />
          </Col>
          <Col>
            <FormInput
              key="documentPhone"
              label={t(`pages.recipients.identification.${documentType}_phone`)}
              mask={masks.phone}
              name={`${documentType}Phone`}
              onChange={this.onChangeWithMask}
              size={35}
            />
          </Col>
        </Row>
      </Fragment>
    )
  }

  renderPartnerInput () {
    const { t } = this.props
    const { partnerNumber } = this.state.formData

    return (
      range(0, parseInt(partnerNumber, 10)).map(partnerIndex => (
        <fieldset
          className={style.fieldset}
          key={`fieldset${partnerIndex}`}
          name={`partner${partnerIndex}`}
        >
          <Row stretch>
            <Col>
              <FormInput
                label={t('pages.recipients.identification.cnpj_partners_name')}
                name="name"
                size={35}
              />
            </Col>
            <Col>
              <FormInput
                label={t('pages.recipients.identification.cnpj_partners_cpf')}
                mask={masks.cpf}
                name="cpf"
                onChange={event =>
                  this.onChangeWithMask(event, `partner${partnerIndex}`)}
                size={35}
              />
            </Col>
            <Col>
              <FormInput
                label={t('pages.recipients.identification.cnpj_partners_phone')}
                mask={masks.phone}
                name="phone"
                onChange={event =>
                  this.onChangeWithMask(event, `partner${partnerIndex}`)}
                size={35}
              />
            </Col>
          </Row>
        </fieldset>
      ))
    )
  }

  render () {
    const {
      errors,
      onCancel,
      t,
    } = this.props

    const {
      formData,
      formErrors,
      formData: {
        documentType,
      },
    } = this.state

    return (
      <Form
        data={this.state.formData}
        errors={formErrors || errors}
        onChange={this.onFormChange}
        onSubmit={this.onFormSubmit}
        validateOn="blur"
        validation={getValidations(documentType, t)}
      >
        <Card>
          <CardContent>
            <h2 className={style.title}>
              {t('pages.recipients.identification.title')}
            </h2>
            <h3 className={style.subtitle}>
              {t('pages.recipients.identification.subtitle')}
            </h3>
            <span className={style.label}>
              {t('pages.recipients.identification.type_label')}
            </span>
            <RadioGroup
              name="documentType"
              options={[
                {
                  name: t('pages.recipients.identification.cpf_person'),
                  value: 'cpf',
                },
                {
                  name: t('pages.recipients.identification.cnpj_person'),
                  value: 'cnpj',
                },
              ]}
            />
            <Grid>
              <Row>
                <Col>
                  { this.renderDocumentInput() }
                </Col>
              </Row>
              <Row>
                <Col>
                  { this.renderInformationCheck() }
                </Col>
              </Row>
              { formData[`${documentType}Information`] && (
              <Fragment>
                { this.renderDocumentInformationInput()}
                { documentType === 'cnpj' && (
                  <Fragment>
                    <Row className={style.paddingTop}>
                      <Col>
                        <h2 className={style.title}>
                          {t('pages.recipients.identification.cnpj_partners_title')}
                        </h2>
                        <h3 className={style.subtitle}>
                          {t('pages.recipients.identification.cnpj_partners_subtitle')}
                        </h3>
                        <FormDropdown
                          label={t('pages.recipients.identification.cnpj_partners_label')}
                          name="partnerNumber"
                          options={partnerOptions}
                        />
                      </Col>
                    </Row>
                    { this.renderPartnerInput() }
                  </Fragment>
                )}
              </Fragment>
              )}
            </Grid>
          </CardContent>
          <div className={style.paddingTop}>
            <CardActions>
              <Button
                fill="outline"
                onClick={onCancel}
              >
                {t('pages.recipients.identification.button_cancel')}
              </Button>
              <Spacing size="medium" />
              <Button
                fill="gradient"
                type="submit"
              >
                {t('pages.recipients.identification.button_submit')}
              </Button>
            </CardActions>
          </div>
        </Card>
      </Form>
    )
  }
}

const partnerPropTypes = PropTypes.shape({
  cpf: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
})

IdentificationStep.propTypes = {
  data: PropTypes.shape({
    cnpj: PropTypes.string,
    cnpjEmail: PropTypes.string,
    cnpjInformation: PropTypes.bool,
    cnpjName: PropTypes.string,
    cnpjPhone: PropTypes.string,
    cnpjUrl: PropTypes.string,
    cpf: PropTypes.string,
    cpfEmail: PropTypes.string,
    cpfInformation: PropTypes.bool,
    cpfName: PropTypes.string,
    cpfPhone: PropTypes.string,
    cpfUrl: PropTypes.string,
    documentType: PropTypes.string,
    partner0: partnerPropTypes,
    partner1: partnerPropTypes,
    partner2: partnerPropTypes,
    partner3: partnerPropTypes,
    partner4: partnerPropTypes,
    partnerNumber: PropTypes.string,
  }),
  errors: PropTypes.shape({
    anticipationDays: PropTypes.string,
    anticipationModel: PropTypes.string,
    anticipationVolumePercentage: PropTypes.string,
    transferDay: PropTypes.string,
    transferEnabled: PropTypes.string,
    transferInterval: PropTypes.string,
    transferWeekday: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

IdentificationStep.defaultProps = {
  data: {},
  errors: {},
}

export default IdentificationStep
