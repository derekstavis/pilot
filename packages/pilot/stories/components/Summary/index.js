import React from 'react'
import { Card, CardContent } from 'former-kit'
import Summary from '../../../src/components/Summary'
import DataDisplay from '../../../src/components/DataDisplay'
import TotalDisplay from '../../../src/components/TotalDisplay'

const SummaryExample = () => (
  <Card>
    <CardContent>
      <Summary>
        <DataDisplay
          title="Data de Saída"
          value="20/03/2018"
        />
        <TotalDisplay
          amount={9995000}
          color="#37cc9a"
          title="Valor a ser transferido"
        />
        <TotalDisplay
          amount={10000000}
          color="#37cc9a"
          title="Valor Solicitado"
        />
        <TotalDisplay
          amount={-367}
          color="#ff796f"
          title="Custo da transferência"
        />
      </Summary>
    </CardContent>
  </Card>
)
export default SummaryExample
