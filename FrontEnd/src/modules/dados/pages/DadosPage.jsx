import React from 'react'
import Banner from '../sections/Banner'
import RankingPlus from '../sections/RankingPlus'
import Analise from '../sections/Analises'
import RankingMinus from '../sections/RankingMinus'

export default function DadosPage() {
  return (
    <>
        <Banner />
        <div id="secao-territorializacao">
            <Analise />
        </div>
        <div id="secao-diesel">
            <RankingPlus />
        </div>
        <div id="secao-eletricos">
            <RankingMinus />
        </div>
    </>
  )
}