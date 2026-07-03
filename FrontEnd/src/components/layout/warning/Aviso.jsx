import React from 'react'

export default function Aviso() {
  return (
    <div className="w-full bg-yellow-300 text-black px-6 py-3 flex items-center justify-center gap-4 font-medium">
      <span className="text-3xl"><i class="fa-solid fa-triangle-exclamation text-3xl"></i></span>

      <p className="text-sm md:text-base">
        <span className='!font-bold'>Dados de amostragem:</span> As informações apresentadas correspondem à amostragem realizada em 30/06/2026, no período das 11h45 às 23h59.
      </p>
    </div>
  );
}