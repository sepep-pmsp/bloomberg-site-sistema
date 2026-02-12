import React from 'react'
import BusIcon from '@/assets/images/Bus.svg'
import GlobeIcon from '@/assets/images/Temp.svg'
import CloudIcon from '@/assets/images/Nuvem.svg'
import useLockHorizontalScrollMd from '../hook/useLockHorizontalScrollMd'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 


export default function CardHover({ items }) {
    useLockHorizontalScrollMd();
    const iconMap = {
        'bus': BusIcon,
        'globe': GlobeIcon,
        'cloud': CloudIcon
    };
    const cardItens = items || [];

    return (
        <div className="relative w-full flex items-center justify-center overflow-hidden h-[62%]">
            <div className="flex flex-wrap justify-center gap-10 z-10 h-full relative top-40">
                {cardItens.map(item => (
                    <div key={item.id} className="group relative w-[300px] flex items-start cursor-pointer justify-center overflow-hidden">
                        <div className="absolute top-4 left-8 h-60 w-60 bg-[var(--green-800)] flex items-center justify-center rounded-full z-10">
                            <img src={iconMap[item.icon] || BusIcon} className="w-24 h-24 object-contain select-none pointer-events-none"/>
                        </div>
                        <div className="absolute top-48 left-8 md:h-1 md:group-hover:h-170 w-60 bg-[var(--green-600)] rounded-2xl h-120 px-6 py-5 text-[var(--color-primary-light)] translate-y-[-80px] transition-all duration-500 ease-out shadow-2xl flex flex-col justify-end overflow-y-auto group-hover:shadow-2xl">
                            <p className="text-center text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute top-1/4 -left-7 w-[124rem] -translate-y-1/2 z-0 pointer-events-none">
                <div className="absolute top-1/2 -left-4 w-[124rem] -translate-y-1/2 z-0 pointer-events-none -scale-x-100">
                    <svg viewBox="0 0 2043 438" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto min-w-[1000px] lg:min-w-full" preserveAspectRatio="none">
                        <motion.path d="M2032.49 432.54C1748.49 -142.96 1250.48 288.619 1225.99 276.383C1101.36 214.133 1045.99 331.384 882.485 276.384C647.459 197.323 638.986 451.883 539.486 276.383C423.174 71.2305 402.986 -116.46 5.9856 125.54" stroke="#CEFA05" strokeWidth="15" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeInOut" }}/>
                    </svg>
                </div>
            </div>
        </div>
    )
}