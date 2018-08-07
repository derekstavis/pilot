import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  pipe,
  replace,
  omit,
} from 'ramda'

import decimalCurrency from '../../formatters/decimalCurrency'

const removeNonDigits = replace(/\D+/g, '')

const formatter = pipe(
  removeNonDigits,
  decimalCurrency
)

const notAllowedProps = [
  'inputRef',
  'multiline',
]

class CurrencyInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: formatter(props.value),
    }

    this.handleChange = this.handleChange.bind(this)
    this.normalizeValue = this.normalizeValue.bind(this)
  }

  componentWillReceiveProps ({ value }) {
    if (value !== this.state.value) {
      this.normalizeValue(value)
    }
  }

  normalizeValue (value, onChangeCallback) {
    const { max } = this.props
    const formattedValue = formatter(value)
    const normalizedValue = removeNonDigits(value)

    if (!max || (max && normalizedValue <= max)) {
      this.setState({
        value: formattedValue,
      }, () => (
        onChangeCallback && onChangeCallback(normalizedValue, formattedValue)
      ))
    }
  }

  handleChange ({ target }) {
    this.normalizeValue(target.value, this.props.onChange)
  }

  render () {
    const {
      value,
    } = this.state

    return (
      <input
        {...omit(notAllowedProps, this.props)}
        onChange={this.handleChange}
        value={value}
      />
    )
  }
}

CurrencyInput.propTypes = {
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

CurrencyInput.defaultProps = {
  max: null,
}

export default CurrencyInput
