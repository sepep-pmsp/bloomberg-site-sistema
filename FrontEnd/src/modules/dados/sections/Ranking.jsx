import React from 'react'
import Filtro from '../components/Filtro'

export default function Ranking() {
    return (
        <>
            <section className="bg-[var(--bg-page-secondary)] flex flex-col py-8">
                <div className='flex flex-col lg:flex-row justify-between items-center gap-5 py-2 px-3' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                    <h1 className='max-w-170 !text-xl lg:!text-5xl !font-normal text-[var(--green-800)]'>Rankeamento dos ônibus mais poluentes da cidade de São Paulo</h1>
                    <p className='max-w-110 !text-lg lg:!text-2xl lg:text-end'>Confira o ranking dos veículos mais poluentes da Capital. Filtre e elenque por modelos, linhas, quilômetros rodados ou pelo recorte de população afetada pelos poluentes</p>
                </div>
            </section>
            <section style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <Filtro />
            </section>
        </>
    )
}