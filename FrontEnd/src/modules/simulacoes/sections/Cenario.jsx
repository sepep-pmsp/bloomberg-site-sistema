import React from 'react'
import Tabela from '../components/Tabela'

export default function Cenario() {
    return (
        <>
            <section className="bg-[#0A290F] flex flex-col py-12">
                <div className='flex flex-col lg:flex-row justify-between items-center gap-5 py-2 px-3' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                    <h1 className='max-w-170 !text-xl lg:!text-5xl !font-normal text-[var(--green-50)]'>Alcançando o cenário máximo evitado</h1>
                    <p className='max-w-110 !text-lg lg:!text-2xl lg:text-end text-[var(--green-50)]'>Uma sugestão de substituições que aproximam o impacto alcançado do cenário máximo</p>
                </div>
            </section>
            <section style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <Tabela />
            </section>
        </>
    )
}