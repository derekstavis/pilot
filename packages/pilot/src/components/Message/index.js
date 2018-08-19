import React from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Grid,
  Row,
} from 'former-kit'

import style from './style.css'

const Message = ({ image, title, message }) => (
  <div
    aria-live="polite"
    role="status"
  >
    <Grid>
      <Row
        flex
      >
        <Col
          align="center"
        >
          <div
            className={style.image}
          >
            {image}
          </div>
          <div
            className={style.title}
          >
            {
              (typeof title === 'string') &&
                <h2>{title}</h2>
            }
            {
              (typeof title !== 'string') &&
                title
            }
          </div>
          <div
            className={style.message}
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
  </div>
)

Message.propTypes = {
  image: PropTypes.element.isRequired,
  title: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
}

export default Message
