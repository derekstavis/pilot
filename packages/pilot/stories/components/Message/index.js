import React from 'react'

import ErrorIcon from '../../../src/components/TransferError/ErrorIcon.svg'
import Message from '../../../src/components/Message'

const MessageExample = () => (
  <Message
    image={<ErrorIcon />}
    message={
      <span>
        Algo inesperado aconteceu
      </span>
    }
    title="Erro!"
  />
)

export default MessageExample
