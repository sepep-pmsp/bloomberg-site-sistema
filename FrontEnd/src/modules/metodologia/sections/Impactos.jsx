import React from 'react'
import shapedividers from '@/assets/images/BgVectorReducoes.svg'
import AccordeonLateral from '../components/AccordeonLateral'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 

export default function Impactos() {
    const impactosTheme = {
        activeBg: "var(--green-400)",
        inactiveBg: "var(--green-600)",
        numberBg: "var(--green-800)",
        numberText: "#D6F5DB",
        textColor: "var(--text-clean)"
    };
    const impactosData = [
        { id: 0, number: "1", description: "– Dispões apenas de dez minutos. Tens de correr – disse Gandalf.– Mas... – protestou Bilbo.– Não há tempo para isso – cortou o mago.– Mas... – repetiu Bilbo.– Também não há tempo para isso! Toca a andar!" },
        { id: 1, number: "2", description: "– Dispões apenas de dez minutos. Tens de correr – disse Gandalf.– Mas... – protestou Bilbo.– Não há tempo para isso – cortou o mago.– Mas... – repetiu Bilbo.– Também não há tempo para isso! Toca a andar!" },
        { id: 2, number: "3", description: "– Dispões apenas de dez minutos. Tens de correr – disse Gandalf.– Mas... – protestou Bilbo.– Não há tempo para isso – cortou o mago.– Mas... – repetiu Bilbo.– Também não há tempo para isso! Toca a andar!" },
        { id: 3, number: "4", description: "– Dispões apenas de dez minutos. Tens de correr – disse Gandalf.– Mas... – protestou Bilbo.– Não há tempo para isso – cortou o mago.– Mas... – repetiu Bilbo.– Também não há tempo para isso! Toca a andar!" },
    ]; 

    return (
        <div className='relative flex flex-col items-center justify-center pb-24'>
            <img src={shapedividers} className='absolute -z-10 w-full select-none pointer-events-none max-lg:hidden rotate-180' />
            <div className='flex flex-col gap-20 w-full' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <h1 className='2xl:!text-[4rem] !text-3xl uppercase pt-28 select-none pointer-events-none'>como estimamos o<br /> impacto na saúde?</h1>
                <p className='2xl:!text-2xl !text-2xl select-none pointer-events-none z-10 !font-bold'>
                    Entenda como funciona a estimativa de impacto da eletrificação da <br /> frota de ônibus na saúde da população
                </p>
                <button className="btSaibaMais">
                    <span className="label">Saiba mais</span>
                    <span className="arrow"><i className="fa-solid fa-arrow-right-long text-[var(--green-50)]"></i></span>
                </button>
                <div className='relative 2xl:top-13 overflow-auto'>
                    <AccordeonLateral
                        items={impactosData}
                        theme={impactosTheme}
                    />
                </div>
            </div>
            <div className='absolute top-110 w-full z-10 select-none pointer-events-none max-lg:hidden -translate-y-1/2'>
                <svg viewBox="0 0 1401 499" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto min-w-[1000px] lg:min-w-full" preserveAspectRatio="none">
                    <motion.path d="M-148 355.911C-45.2315 345.924 1288.61 516.007 1341.21 415.337C1406.96 289.498 566.461 286.842 866 117.26C1165.54 -52.3223 1437.76 -13.9716 1391 117.26C1344.24 248.491 850.743 389.624 631.484 436.208C388.93 487.742 -52.3395 566.241 54.3256 355.911C160.991 145.582 -331.422 194.119 -479 260.035" stroke="#CEFA05" strokeWidth="8" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "0px 0px -200px 0px" }} transition={{ duration: 2.5, ease: "easeInOut" }}/>
                </svg>
            </div>
        </div>
    )
}
