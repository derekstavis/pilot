import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  BulletSteps,
  Card,
  CardActions,
  CardContent,
  Col,
  Grid,
  FormInput,
  Row,
} from 'former-kit'
import Form from 'react-vanilla-form'
import ArrowBack from 'emblematic-icons/svg/ChevronBack32.svg'

import TopImage from '../../components/SelfRegister/TopImage'

import Logo from '../../pages/logo.svg'
import style from './style.css'

const SelfRegister = ({ t }) => (
  <Grid fullHeight>
    <Row>
      <Col tv={12} desk={12} tablet={12} palm={12} className={style.columnPadding}>
        <Card>
          <CardContent>
            <Grid>
              <Row stretch>
                <Col tv={4} desk={4} tablet={4} palm={4}>
                  <div className={style.header}>
                    <Button
                      type="submit"
                      icon={<ArrowBack height={16} width={16} />}
                      fill="outline"
                      size="tiny"
                    >
                      Voltar
                    </Button>
                  </div>
                </Col>

                <Col tv={4} desk={4} tablet={4} palm={4}>
                  <div className={style.logo}>
                    <Logo width="140" />

                    <TopImage />

                    <span>Seja bem vindo</span>
                    <p>Crie sua conta e aceite pagamentos online hoje!</p>

                    <Form
                      onChange={this.onFormChange}
                      onSubmit={this.onFormSubmit}
                      validateOn="blur"
                      className={style.crescer}
                    >
                      <CardContent>
                        <FormInput
                          label={t('e-mail')}
                          name="email"
                        />

                        <FormInput
                          type="password"
                          label={t('password')}
                          name="password"
                        />

                        <FormInput
                          type="password"
                          label={t('confirmar senha')}
                          name="confirm-passwd"
                        />
                      </CardContent>
                      <CardActions>
                        <span className={style.buttonSubmit}>
                          <Button type="submit">
                            {t('continuar')}
                          </Button>
                        </span>
                      </CardActions>
                    </Form>
                  </div>
                </Col>

                <Col tv={4} desk={4} tablet={4} palm={4} />
              </Row>
            </Grid>
          </CardContent>
        </Card>
      </Col>
    </Row>

    <Row>
      <Col tv={12} desk={12} tablet={12} palm={12} className={style.stepsMiddle}>
        <BulletSteps
          status={[
            { id: 'id1', status: 'previous' },
            { id: 'id2', status: 'current' },
            { id: 'id3', status: 'next' },
          ]}
          steps={[
            { id: 'id1' },
            { id: 'id2' },
            { id: 'id3' },
          ]}
        />
      </Col>
    </Row>
  </Grid>
)

SelfRegister.propTypes = {
  t: PropTypes.func.isRequired,
}

export default SelfRegister
