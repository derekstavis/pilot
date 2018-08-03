import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import DataDisplay from '../DataDisplay'
import currency from '../../formatters/currency'
import style from './style.css'

const renderSymbol = (value) => {
  if (value < 0) {
    return '-'
  }

  if (value > 0) {
    return '+'
  }

  return null
}

const renderValue = (amount, color) => {
  const formattedValue = currency(Math.abs(amount))

  return (
    <div className={style.amount}>
      <small style={{ color }}>
        {renderSymbol(amount)}
      </small>
      {
        formattedValue === 'NaN'
          ? <div className={style.empty} />
          : <h3>{formattedValue}</h3>
      }
    </div>
  )
}

const renderTitle = (color, title) => (
  <Fragment>
    <h2 style={{ color }}>{title}</h2>
  </Fragment>
)

const TotalDisplay = ({
  align,
  amount,
  color,
  subtitle,
  title,
}) => (
  <DataDisplay
    title={renderTitle(color, title)}
    color={color}
    subtitle={subtitle}
    align={align}
  >
    {renderValue(amount, color)}
  </DataDisplay>
)

TotalDisplay.propTypes = {
  align: PropTypes.oneOf([
    'center',
    'end',
    'start',
  ]),
  title: PropTypes.node.isRequired,
  amount: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
}

TotalDisplay.defaultProps = {
  align: 'center',
  subtitle: null,
}

export default TotalDisplay
