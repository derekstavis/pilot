import React, { Fragment } from 'react'
import {
  Grid,
  Row,
  Col,
} from 'former-kit'

import IconInfo from 'emblematic-icons/svg/Info24.svg'

import Section from '../../Section'
import TotalDisplay from '../../../src/components/TotalDisplay'

const TotalDisplayExample = () => (
  <Fragment>
    <Section>
      <Grid>
        <Row>
          <Col palm={12} tablet={12} desk={12}>
            <TotalDisplay
              align="center"
              title="Valor Capturado"
              amount={1000000000}
              color="#37cc9a"
              subtitle={
                <span>
                  Capturado em 10/03/2018 às 14:15h
                </span>
              }
            />
          </Col>
        </Row>

        <Row>
          <Col palm={12} tablet={12} desk={12}>
            <TotalDisplay
              align="start"
              title="Total de Saídas"
              amount={-500000}
              color="#ff796f"
              subtitle={
                <span>
                  MDR: R$ 6,00 | Valor estornado: R$ 15,00 <br />
                  Outras saídas: R$ 0,75 <IconInfo width={12} height={12} />
                </span>
              }
            />
          </Col>
        </Row>

        <Row>
          <Col palm={12} tablet={12} desk={12}>
            <TotalDisplay
              align="end"
              title="Valor Líquido"
              amount={9995000000}
              color="#4ca9d7"
              subtitle={
                <span>
                  Data a receber: 20/03/2018
                </span>
              }
            />
          </Col>
        </Row>
      </Grid>
    </Section>
  </Fragment>
)

export default TotalDisplayExample
