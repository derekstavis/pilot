import React from 'react'
import PropTypes from 'prop-types'
import { mapObjIndexed } from 'ramda'
import {
  Col,
  Grid,
  ModalContent,
  Row,
} from 'former-kit'

import Property from '../Property'

const fields = (labels, contents) => mapObjIndexed((label, key) => (
  <Property
    title={label}
    value={contents[key]}
  />
), labels)

const CaptureDetails = ({
  contents, labels,
}) => {
  const {
    captureAmount,
    amount,
    cardBrand,
    cardNumber,
    customerEmail,
    customerName,
    installments,
  } = fields(labels, contents)

  return (
    <form>
      <ModalContent>
        <Grid>
          <Row flex>
            <Col>
              {customerName}
            </Col>
            <Col />
            <Col>
              {customerEmail}
            </Col>
          </Row>
          <Row flex>
            <Col>
              {cardNumber}
            </Col>
            <Col>
              {cardBrand}
            </Col>
            <Col>
              {installments}
            </Col>
          </Row>
          <Row flex>
            <Col>
              {amount}
            </Col>
            <Col />
            <Col>
              {captureAmount}
            </Col>
          </Row>
        </Grid>
      </ModalContent>
    </form>
  )
}

CaptureDetails.propTypes = {
  labels: PropTypes.shape({
    captureAmount: PropTypes.string,
    amount: PropTypes.string.isRequired,
    cardBrand: PropTypes.string,
    cardNumber: PropTypes.string,
    customerEmail: PropTypes.string,
    customerName: PropTypes.string,
    installments: PropTypes.string,
  }).isRequired,
  contents: PropTypes.shape({
    captureAmount: PropTypes.node,
    amount: PropTypes.node.isRequired,
    cardBrand: PropTypes.node,
    cardNumber: PropTypes.node,
    customerEmail: PropTypes.node,
    customerName: PropTypes.node,
    installments: PropTypes.node,
  }).isRequired,
}

export default CaptureDetails
