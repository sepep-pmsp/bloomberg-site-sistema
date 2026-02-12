import React, { useState }  from 'react'
import shapedividers from '@/assets/images/BgVectorReducoes.svg'
import AccordeonLateral from '../components/AccordeonLateral'
import Modal from '../components/Modal'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 

export default function Reducoes({ content }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    if (!content) return null;
    const { title, subtitle, doc, items } = content;
    const reducoesTheme = {
        activeBg: "#52B69A",
        inactiveBg: "#42947D",
        numberBg: "var(--accent-lime)", 
        numberText: "var(--color-primary)",
        textColor: "var(--color-primary)"
    };

    return (
        <div className='relative flex flex-col items-center justify-center pb-40'>
            <img src={shapedividers} className='absolute -z-10 w-full select-none pointer-events-none max-lg:hidden' />
            <div className='flex flex-col gap-20 max-md:items-center relative bottom-40' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <h1 className='2xl:!text-[4rem] !text-3xl uppercase pt-28 select-none pointer-events-none'dangerouslySetInnerHTML={{ __html: title }} />
                <p className='2xl:!text-2xl !text-base w-full 2xl:w-150 select-none pointer-events-none !font-bold break-all max-md:w-6/12'>{subtitle}</p>
                {doc && (
                    <button className="btSaibaMais" onClick={() => setIsModalOpen(true)}>
                        <span className="label">Saiba mais</span>
                        <span className="arrow">
                            <i className="fa-solid fa-arrow-right-long text-[var(--green-50)]"></i>
                        </span>
                    </button>
                )}
                <div className='relative 2xl:top-30 overflow-auto'>
                    <AccordeonLateral 
                        items={items || []} 
                        theme={reducoesTheme} 
                    />
                </div>
            </div>
            <div className='absolute top-55 w-full -z-10 select-none pointer-events-none max-lg:hidden -translate-y-1/2'>
                <svg viewBox="0 0 1401 499" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto min-w-[1000px] lg:min-w-full" preserveAspectRatio="none">
                    <motion.path d="M-148 355.911C-45.2315 345.924 1288.61 516.007 1341.21 415.337C1406.96 289.498 566.461 286.842 866 117.26C1165.54 -52.3223 1437.76 -13.9716 1391 117.26C1344.24 248.491 850.743 389.624 631.484 436.208C388.93 487.742 -52.3395 566.241 54.3256 355.911C160.991 145.582 -331.422 194.119 -479 260.035" stroke="#CEFA05" strokeWidth="8" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "0px 0px -200px 0px" }} transition={{ duration: 2.5, ease: "easeInOut" }}/>
                </svg>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Metodologia Detalhada: Reduções">
                {doc}
            </Modal>
        </div>
    )
}