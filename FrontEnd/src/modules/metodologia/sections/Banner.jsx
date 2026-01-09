import React from 'react'
import bannerImg from '@/assets/images/banner.svg';

export default function Banner() {
    const stats = [
        { value: '30%', description: 'De toda a frota de São Paulo já é elétrica' },
        { value: '1000', description: 'Isso representa um total de 1000 veículos rodando na cidade sem combustível' },
        { value: '70%', description: 'É a meta de eletrificação para o ano de 2030' },
    ];
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
            <section className="bg-[var(--green-800)] w-full max-md:w-[26.55rem]">
                <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] divide-y md:divide-y-0 md:divide-x divide-green-700 md:mx-auto">
                    {stats.map(({ value, description }, index) => (
                        <div key={index} className={`flex flex-col items-center justify-center px-6 py-10 text-center 2xl:${index === 1 ? '!border-x-3 !border-[var(--green-400)] w-full' : ''}`}>
                            <h2 className="2xl:!text-[82px] font-bold text-[var(--green-400)]">
                                {value}
                            </h2>
                            <h4 className="mt-4 !text-2xl text-[var(--green-400)] max-w-xs">
                                {description}
                            </h4>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}