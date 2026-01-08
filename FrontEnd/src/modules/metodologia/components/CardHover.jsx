import React from 'react'
import Vector from '@/assets/images/VectorSlide.svg'
import BusIcon from '@/assets/images/Bus.svg'
import GlobeIcon from '@/assets/images/Temp.svg'
import CloudIcon from '@/assets/images/Nuvem.svg'
import useLockHorizontalScrollMd from '../hook/useLockHorizontalScrollMd'


export default function CardHover() {
    useLockHorizontalScrollMd();

    const cardItens = [
        { id: 0, icon: BusIcon, description: "A velha sabedoria do Ocidente foi esquecida. Os reis fizeram tumbas mais belas que as casas dos vivos, dando mais valor ao nome de seus ancestrais do que aos dos seus filhos.Gandalf" },
        { id: 1, icon: GlobeIcon, description: "Um Anel para a todos governar, Um Anel para encontrá-los, Um Anel para a todos trazer e na escuridão aprisioná-los, Na Terra de Mordor onde as Sombras jazem." },
        { id: 2, icon: CloudIcon, description: "Tudo o que temos de decidir é o que fazer com o tempo que nos é dado.Gandalf " },
    ];
    return (
        <div className="flex flex-wrap justify-center gap-10">
            {cardItens.map(item => (
                <div key={item.id} className="group relative w-[300px] h-[40rem] flex items-start cursor-pointe justify-center overflow-hidden ">
                    <div className="absolute top-0 left-8 h-60 w-60 bg-[var(--green-800)] flex items-center justify-center rounded-full z-10">
                        <img src={item.icon} className="w-24 h-24 object-contain select-none pointer-events-none"/>
                    </div>
                    <div className="absolute top-44 left-8 md:h-1 md:group-hover:h-120 w-60 bg-[var(--green-600)] rounded-2xl h-120 px-6 py-5 text-[var(--color-primary-light)] translate-y-[-80px] transition-all duration-500 ease-out group-hover: shadow-2xl flex flex-col justify-end overflow-y-auto">
                        <p className="text-center text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
            <img src={Vector} className='absolute w-full top-[163rem] -z-10 left-0 select-none pointer-events-none max-md:hidden' />
            <div className='bg-[#CEFA05] w-32 h-[1.3rem] absolute right-[118rem] rotate-[155deg] select-none pointer-events-none max-md:hidden' />
            <div className='bg-[#CEFA05] h-[1.3rem] absolute w-[115px] z-[-1] left-[1847px] top-[3019px] rotate-[244deg] select-none pointer-events-none max-md:hidden' />
        </div>
    )
}