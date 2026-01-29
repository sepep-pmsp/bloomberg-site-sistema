import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo() {
  return (
    <Link to="/metodologia" className="flex items-center gap-3 z-50">
      <h1 className='uppercase text-[var(--teal-50)] !text-xl lg:!text-4xl font-bold tracking-widest flex items-center'>
        cda são paulo
      </h1>
    </Link>
  );
}