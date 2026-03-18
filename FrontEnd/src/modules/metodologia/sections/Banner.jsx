import React from 'react'
import bannerImg from '@/assets/images/banner.svg';
import BusProgressBar from '../components/BusProgressBar';
import Beneficios from './Beneficios';

export default function Banner({ content }) {
    if (!content) return null;

    const { banner, progressBar } = content;

    return (
        <>
            <section style={{ backgroundImage: `url(${bannerImg})` }} className="relative min-h-[65vh] w-full bg-cover bg-center max-md:w-[26.55rem]">
                <div className="absolute inset-0 w-full h-full flex items-end pb-20 bg-black/55 backdrop-blur-[1px] max-md:w-[26.55rem]">
                    <div className="max-w-180 px-11 text-white">
                        <h1 className="mb-6 text-2xl 2xl:!text-[82px] font-bold leading-tight max-w-130" dangerouslySetInnerHTML={{ __html: banner.title }} />
                        <p className="max-w-130 2xl:!text-xl">
                            {banner.subtitle}
                        </p>
                    </div>
                </div>
            </section>
            <>
                <Beneficios />
            </>
            <section className='bg-[var(--bg-page-secondary)] py-8 '>
                <div className='flex flex-col gap-15'style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                    <h1 className='lg:!text-5xl !text-base lg:w-4xl'>{progressBar.title}</h1>
                    <div className='flex flex-col lg:flex-row justify-between gap-8'>
                        <p className='w-full !font-semibold lg:w-2xl !text-2xl'>{progressBar.description}</p>
                    </div>
                </div>
            </section>
            <section style={{ maxWidth: "1420px", height: "75vh", margin: "0 auto" }}>
                {progressBar?.currentValue?.[0] ? (
                    <BusProgressBar 
                        current={progressBar.currentValue[0]} 
                        max={progressBar.maxValue[0]}
                        intermediate={progressBar.intermediateValue[0]} 
                     />
                ) : null}
            </section>
        </>
    )
}