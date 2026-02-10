import React from 'react'
import shapedividers from '@/assets/images/BgVectorReducoes.svg'
import AccordeonLateral from '../components/AccordeonLateral'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 

export default function Reducoes() {

    const reducoesData =[
        { id: 0, number: "1", description: "Ora, os orcs são cruéis, malvados e perversos. Não fazem coisas bonitas, mas fazem muitas coisas engenhosas. Podem cavar túneis e minas tão bem quanto qualquer um, exceto os anões mais habilidosos, quando se dão ao trabalho, embora geralmente sejam desorganizados e sujos. Martelos, machados, espadas, punhais, picaretas, tenazes, além de instrumentos de tortura, eles fazem muito bem, ou mandam outras pessoas fazerem conforme o seu padrão, prisioneiros e escravos que têm de trabalhar até morrer por falta de ar e luz. Não é improvável que tenham inventado algumas das máquinas que desde então perturbam o mundo, especialmente os instrumentos engenhosos para matar um grande número de pessoas de uma só vez, pois sempre gostaram muito de rodas e motores e explosões, como também de não trabalhar com as próprias mãos além do estritamente necessário; mas naqueles dias e naquelas regiões selvagens ainda não tinham avançado (como se diz) tanto." },
        { id: 1, number: "2", description: "- Aquela é A Montanha? - perguntou Bilbo numa voz solene, olhando para ela com os olhos esbugalhados. Nunca vira algo que parecera tão grande.- Claro que não! - disse Balin. - Ali é apenas o começo das Montanhas Sombrias, e nós temos que achar um meio de atravessá-las, ou passar por cima ou por baixo delas... [...]- Oh! - disse Bilbo, e naquele mesmo momento sentiu o maior cansaço que lembrava já ter sentido. Estava mais uma vez pensando em sua confortável cadeira diante do fogo, na sala favorita de sua toca, e na chaleira cantando. Não pela última vez [Trecho de O Hobbit]" },
        { id: 2, number: "3", description: "É estranho, mas as coisas boas e os dias agradáveis são narrados depressa, e não há muito que ouvir sobre eles, enquanto as coisas desconfortáveis, palpitantes e até mesmo horríveis podem dar uma boa história e levar um bom tempo para contar." },
        { id: 3, number: "4", description: "Eles começaram a sentir que toda aquela terra era irreal, e que estavam caminhando num sonho agourento, do qual nunca acordavam.[A Sociedade do Anel ]" },
        { id: 4, number: "5", description: "E por favor não me cozinheis, amáveis senhores! Eu próprio sou um bom cozinheiro, e cozinho melhor do que sou cozinhado, se entendem o que quero dizer. Cozinharei maravilhosamente para vós, um pequeno almoço perfeitamente maravilhoso, desde que não me janteis." },
        { id: 5, number: "6", description: "– Dispões apenas de dez minutos. Tens de correr – disse Gandalf.– Mas... – protestou Bilbo.– Não há tempo para isso – cortou o mago.– Mas... – repetiu Bilbo.– Também não há tempo para isso! Toca a andar!" },
    ];

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
                <h1 className='2xl:!text-[4rem] !text-3xl uppercase pt-28 select-none pointer-events-none'>como estimamos <br /> as reduções?</h1>
                <p className='2xl:!text-2xl !text-base w-full 2xl:w-150 select-none pointer-events-none !font-bold break-all max-md:w-6/12'>Entenda como funcionam as análises apresentadas</p>
                <button className="btSaibaMais">
                    <span className="label">Saiba mais</span>
                    <span className="arrow"><i className="fa-solid fa-arrow-right-long text-[var(--green-50)]"></i></span>
                </button>
                <div className='relative 2xl:top-30 overflow-auto'>
                    <AccordeonLateral 
                        items={reducoesData} 
                        theme={reducoesTheme} 
                    />
                </div>
            </div>
            <div className='absolute top-55 w-full -z-10 select-none pointer-events-none max-lg:hidden -translate-y-1/2'>
                <svg viewBox="0 0 1401 499" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto min-w-[1000px] lg:min-w-full" preserveAspectRatio="none">
                    <motion.path d="M-148 355.911C-45.2315 345.924 1288.61 516.007 1341.21 415.337C1406.96 289.498 566.461 286.842 866 117.26C1165.54 -52.3223 1437.76 -13.9716 1391 117.26C1344.24 248.491 850.743 389.624 631.484 436.208C388.93 487.742 -52.3395 566.241 54.3256 355.911C160.991 145.582 -331.422 194.119 -479 260.035" stroke="#CEFA05" strokeWidth="8" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "0px 0px -200px 0px" }} transition={{ duration: 2.5, ease: "easeInOut" }}/>
                </svg>
            </div>
        </div>
    )
}