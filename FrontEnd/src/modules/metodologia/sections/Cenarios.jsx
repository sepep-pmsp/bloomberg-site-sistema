import React from 'react'
import CardHover from '../components/CardHover'
import VectorBg from '@/assets/images/VectorBg.svg'

export default function Cenarios() {
    return (
        <div className='w-screen h-full 2xl:h-[115vh]'>
            <div className='flex flex-col justify-center items-center' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <div className='pt-28 flex flex-col gap-10 mb-16'>
                    <h2 className='text-3xl 2xl:!text-[64px] text-center capitalize w-full '>Como construímos <br /> cenários?</h2>
                    <h4 className='text-center 2xl:!text-4xl'>Entenda como funcionam as<br /> análises apresentadas</h4>
                </div>
                <CardHover />
            </div>
            <img src={VectorBg} className='w-full relative bottom-95 -z-1 2xl:h-[45rem] select-none pointer-events-none' />
        </div>
    )
}
