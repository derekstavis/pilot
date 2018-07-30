import React from 'react'
import { action } from '@storybook/addon-actions'

import { Card } from 'former-kit'
import Section from '../../../Section'
import ConfigurationsStep from '../../../../src/containers/AddRecipient/ConfigurationStep'

const defaultData = {
  anticipationDays: '25',
  anticipationModel: 'automatic_volume',
  anticipationVolumePercentage: '85',
  transferDay: '5',
  transferEnabled: true,
  transferInterval: 'weekly',
  transferWeekday: 'wednesday',
}

const ConfigurationStep = () => (
  <Section>
    <Card>
      <ConfigurationsStep
        t={t => t}
        data={defaultData}
        onContinue={action('onContinue')}
        onBack={action('onBack')}
        onCancel={action('onCancel')}
      />
    </Card>
  </Section>
)

export default ConfigurationStep
