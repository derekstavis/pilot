import React from 'react'
import { Layout } from 'former-kit'
import { storiesOf } from '@storybook/react'

import { AddRecipients } from '../../../src/containers/AddRecipient'

storiesOf('Pages', module)
  .add('Recipient Add', () => (
    <Layout>
      <AddRecipients />
    </Layout>
  ))
