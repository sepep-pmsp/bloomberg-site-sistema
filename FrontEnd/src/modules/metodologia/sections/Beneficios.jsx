import React from 'react';
import Bus from '@/assets/images/bus-icon-eletric.png'
import Cloud from '@/assets/images/cloud.svg'
import Forest from '@/assets/images/forest.svg'
import Gas from '@/assets/images/local_gas_station.svg'
import Maps from '@/assets/images/maps.svg'

const CirculoAnimado = ({ id, texto, icone }) => {
    return (
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#EAF7EC] flex items-center justify-center shadow-lg shrink-0 group">
            <div className="z-10 text-[#1A5824] text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110">
                {icone}
            </div>
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                <path id={`circlePath-${id}`} d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="none"/>
                <text fill="#1A5824" fontSize="13"fontWeight="900" letterSpacing="1" className="transform origin-center hover-animado">
                    <textPath  href={`#circlePath-${id}`} startOffset="50%" textAnchor="middle">
                        {texto}
                    </textPath>
                </text>
            </svg>
        </div>
    );
};
export default function Beneficios() {
    return (
        <>
            <style>{`
                .hover-animado {
                    transition: transform 0.4s ease-in-out;
                }
                .group:hover .hover-animado {
                    transform: rotate(25deg); 
                }
            `}</style>

            <div className='flex flex-col bg-[#1A5824] py-20 px-4'>
                <div className="w-full flex flex-col gap-16" style={{ maxWidth: "1420px", margin: "0 auto" }}>
                    <h2 className='text-white text-center text-xl lg:!text-5xl leading-tight'>
                        Quais os benefícios da <br className="hidden md:block"/> substituição da frota à diesel?
                    </h2>
                    <section className="!flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12 w-full my-8">
                        <div className="text-white text-[120px] md:text-[180px] shrink-0">
                            <img src={Bus} alt="" />
                        </div>
                        <div className="text-white text-6xl md:text-8xl font-black shrink-0 rotate-90 xl:rotate-0 relative lg:-left-5">=</div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 xl:gap-10">
                            <CirculoAnimado id="diesel" texto="-35 mil litros de óleo diesel/ano" icone={<img src={Gas} alt="" />} />
                            <CirculoAnimado  id="co2" texto="-87 toneladas de CO²/ano" icone={<img src={Cloud} alt="" />} />
                            <CirculoAnimado id="arvores" texto="+6,4 mil árvores" icone={<img src={Forest} alt="" />} />
                        </div>
                    </section>
                </div>
                <span className='h-1 w-full bg-white'style={{ maxWidth: "1420px", margin: "0 auto" }}></span>
                <section className='!flex flex-col items-start justify-center gap-8 xl:gap-12 w-full my-12' style={{ maxWidth: "1420px", margin: "0 auto" }}>
                    <h3 className='w-full mt-8 text-white !text-xl lg:!text-4xl'>EVOLUÇÃO DA FROTA DE ÔNIBUS ELÉTRICOS</h3>
                    <img src={Maps} alt="" />
                </section>
            </div>
        </>
    );
}