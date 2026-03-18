import React from 'react'
import CardHover from '../components/CardHover'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Cenarios({ content }) {
    if (!content) return null;
    const { title, subtitle, cards } = content;

    return (
        <div className='w-screen h-full 2xl:h-[170vh] my-20'>
            <div className='flex flex-col justify-center items-center' style={{ maxWidth: "1420px", height: "auto", margin: "0 auto" }}>
                <div className='pt-28 flex flex-col gap-10 mb-16'>
                    <h2 className='text-3xl 2xl:!text-[64px] text-center capitalize w-full' dangerouslySetInnerHTML={{ __html: title }}/>
                    <h4 className='text-center 2xl:!text-4xl' dangerouslySetInnerHTML={{ __html: subtitle }}/>
                </div>
            </div>
            <span className='w-full relative bottom-25'>
                    <CardHover items={cards}/>
            </span>
            <div className='w-full relative bottom-15 -z-1 2xl:h-[45rem] select-none pointer-events-none max-lg:hidden -translate-y-1/2'>
                <svg viewBox="0 0 1440 601" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto min-w-[1000px] lg:min-w-full" preserveAspectRatio="none">
                    <motion.path d="M1545.21 295.533C1427.1 -27.7782 626.5 273.916 545 312.918C463.5 351.919 -163.784 637.188 -327.286 582.188C-562.312 503.128 1396.5 501.418 1297 325.918C1180.69 120.765 -68.2081 -39.3839 -215.786 26.5314" stroke="#CEFA05" strokeWidth="10" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "0px 0px -500px 0px" }} transition={{ duration: 2.5, ease: "easeInOut" }}/>
                </svg>
            </div>
        </div>
    )
}
