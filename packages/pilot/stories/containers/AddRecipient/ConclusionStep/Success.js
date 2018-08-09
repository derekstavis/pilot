import React from 'react'
import { action } from '@storybook/addon-actions'

import Section from '../../../Section'
import ConclusionStep from '../../../../src/containers/AddRecipient/ConclusionStep'

const ConclusionStepExample = () => (
  <Section>
    <ConclusionStep
      status="success"
      onExit={action('onExit')}
      onTryAgain={action('onTryAgain')}
      onViewDetails={action('onViewDetails')}
      t={t => t}
    />
  </Section>
)

export default ConclusionStepExample
