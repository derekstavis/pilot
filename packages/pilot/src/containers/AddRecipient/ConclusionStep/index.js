import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Spacing,
} from 'former-kit'

import ErrorIcon from './ErrorIcon.svg'
import SuccessIcon from './SuccessIcon.svg'
import style from './style.css'

const ConclusionStep = ({
  status,
  onExit,
  onTryAgain,
  onViewDetails,
  t,
}) => (
  <div className={style.flex}>
    { status === 'success' &&
      <Fragment>
        <SuccessIcon />
        <p className={style.center}>
          {t('pages.recipients.message_success')}
          <br />
          {t('pages.recipients.next_step')}
        </p>
        <div>
          <Button
            fill="outline"
            onClick={onExit}
          >
            {t('pages.recipients.exit')}
          </Button>
          <Spacing size="large" />
          <Button
            onClick={onViewDetails}
          >
            {t('pages.recipients.view_details')}
          </Button>
        </div>
      </Fragment>
    }
    { status === 'error' &&
      <Fragment>
        <ErrorIcon />
        <p className={style.center}>
          {t('pages.recipients.message_fail')}
        </p>
        <div>
          <Button
            fill="outline"
            onClick={onExit}
          >
            {t('pages.recipients.exit')}
          </Button>
          <Spacing size="large" />
          <Button
            onClick={onTryAgain}
          >
            {t('pages.recipients.try_again')}
          </Button>
        </div>
      </Fragment>
    }
  </div>
)


ConclusionStep.propTypes = {
  status: PropTypes.string.isRequired,
  onExit: PropTypes.func.isRequired,
  onTryAgain: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default ConclusionStep
