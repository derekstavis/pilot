import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
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
  Tooltip,
} from 'former-kit'
import {
  either,
  equals,
  range,
} from 'ramda'
import IconInfo from 'emblematic-icons/svg/Info24.svg'
import style from './style.css'
import createRequiredValidation from '../../../validation/required'
import createNumberValidation from '../../../validation/number'


const anticipationModelOptions = t => (
  [
    {
      name: t('pages.recipients.anticipation_model_by.manual'),
      value: 'manual',
    },
    {
      name: t('pages.recipients.anticipation_model_by.automatic_volume'),
      value: 'automatic_volume',
    },
    {
      name: t('pages.recipients.anticipation_model_by.automatic_1025'),
      value: 'automatic_1025',
    },
    {
      name: t('pages.recipients.anticipation_model_by.automatic_dx'),
      value: 'automatic_dx',
    },
  ]
)

const transferIntervalOptions = t => (
  [
    {
      name: t('pages.recipients.transfer_interval_by.daily'),
      value: 'daily',
    },
    {
      name: t('pages.recipients.transfer_interval_by.weekly'),
      value: 'weekly',
    },
    {
      name: t('pages.recipients.transfer_interval_by.monthly'),
      value: 'monthly',
    },
  ]
)

const transferWeekdayOptions = t => (
  [
    {
      name: t('pages.recipients.transfer_weekday_on.monday'),
      value: 'monday',
    },
    {
      name: t('pages.recipients.transfer_weekday_on.tuesday'),
      value: 'tuesday',
    },
    {
      name: t('pages.recipients.transfer_weekday_on.wednesday'),
      value: 'wednesday',
    },
    {
      name: t('pages.recipients.transfer_weekday_on.thursday'),
      value: 'thursday',
    },
    {
      name: t('pages.recipients.transfer_weekday_on.friday'),
      value: 'friday',
    },
  ]
)

const number = t => createNumberValidation(t('pages.recipients.number'))
const required = t => createRequiredValidation(t('pages.recipients.required'))

class ConfigurationsStep extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        anticipationDays: '15',
        anticipationModel: 'manual',
        anticipationVolumePercentage: '100',
        transferDay: '10',
        transferEnabled: false,
        transferInterval: 'daily',
        transferWeekday: 'monday',
        ...props.data,
      },
    }

    this.onFormChange = this.onFormChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.renderAnticipationInput = this.renderAnticipationInput.bind(this)
    this.renderTransferInput = this.renderTransferInput.bind(this)
    this.transferHandler = this.transferHandler.bind(this)
  }

  onFormSubmit (formData, formErrors) {
    if (!formErrors) {
      this.props.onContinue(formData)
    }
  }

  onFormChange (formData) {
    this.setState({
      formData,
    })
  }

  transferHandler () {
    const {
      formData,
    } = this.state

    this.setState({
      formData: {
        ...formData,
        transferEnabled: !formData.transferEnabled,
      },
    })
  }

  renderAnticipationInput () {
    const { anticipationModel } = this.state.formData
    const { t } = this.props
    const volumePercentage = either(
      equals('automatic_volume'),
      equals('manual')
    )

    if (volumePercentage(anticipationModel)) {
      return (
        <Col tv={2} desk={2} tablet={4} palm={4}>
          <FormInput
            label={t('pages.recipients.anticipation_volume_percentage')}
            max="100"
            min="1"
            name="anticipationVolumePercentage"
            type="number"
          />
        </Col>
      )
    }

    if (anticipationModel === 'automatic_dx') {
      return (
        <Col tv={2} desk={2} tablet={4} palm={4}>
          <FormInput
            label={t('pages.recipients.anticipation_days')}
            min="1"
            name="anticipationDays"
            type="number"
          />
        </Col>
      )
    }

    return null
  }

  renderTransferInput () {
    const {
      transferDay,
      transferEnabled,
      transferInterval,
      transferWeekday,
    } = this.state.formData

    const { t } = this.props

    const transferDayOptions = range(1, 32)
      .map(day => ({ name: day.toString(), value: day.toString() }))

    if (transferEnabled && transferInterval === 'monthly') {
      return (
        <Fragment>
          <label htmlFor="transferDay" className={style.label}>
            {`${t('pages.recipients.transfer_day')} `}
            <Tooltip
              content={t('pages.recipients.transfer_tooltip')}
              placement="rightMiddle"
            >
              <IconInfo
                height={16}
                width={16}
              />
            </Tooltip>
          </label>
          <FormDropdown
            disabled={!transferEnabled}
            name="transferDay"
            options={transferDayOptions}
            key={transferDay}
          />
        </Fragment>
      )
    }

    const disabledWeekday = transferEnabled && transferInterval !== 'weekly'

    return (
      <Fragment>
        <label htmlFor="transferWeekday" className={style.label}>
          {`${t('pages.recipients.transfer_day')} `}
          <Tooltip
            content={t('pages.recipients.transfer_tooltip')}
            placement="rightMiddle"
          >
            <IconInfo
              height={16}
              width={16}
            />
          </Tooltip>
        </label>
        <FormDropdown
          disabled={!transferEnabled || disabledWeekday}
          name="transferWeekday"
          options={transferWeekdayOptions(t)}
          key={transferWeekday}
        />
      </Fragment>
    )
  }

  render () {
    const {
      errors,
      onBack,
      onCancel,
      t,
    } = this.props
    const {
      formData,
    } = this.state

    return (
      <Form
        data={formData}
        errors={errors}
        onChange={this.onFormChange}
        onSubmit={this.onFormSubmit}
        validateOn="blur"
        validation={{
          anticipationDays: [required(t), number(t)],
          anticipationModel: [required(t)],
          anticipationVolumePercentage: [required(t), number(t)],
          transferDay: [required(t), number(t)],
          transferEnabled: [required(t)],
          transferInterval: [required(t)],
          transferWeekday: [required(t)],
        }}
      >
        <CardContent>
          <Grid>
            <Row>
              <Col tv={12} desk={12} tablet={12} palm={12}>
                <h2 className={style.title}>
                  {t('pages.recipients.configuration.title')}
                </h2>
                <h3 className={style.subtitle}>
                  {t('pages.recipients.configuration.subtitle')}
                </h3>
              </Col>
              <Col tv={12} desk={12} tablet={12} palm={12}>
                <h3 className={style.subtitle}>
                  {t('pages.recipients.configuration.anticipation_model')}
                </h3>
                <RadioGroup
                  name="anticipationModel"
                  options={anticipationModelOptions(t)}
                />
              </Col>
              {this.renderAnticipationInput()}
            </Row>
            <Row>
              <h2 className={style.title}>
                {t('pages.recipients.configuration.title')}
              </h2>
              <Col tv={12} desk={12} tablet={12} palm={12}>
                <FormCheckbox
                  checked={formData.transferEnabled}
                  label={t('pages.recipients.transfer_enabled')}
                  name="transferEnabled"
                  onChange={this.transferHandler}
                  value="false"
                />
              </Col>
            </Row>
            <Row>
              <Col tv={12} desk={12} tablet={12} palm={12}>
                <h3 className={style.subtitle}>
                  {t('pages.recipients.configuration.transfer_interval')}
                </h3>
                <RadioGroup
                  disabled={!formData.transferEnabled}
                  name="transferInterval"
                  options={transferIntervalOptions(t)}
                />
              </Col>
              <Col tv={2} desk={2} tablet={4} palm={4}>
                {this.renderTransferInput()}
              </Col>
            </Row>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            fill="outline"
            onClick={onCancel}
            relevance="low"
          >
            {t('pages.recipients.cancel')}
          </Button>
          <Spacing />
          <Button
            fill="outline"
            onClick={onBack}
          >
            {t('pages.recipients.back')}
          </Button>
          <Button type="submit">
            {t('pages.recipients.submit')}
          </Button>
        </CardActions>
      </Form>
    )
  }
}

ConfigurationsStep.propTypes = {
  data: PropTypes.shape({
    anticipationModel: PropTypes.string,
    anticipationVolumePercentage: PropTypes.string,
    anticipationDays: PropTypes.string,
    transferEnabled: PropTypes.bool,
    transferInterval: PropTypes.string,
    transferDay: PropTypes.string,
    transferWeekday: PropTypes.string,
  }),
  errors: PropTypes.shape({
    anticipationModel: PropTypes.string,
    anticipationVolumePercentage: PropTypes.string,
    anticipationDays: PropTypes.string,
    transferEnabled: PropTypes.string,
    transferInterval: PropTypes.string,
    transferDay: PropTypes.string,
    transferWeekday: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

ConfigurationsStep.defaultProps = {
  data: {},
  errors: {},
}

export default ConfigurationsStep
