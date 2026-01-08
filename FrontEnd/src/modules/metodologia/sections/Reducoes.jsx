import React from 'react'
import shapedividers from '@/assets/images/BgVectorReducoes.svg'
import VectorReducoes from '@/assets/images/VectorReducoes.svg'
import AccordeonLateral from '../components/AccordeonLateral'

export default function Reducoes() {
    return (
        <div className='relative flex flex-col items-center justify-center pb-40'>
            <img src={shapedividers} className='absolute -z-10 w-full select-none pointer-events-none max-lg:hidden' />
            <div className='flex flex-col gap-20' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <h1 className='2xl:!text-6xl !text-3xl uppercase pt-28 select-none pointer-events-none'>como estimamos <br /> as reduções?</h1>
                <h4 className='2xl:!text-4xl !text-2xl 2xl:w-150 select-none pointer-events-none'>Entenda como funcionam as análises apresentadas</h4>
                <button className="btSaibaMais">
                    <span className="label">Saiba mais</span>
                    <span className="arrow"><i className="fa-solid fa-arrow-right-long text-[var(--green-50)]"></i></span>
                </button>
                <div className='relative 2xl:top-30'>
                    <AccordeonLateral />
                </div>
            </div>
            <img src={VectorReducoes} className='absolute top-20 w-full -z-10 select-none pointer-events-none max-lg:hidden'/>
        </div>
    )
}
