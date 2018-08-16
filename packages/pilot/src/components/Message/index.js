import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Grid,
  Row,
} from 'former-kit'

import style from './style.css'

const Message = ({ image, title, message }) => (
  <Grid>
    <Row flex>
      <Col align="center">
        {image}
      </Col>
    </Row>
    <Row flex>
      <Col align="center">
        {
          (typeof title === 'string') &&
            <h2>{title}</h2>
        }
        {
          (typeof title !== 'string') &&
            title
        }
      </Col>
    </Row>
    <Row flex>
      <Col
        align="center"
      >
        <div
          aria-live="polite"
          className={style.message}
          role="status"
        >
          {
            (typeof message === 'string') &&
              <span>{message}</span>
          }
          {
            (typeof message !== 'string') &&
              message
          }
        </div>
      </Col>
    </Row>
  </Grid>
)

Message.propTypes = {
  image: PropTypes.element.isRequired,
  title: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
}

export default Message
