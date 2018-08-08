import React from 'react'

import IconDownload from 'emblematic-icons/svg/Download24.svg'
import IconReprocess from 'emblematic-icons/svg/Reprocess24.svg'
import IconReverse from 'emblematic-icons/svg/Reverse24.svg'

import { action } from '@storybook/addon-actions'
import { Legend } from 'former-kit'

import DetailsHead from '../../../src/components/DetailsHead'
import Section from '../../Section'

const DetailsHeadExample = () => (
  <Section>
    <DetailsHead
      actions={[
        {
          icon: <IconReprocess width={12} height={12} />,
          onClick: action('reprocessar'),
          title: 'Reprocessar',
        },
        {
          icon: <IconReverse width={12} height={12} />,
          onClick: action('extornar'),
          title: 'Estornar',
        },
        {
          icon: <IconDownload width={12} height={12} />,
          onClick: action('exportar'),
          title: 'Exportar',
        },
      ]}
      identifier="#1234567"
      properties={[
        {
          children: <Legend color="#53be76" acronym="Paga" />,
          title: 'Status',
        },
        {
          children: 'À vista',
          title: 'Pagamento',
        },
        {
          children: <strong style={{ fontSize: 18 }}>R$ 6,70</strong>,
          title: 'Valor emitido',
        },
      ]}
      title="Transação"
    />
  </Section>
)

export default DetailsHeadExample
