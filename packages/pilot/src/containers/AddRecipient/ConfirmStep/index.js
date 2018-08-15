import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  CardActions,
  CardContent,
  Col,
  Grid,
  Row,
  Spacing,
} from 'former-kit'
import { range } from 'ramda'
import EditButton from './EditButton'
import styles from './style.css'

const renderPartnerInfo = (identification, t) => {
  if (identification.documentType === 'cpf') return null

  const titleRow = (
    <Row>
      <Col>
        <span className={styles.title}>{t('dados_dos_socios')}</span>
      </Col>
      <Col>
        <EditButton />
      </Col>
    </Row>
  )

  const amountOfPartners = parseInt(identification.partnerNumber, 10)
  const partnersNumberRange = range(0, amountOfPartners)

  const partnersRows = partnersNumberRange.map(partnerNumber => (
    <Row key={`partner${partnerNumber}`}>
      <Col>
        <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_label_cpf`)}</p>
        <span className={styles.info}>{identification[`partner${partnerNumber}`].cpf}</span>
      </Col>
      <Col>
        <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_name`)}</p>
        <span className={styles.info}>{identification[`partner${partnerNumber}`].name}</span>
      </Col>
      <Col>
        <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_phone`)}</p>
        <span className={styles.info}>{identification[`partner${partnerNumber}`].phone}</span>
      </Col>
    </Row>
  ))

  const partners = (partnersRows.length > 0)
    ? partnersRows
    : (
      <Row>
        <Col>
          <h3 className={styles.subtitle}>{t('nenhum_socio_cadastrado')}</h3>
        </Col>
      </Row>
    )

  return (
    <Fragment>
      {titleRow}
      {partners}
      <hr />
    </Fragment>
  )
}

const renderReceiverNameEmailInfo = (identification, t) => {
  if (identification.cnpjInformation || identification.cpfInformation) {
    return (
      <Fragment>
        <Col>
          <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_name`)}</p>
          <span className={styles.info}>{identification[`${identification.documentType}Name`]}</span>
        </Col>
        <Col>
          <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_email`)}</p>
          <span className={styles.info}>{identification[`${identification.documentType}Email`]}</span>
        </Col>
      </Fragment>
    )
  }
  return null
}

const renderReceiverUrlPhoneInfo = (identification, t) => {
  if (identification.cnpjInformation || identification.cpfInformation) {
    return (
      <Row>
        <Col>
          <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_url`)}</p>
          <span className={styles.info}>{identification[`${identification.documentType}Url`]}</span>
        </Col>
        <Col>
          <p className={styles.infoTitle}>{t(`pages.recipients.identification.${identification.documentType}_phone`)}</p>
          <span className={styles.info}>{identification[`${identification.documentType}Phone`]}</span>
        </Col>
      </Row>
    )
  }
  return null
}


const renderReceiverInfo = (identification, t) => {
  const cpfTitle = 'Dados do recebedor'
  const cnpjTitle = 'Dados da empresa'

  return (
    <Fragment>
      <Row>
        <Col>
          {identification.documentType === 'cpf' &&
          <span className={styles.title}>{cpfTitle}</span>
          }
          {identification.documentType === 'cnpj' &&
          <span className={styles.title}>{cnpjTitle}</span>
          }
        </Col>
        <Col>
          <EditButton />
        </Col>
      </Row>
      <Row>
        <Col>
          <p className={styles.infoTitle}>
            {t(`pages.recipients.identification.${identification.documentType}_check_label`)}
          </p>
          <span className={styles.info}>
            {identification[identification.documentType]}
          </span>
        </Col>
        {renderReceiverNameEmailInfo(identification, t)}
        {renderReceiverUrlPhoneInfo(identification, t)}
      </Row>

      <hr />
    </Fragment>
  )
}

const renderBankAccount = (bankAccount, t) => (
  <Fragment>
    <Row>
      <Col>
        <span className={styles.title}>{t('conta_bancaria')}</span>
      </Col>
      <Col>
        <EditButton />
      </Col>
    </Row>
    <Row>
      <Col tv={1} desk={1} tablet={1} palm={1}>
        <p className={styles.infoTitle}>{t('nome_da_conta')}</p>
        <span className={styles.info}>{bankAccount.account_name}</span>
      </Col>
      <Col tv={1} desk={1} tablet={1} palm={1}>
        <p className={styles.infoTitle}>{t('banco')}</p>
        <span className={styles.info}>{bankAccount.bank}</span>
      </Col>
      <Col tv={1} desk={1} tablet={1} palm={1}>
        <p className={styles.infoTitle}>{t('agencia')}</p>
        <span className={styles.info}>{bankAccount.agency}</span>
      </Col>
      <Col tv={1} desk={1} tablet={1} palm={1}>
        <p className={styles.infoTitle}>{t('conta')}</p>
        <span className={styles.info}>{bankAccount.account_number}</span>
      </Col>
      <Col tv={1} desk={1} tablet={1} palm={1}>
        <p className={styles.infoTitle}>{t('tipo_de_conta')}</p>
        <span className={styles.info}>{bankAccount.account_type}</span>
      </Col>
    </Row>
    <hr />
  </Fragment>
)

const renderAnticipationConfig = (configuration, t) => (
  <Fragment>
    <Row>
      <Col>
        <span className={styles.title}>{t('configuracoes_de_antecipacao')}</span>
      </Col>
      <Col>
        <EditButton />
      </Col>
    </Row>
    <Row>
      <Col tv={2} desk={2} tablet={2} palm={2}>
        <p className={styles.infoTitle}>{t('modelo_de_antecipacao')}</p>
        <span className={styles.info}>{configuration.anticipationModel}</span>
      </Col>
      <Col tv={2} desk={2} tablet={2} palm={2}>
        <p className={styles.infoTitle}>{t('volume_antecipavel_%')}</p>
        <span className={styles.info}>{configuration.anticipationVolumePercentage}</span>
      </Col>
    </Row>
    <hr />
  </Fragment>
)

const renderTransferInterval = (configuration, t) => {
  const interval = configuration.transferInterval
  const monthly = configuration.transferDay
  const daily = configuration.transferWeekday
  const render = (interval === 'Mensal')
    ? (
      <Col tv={2} desk={2} tablet={2} palm={2}>
        <p className={styles.infoTitle}>{t('dia_de_transferencia')}</p>
        {interval === 'Semanal' &&
        <span className={styles.info}>{daily}</span>
        }
        <span className={styles.info}>{monthly}</span>
      </Col>
    )
    : null

  if (configuration.transferEnabled) {
    return (
      <Fragment>
        <Col tv={2} desk={2} tablet={2} palm={2}>
          <p className={styles.infoTitle}>{t('intervalo_de_transferencias_automaticas')}</p>
          <span className={styles.info}>{interval}</span>
        </Col>
        {render}
      </Fragment>
    )
  }
  return null
}

const renderTransferConfig = (configuration, t) => {
  const enableTransfer = (configuration.transferEnabled)
    ? 'Habilitada'
    : ('Desabilitada')
  return (
    <Fragment>
      <Row>
        <Col>
          <span className={styles.title}>{t('configuracoes_de_transferencia')}</span>
        </Col>
        <Col>
          <EditButton />
        </Col>
      </Row>
      <Row>
        <Col tv={2} desk={2} tablet={2} palm={2}>
          <p className={styles.infoTitle}>{t('transferencia_automatica')}</p>
          <span className={styles.info}>{enableTransfer}</span>
        </Col>
        {renderTransferInterval(configuration)}
      </Row>
    </Fragment>
  )
}

const ConfirmStep = ({
  data,
  onBack,
  onCancel,
  onCreate,
  t,
}) => {
  console.log('Data:', data)
  return (
    <Fragment>
      <CardContent>
        <p className={styles.title}>{t('confirmacao_de_cadastro_do_recebedor')}</p>
        <p className={styles.subtitle}>
          {t('confira_abaixo_se_os_dados_do_seu_recebedor_estao_corretos')}
        </p>
        <hr />
        <Grid>
          {renderReceiverInfo(data.identification, t)}
          {renderPartnerInfo(data.identification, t)}
          {renderBankAccount(data.bankAccount)}
          {renderAnticipationConfig(data.configuration)}
          {renderTransferConfig(data.configuration)}
        </Grid>
      </CardContent>
      <div className={styles.paddingTop}>
        <CardActions>
          <Button
            type="button"
            relevance="low"
            onClick={onCancel}
            fill="outline"
          >
            {t('cancelar')}
          </Button>
          <Spacing />
          <Button
            type="button"
            onClick={onBack}
            fill="outline"
          >
            {t('voltar')}
          </Button>
          <Button
            type="submit"
            fill="gradient"
            onClick={onCreate}
          >
            {t('criar_recebedor')}
          </Button>
        </CardActions>
      </div>
    </Fragment>
  )
}

const partnerPropTypes = PropTypes.shape({
  cpf: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
})

const partnerDefaultTypes = {
  cpf: '',
  name: '',
  phone: '',
}

ConfirmStep.propTypes = {
  data: PropTypes.shape({
    identification: PropTypes.shape({
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
      partnerNumber: PropTypes.string,
      partner0: partnerPropTypes,
      partner1: partnerPropTypes,
      partner2: partnerPropTypes,
      partner3: partnerPropTypes,
      partner4: partnerPropTypes,
    }).isRequired,
    configuration: PropTypes.shape({
      anticipationModel: PropTypes.string,
      anticipationVolumePercentage: PropTypes.string,
      anticipationDays: PropTypes.string,
      transferEnabled: PropTypes.bool,
      transferInterval: PropTypes.string,
      transferDay: PropTypes.string,
      transferWeekday: PropTypes.string,
    }).isRequired,
    bankAccount: PropTypes.shape({
      account_name: PropTypes.string,
      account_number: PropTypes.string,
      account_type: PropTypes.string,
      agency: PropTypes.string,
      bank: PropTypes.string,
    }),
  }),
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

ConfirmStep.defaultProps = {
  data: {
    identification: {
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
      documentType: '',
      partnerNumber: '',
      partner0: partnerDefaultTypes,
      partner1: partnerDefaultTypes,
      partner2: partnerDefaultTypes,
      partner3: partnerDefaultTypes,
      partner4: partnerDefaultTypes,
    },
    configuration: {
      anticipationModel: '',
      anticipationVolumePercentage: '',
      anticipationDays: '',
      transferEnabled: false,
      transferInterval: '',
      transferDay: '',
      transferWeekday: '',
    },
    bankAccount: {
      account_name: '',
      account_number: '',
      account_type: '',
      agency: '',
      bank: '',
    },
  },
}

export default ConfirmStep
