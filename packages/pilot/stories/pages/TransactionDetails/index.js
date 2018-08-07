import React from 'react'
import moment from 'moment'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Layout } from 'former-kit'

import currencyFormatter from '../../../src/formatters/decimalCurrency'
import getColumnFormatter from '../../../src/formatters/columnTranslator'
import installmentColumns from '../../../src/components/RecipientSection/installmentTableColumns'
import TransactionDetails from '../../../src/containers/TransactionDetails'
import transactionMock from './transactionMock'

const t = tr => tr

const formatColumns = getColumnFormatter(t)

const alertLabels = {
  chargeback_reason: 'Motivo do chargeback:',
  reason_code: `Código ${transactionMock.reason_code}`,
  resubmit: 'REAPRESENTAR CHARGEBACK',
}

const customerLabels = {
  born_at: 'Data de nascimento',
  city: 'Cidade',
  complement: 'Complemento',
  document_number: 'CPF/CNPJ',
  email: 'E-mail',
  name: 'Nome do cliente',
  neighborhood: 'Bairro',
  number: 'N',
  phone: 'Telefone',
  state: 'Estado',
  street: 'Rua',
  title: 'DETALHES DO CLIENTE',
  zip_code: 'CEP',
}

const eventsLabels = {
  title: 'HISTÓRICO DA TRANSAÇÃO',
}

const headerLabels = {
  boletoAmountLabel: 'VALOR EMITIDO',
  cardAmountLabel: 'VALOR AUTORIZADO',
  installments: 'Parcelado 12x',
  installmentsLabel: 'PAGAMENTO',
  statusLabel: 'STATUS',
  title: 'TRANSAÇÃO',
  approveLabel: 'Aprovar',
  refuseLabel: 'Reprovar',
}

const paymentBoletoLabels = {
  copy: 'Copiar',
  due_date: 'Vencimento:',
  show: 'ver boleto',
  title: 'BOLETO',
}

const paymentCardLabels = {
  title: 'CARTÃO DE CRÉDITO',
}

const recipientsLabels = {
  collapseInstallmentTitle: 'VISUALIZAR PARCELAS',
  expandInstallmentTitle: 'OCULTAR PARCELAS',
  installmentTotalLabel: 'TOTAL BRUTO (R$)',
  liabilitiesLabel: 'Responsável por',
  netAmountLabel: 'TOTAL LÍQUIDO (R$)',
  noRecipientLabel: 'NENHUM RECEBEDOR',
  outAmountLabel: 'TOTAL DE SAÍDAS (R$)',
  statusLabel: 'Status da próxima parcela',
  title: 'DIVISÃO ENTRE RECEBEDORES',
  totalRecipientsLabel: `${
    transactionMock.recipients.length
  } RECEBEDORES`,
  totalTitle: 'VALOR TOTAL BRUTO (R$)',
}

const reprocessLabels = {
  nextAlert: 'Esta transação foi extornada gerando a transação',
  previousAlert: 'Esta transação foi criada a partir do extorno da transação',
  showNext: 'Visualizar transação',
  showPrevious: 'Visualizar transação original',
}

const totalDisplayLabels = {
  captured_at: `Capturado em ${
    moment(transactionMock.captured_at).format('L')
  }`,
  mdr: `MDR: R$ ${
    currencyFormatter(transactionMock.payment.cost_amount || 0)
  }`,
  net_amount: 'VALOR LÍQUIDO',
  out_amount: 'TOTAL DE SAÍDAS',
  paid_amount: 'VALOR CAPTURADO',
  // receive_date: 'Data a receber: 01/01/1970',
  refund: `Valor estornado: R$ ${
    currencyFormatter(transactionMock.payment.refund || 0)
  }`,
}

const transactionDetailsLabels = {
  acquirer_name: 'Operadora do cartão',
  acquirer_response_code: 'Resposta da operadora',
  antifraud_score: 'Score do antifraude',
  authorization_code: 'Código de autorização',
  capture_method: 'Método de captura',
  nsu: 'NSU',
  soft_descriptor: 'Soft Descriptor',
  subscription_id: 'ID da assinatura',
  tid: 'TID (ID da transação)',
  title: 'DETALHES DA TRANSAÇÃO',
}

const riskLevelsLabels = {
  moderated: 'Risco: moderado',
}

storiesOf('Pages', module)
  .add('Transaction details', () => (
    <Layout>
      <TransactionDetails
        alertLabels={alertLabels}
        atLabel={t('at')}
        boletoWarningMessage={t('boleto.waiting_payment_warning')}
        customerLabels={customerLabels}
        eventsLabels={eventsLabels}
        headerLabels={headerLabels}
        installmentColumns={formatColumns(installmentColumns)}
        metadataTitle="Metadata"
        onCopyBoletoUrl={action('copy boleto')}
        onDismissAlert={action('dismiss alert')}
        onExport={action('export')}
        onRefund={action('refund')}
        onReprocess={action('reprocess')}
        onShowBoleto={action('show boleto')}
        onNextTransactionRedirect={action('show next transaction')}
        onPreviousTransactionRedirect={action('show previous transaction')}
        paymentBoletoLabels={paymentBoletoLabels}
        paymentCardLabels={paymentCardLabels}
        permissions={{
          refund: true,
          reprocess: true,
        }}
        recipientsLabels={recipientsLabels}
        riskLevelsLabels={riskLevelsLabels}
        reprocessLabels={reprocessLabels}
        totalDisplayLabels={totalDisplayLabels}
        transaction={transactionMock}
        transactionDetailsLabels={transactionDetailsLabels}
      />
    </Layout>
  ))

