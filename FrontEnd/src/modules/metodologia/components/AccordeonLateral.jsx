import { useState } from "react";
import MathRenderer from './MathRenderer';

export default function AccordeonLateral({ items, theme }) {
    const [activeId, setActiveId] = useState(items[0]?.id || 0);
    const defaultTheme = {
        activeBg: "#52B69A",
        inactiveBg: "#42947D",
        numberBg: "var(--accent-lime)",
        numberText: "var(--color-primary)",
        textColor: "var(--color-primary)"
    };
    const colors = { ...defaultTheme, ...theme };

    return (
        <ul className="flex gap-7 px-6 overflow-x-auto h-auto items-center py-8 md:flex-row flex-col justify-center w-full">
            {items.map(item => {
                const isActive = activeId === item.id;
                return (
                    <li key={item.id} onClick={() => setActiveId(item.id)} className={`accordion__item ${isActive ? "is-active" : ""} flex items-center shadow-lg`} style={{backgroundColor: isActive ? colors.activeBg : colors.inactiveBg}}>
                        <span className="absolute bottom-6 right-4 !text-4xl font-bold select-none rounded-full w-16 h-16 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: colors.numberBg,color: colors.numberText}}>
                            {item.number}
                        </span>
                        <div className="accordion__content">
                            <MathRenderer 
                                text={item.description} 
                                color={colors.textColor} 
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}