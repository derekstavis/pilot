import React from 'react'
import { action } from '@storybook/addon-actions'
import { Card } from 'former-kit'
import Section from '../../../Section'
import IdentificationStep from '../../../../src/containers/AddRecipient/IdentificationStep'

const IdentificationExample = () => (
  <Section>
    <Card>
      <IdentificationStep
        onContinue={action('onContinue')}
        onBack={action('onBack')}
        onCancel={action('onCancel')}
        t={translate => translate}
      />
    </Card>
  </Section>
)

export default IdentificationExample
