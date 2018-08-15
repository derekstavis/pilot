import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { compose } from 'ramda'
import pagarme from 'pagarme'
import { PasswordRecoveryForm } from '../../../containers/Account/PasswordRecovery'
import buildResetParamErrors from './buildResetParamErrors'

const enhanced = compose(
  translate(),
  withRouter
)

class PasswordRecoveryPage extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      errors: null,
      loading: false,
    }

    this.handleBackToLogin = this.handleBackToLogin.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBackToLogin () {
    this.props.history.replace('/account/login')
  }

  handleSubmit (data, formErrors) {
    if (!formErrors) {
      this.setState({
        errors: null,
        loading: true,
      })

      pagarme.user.resetPassword({}, { email: data.email }).then(() => {
        this.setState({
          loading: false,
        })

        this.props.history.replace('/account/password/recovery/confirmation')
      }).catch((apiErrors) => {
        const parsedErrors = buildResetParamErrors(apiErrors)

        this.setState({
          loading: false,
          errors: {
            email: parsedErrors.email,
          },
        })
      })
    }
  }

  render () {
    return (
      <PasswordRecoveryForm
        errors={this.state.errors}
        loading={this.state.loading}
        onBackToLogin={this.handleBackToLogin}
        onSubmit={this.handleSubmit}
        t={this.props.t}
      />
    )
  }
}

PasswordRecoveryPage.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
}

export default enhanced(PasswordRecoveryPage)
