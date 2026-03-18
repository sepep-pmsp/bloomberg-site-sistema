import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo() {
  return (
    <Link to="/metodologia" className="flex items-start justify-center flex-col z-50">
      <h1 className='uppercase text-[var(--teal-50)] !text-xl lg:!text-3xl font-bold tracking-widest flex items-center'>CITY DATA ALIANCE</h1>
      <h2 className='uppercase text-[var(--teal-50)] !text-xl lg:!text-2xl !font-light tracking-widest flex items-center'>Climate Budget</h2>
    </Link>
  );
}