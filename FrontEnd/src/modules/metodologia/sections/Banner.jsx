import React from 'react'
import bannerImg from '@/assets/images/banner.svg';
import BusProgressBar from '../components/BusProgressBar';

export default function Banner() {

    return (
        <>
            <section style={{ backgroundImage: `url(${bannerImg})` }} className="relative min-h-[65vh] w-full bg-cover bg-center max-md:w-[26.55rem]">
                <div className="absolute inset-0 w-full h-full flex items-end pb-20 bg-black/55 backdrop-blur-[1px] max-md:w-[26.55rem]">
                    <div className="max-w-180 px-11 text-white">
                        <h1 className="mb-6 text-2xl 2xl:!text-[82px] font-bold leading-tight max-w-130">
                            ELETRIFICAÇÃO<br />DA FROTA
                        </h1>
                        <p className="max-w-130 2xl:!text-xl">
                            Tudo o que você precisa saber sobre a eletrificação da
                            frota de ônibus de São Paulo
                        </p>
                    </div>
                </div>
            </section>
            <section className='bg-[var(--bg-page-secondary)] py-8 '>
                <div className='flex flex-col gap-15'style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                    <h1 className='lg:!text-5xl !text-base lg:w-4xl'>Acompanhe de perto a meta de Eletrificação para 2028</h1>
                    <div className='flex flex-col lg:flex-row justify-between gap-8'>
                        <p className='w-full !font-semibold lg:w-2xl !text-2xl'>Substituir 2.600 ônibus movidos a diesel por veículos de matriz energética mais limpa, reforçando o compromisso da cidade com a preservação ambiental.</p>
                    </div>
                </div>
            </section>
            <section style={{ maxWidth: "1420px", height: "75vh", margin: "0 auto" }}>
                <BusProgressBar/>
            </section>
        </>
    )
}