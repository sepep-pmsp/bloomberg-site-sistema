import React from 'react'
import Banner from '../sections/Banner'
import Simulacoes from '../sections/Simulacoes'
import Cenario from '../sections/Cenario'

export default function SimulaçoesPage() {
  return (
    <>
      <Banner />
      <Simulacoes/>
      <div id='onibusSugerido'>
        <Cenario/>
      </div>
    </>
  )
}
