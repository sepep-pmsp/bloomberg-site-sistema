import React from 'react'
import bannerImg from '@/assets/images/Simulacoes.svg';

export default function Banner() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const btnClass = "flex items-center justify-center gap-3 bg-[#F3FDF5] text-[#0A290F] px-6 py-3 rounded-full font-bold text-sm md:text-base hover:bg-white hover:scale-105 transition-all shadow-md";
    return (
        <>
            <section style={{ backgroundImage: `url(${bannerImg})` }} className="relative min-h-[65vh] w-auto bg-cover bg-center max-md:w-[26.55rem]">
                <div className="absolute inset-0 w-full h-full flex items-end pb-20 bg-black/55 backdrop-blur-[1px] max-md:w-[26.55rem]">
                    <div className="max-w-240 px-11 text-[var(--green-50)] flex flex-col gap-8">
                        <h1 className='mb-6 !text-4xl 2xl:!text-[82px] font-bold leading-tight uppercase'>SIMULAÇÕES FUTURAS</h1>
                        <p className="max-w-150 !text-xl 2xl:!text-2xl">
                            Compreenda cenários futuros realizando as simulações de substituição de ônibus ou inserindo informações do cenário desejado
                        </p>
                        <div className="flex flex-wrap items-center gap-8">
                            <button onClick={() => scrollToSection('projeções')} className={btnClass}>
                                Projeções <i className="fa-solid fa-arrow-down"></i>
                            </button>
                            <button onClick={() => scrollToSection('onibusSugerido')} className={btnClass}>
                                Ônibus sugeridos  <i className="fa-solid fa-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
