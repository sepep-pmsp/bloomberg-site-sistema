import React from 'react';

export default function MathRenderer({ text, color }) {
    if (!text) return null;
    if (!text.includes('$$')) {
        return (
            <p className="text-lg 2xl:!text-xl leading-relaxed pr-16 font-medium whitespace-pre-line" style={{ color: color }}>
                {text}
            </p>
        );
    }
    const parts = text.split('$$');
    return (
        <div className="pr-16">
            {parts.map((part, index) => {
                if (part.trim() === '') return null;
                if (index % 2 === 1) {
                    return (
                        <div key={index} className="my-4 p-3 bg-black/10 rounded-lg border-l-4 border-[var(--accent-lime)] text-center w-full">
                            <h4 className="!text-lg !font-bold text-[#1D5D42] tracking-wide !italic" >
                                {part.trim()}
                            </h4>
                        </div>
                    );
                }
                return (
                    <p key={index} className="text-lg 2xl:!text-xl leading-relaxed font-medium whitespace-pre-line mb-2" style={{ color: color }}>
                        {part.trim()}
                    </p>
                );
            })}
        </div>
    );
}