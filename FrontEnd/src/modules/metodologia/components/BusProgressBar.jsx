import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 
import busImage from '@/assets/images/bus-icon.svg'; 

export default function BusProgressBar({ 
  currentValue = 1530, 
  maxValue = 2600, 
  intermediateValue = 1000 
}) {
  const percentage = Math.min((currentValue / maxValue) * 100, 100);
  const transitionSettings = { duration: 2.5, ease: "easeInOut" };

  return (
    <div className="w-full relative flex flex-col justify-start items-center flex-nowrap mt-24 gap-15 py-8">
      <div className="relative w-full">
        <div className="absolute -top-6 left-0 w-full h-4 z-0 pl-4 pr-4 rounded-full">
             <svg width="100%" height="100%" className="overflow-visible">
                 <line 
                    x1="0" y1="50%" x2="100%" y2="50%" 
                    stroke="" 
                    strokeWidth="4" 
                    strokeDasharray="12 12" 
                    opacity="0.2" 
                 />
                 <motion.line 
                    x1="0" y1="50%" 
                    x2="0%"
                    y2="50%"
                    stroke="#269B5F"
                    strokeWidth="4"
                    strokeDasharray="12 12"
                    initial={{ x2: "0%" }}
                    whileInView={{ x2: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={transitionSettings}
                 />
             </svg>
        </div>
        <div className="h-8 w-full bg-[var(--green-450)] rounded-full relative overflow-visible shadow-inner">
          <motion.div className="h-full bg-[var(--accent-lime)] shadow-[inset_4px_4px_13px_#00000022,inset_-4px_-4px_13px_#00000022] rounded-full relative" initial={{ width: 0 }} whileInView={{ width: `${percentage}%` }} viewport={{ once: true }} transition={transitionSettings} >
             <div className="absolute right-8 -top-21 w-34 h-34 translate-x-1/2 z-20 pr-4">
                <img src={busImage} alt="Bus" className="w-full h-auto" />
             </div>
          </motion.div>
        </div>
        <div className='flex justify-between w-full items-center'>
            <div className="" style={{ left: `${(intermediateValue / maxValue) * 100}%`, transform: 'translateX(10%)'}}>
                <div className="bg-[#1D5D42] text-white py-4 rounded-b-2xl shadow-lg text-center w-55 relative">
                    <h3 className="!font-bold !text-base">{intermediateValue} <span className="!text-sm uppercase !font-[var(--font-heading-primary)] !font-medium">veículos eletrificados<br/>em 2025</span></h3>
                </div>
            </div>
            <div className="" style={{ left: `${(intermediateValue / maxValue) * 100}%`, transform: 'translateX(-10%)'}}>
                <div className="bg-[#1D5D42] text-white py-4 rounded-b-2xl shadow-lg text-center w-55 relative">
                    <h3 className="!font-bold !text-base">{maxValue} <span className="!text-sm uppercase !font-[var(--font-heading-primary)] !font-medium">veículos eletrificados<br/>até 2028</span></h3>
                </div>
            </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center relative">
        <div className="absolute -top-37 w-full max-w-3xl h-[320px] pointer-events-none flex justify-center z-20">
            <svg width="100%" height="100%" viewBox="0 0 609 312" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <motion.path 
                    d="M390.132 2.05588C426.461 0.810151 541.215 20.4341 541.215 47.7628C541.215 82.239 433.209 101.329 308.021 121.676C182.832 142.023 81.6997 149.913 29.6606 181.886C-22.3784 213.86 7.56857 231.715 49.2979 231.715C79.9135 231.715 224.562 232.546 274.637 266.596C324.712 300.646 199.524 323.484 200.997 301.061C202.47 278.638 597.181 249.986 607 222.165"
                    fill="transparent" 
                    stroke="#CEFA05" 
                    strokeWidth="4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "0px 0px -200px 0px" }}
                    transition={{ 
                        duration: 2.5, 
                        ease: "easeInOut",
                        delay: 0.5 
                    }}/>
            </svg>
        </div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }}  whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring' }} className="bg-[#1D5D42] text-white px-12 py-6 rounded-xl shadow-2xl z-10 text-center relative xl:w-4xl h-28 flex items-center justify-center">
             <h2 className="!text-2xl !font-normal">
                <span className="mr-2 !font-extrabold">{currentValue}</span> 
                veículos já substituídos!
             </h2>
        </motion.div>
      </div>
    </div>
  );
}