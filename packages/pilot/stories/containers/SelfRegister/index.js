import React from 'react'
import { identity } from 'ramda'
import SelfRegister from '../../../src/containers/SelfRegister'

const SelfRegisterState = SelfRegister

const Logo = () => <img src="https://resumo.com.br/wp-content/uploads/2018/08/ursal.jpg" height="200px" alt="foo" />

const SelfRegisterFoo = () => (
  <SelfRegisterState
    logo={Logo}
    t={identity}
  />
)

export default SelfRegisterFoo
