import { useState } from "react";

export default function AccordeonLateral() {
    const [activeId, setActiveId] = useState(0);

    const items = [
        { id: 0, number: "1", description: "Ora, os orcs são cruéis, malvados e perversos. Não fazem coisas bonitas, mas fazem muitas coisas engenhosas. Podem cavar túneis e minas tão bem quanto qualquer um, exceto os anões mais habilidosos, quando se dão ao trabalho, embora geralmente sejam desorganizados e sujos. Martelos, machados, espadas, punhais, picaretas, tenazes, além de instrumentos de tortura, eles fazem muito bem, ou mandam outras pessoas fazerem conforme o seu padrão, prisioneiros e escravos que têm de trabalhar até morrer por falta de ar e luz. Não é improvável que tenham inventado algumas das máquinas que desde então perturbam o mundo, especialmente os instrumentos engenhosos para matar um grande número de pessoas de uma só vez, pois sempre gostaram muito de rodas e motores e explosões, como também de não trabalhar com as próprias mãos além do estritamente necessário; mas naqueles dias e naquelas regiões selvagens ainda não tinham avançado (como se diz) tanto." },
        { id: 1, number: "2", description: "- Aquela é A Montanha? - perguntou Bilbo numa voz solene, olhando para ela com os olhos esbugalhados. Nunca vira algo que parecera tão grande.- Claro que não! - disse Balin. - Ali é apenas o começo das Montanhas Sombrias, e nós temos que achar um meio de atravessá-las, ou passar por cima ou por baixo delas... [...]- Oh! - disse Bilbo, e naquele mesmo momento sentiu o maior cansaço que lembrava já ter sentido. Estava mais uma vez pensando em sua confortável cadeira diante do fogo, na sala favorita de sua toca, e na chaleira cantando. Não pela última vez [Trecho de O Hobbit]" },
        { id: 2, number: "3", description: "É estranho, mas as coisas boas e os dias agradáveis são narrados depressa, e não há muito que ouvir sobre eles, enquanto as coisas desconfortáveis, palpitantes e até mesmo horríveis podem dar uma boa história e levar um bom tempo para contar." },
        { id: 3, number: "4", description: "Eles começaram a sentir que toda aquela terra era irreal, e que estavam caminhando num sonho agourento, do qual nunca acordavam.[A Sociedade do Anel ]" },
        { id: 4, number: "5", description: "E por favor não me cozinheis, amáveis senhores! Eu próprio sou um bom cozinheiro, e cozinho melhor do que sou cozinhado, se entendem o que quero dizer. Cozinharei maravilhosamente para vós, um pequeno almoço perfeitamente maravilhoso, desde que não me janteis." },
        { id: 5, number: "6", description: "– Dispões apenas de dez minutos. Tens de correr – disse Gandalf.– Mas... – protestou Bilbo.– Não há tempo para isso – cortou o mago.– Mas... – repetiu Bilbo.– Também não há tempo para isso! Toca a andar!" },
    ];

    return (
        <ul className=" flex gap-7 px-6 overflow-x-auto md:overflow-x-scroll h-auto items-center py-8 md:flex-row flex-col">
            {items.map(item => (
                <li
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={`accordion__item ${activeId === item.id ? "is-active" : ""} flex items-center `}>
                    {/* Número */}
                    <span className="absolute bottom-6 right-4 !text-4xl font-bold text-[var(--color-primary)] select-none bg-[var(--accent-lime)] rounded-full w-16 h-16 flex items-center justify-center">
                        {item.number}
                    </span>
                    <div className="accordion__content text-[var(--color-primary)]">
                        <p className="text-lg  2xl:!text-xl leading-relaxed pr-16">
                            {item.description}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}