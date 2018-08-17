import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import style from './style.css'

const DataDisplay = ({
  align,
  children,
  color,
  subtitle,
  title,
  titleSize,
  value,
}) => (
  <div className={
      classNames(style.content, style.justify, {
        [style[align]]: align,
      })
    }
  >
    <div className={style.title}>
      {
        typeof title === 'string'
          ? (
            <h2
              className={
              classNames({
                [style[titleSize]]: titleSize,
              })}
              style={{ color }}
            >
              {title}
            </h2>
          )
          : title
      }
    </div>

    {children || (
      <div className={style.value}>
        <h3>{value}</h3>
      </div>
    )}

    <div className={style.subtitle}>
      {subtitle}
    </div>
  </div>
)

DataDisplay.propTypes = {
  align: PropTypes.oneOf([
    'center',
    'end',
    'start',
  ]),
  children: PropTypes.node,
  color: PropTypes.string,
  subtitle: PropTypes.node,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  titleSize: PropTypes.oneOf([
    'small',
    'medium',
    'large',
    'huge',
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
}

DataDisplay.defaultProps = {
  align: 'center',
  children: null,
  color: '#757575',
  subtitle: null,
  titleSize: 'small',
  value: '',
}

export default DataDisplay
