import {
  pipe,
  values,
  zipObj,
} from 'ramda'

import buildParamErrors from '../Login/buildParamErrors'

const buildResetParamErrors = pipe(
  buildParamErrors,
  values,
  zipObj(['email'])
)

export default buildResetParamErrors
