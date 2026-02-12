import React from 'react';
import { usePageContent } from '../hook/usePageContent';
import Banner from '../sections/Banner';
import Reducoes from '../sections/Reducoes';
import Cenarios from '../sections/Cenarios';
import Impactos from '../sections/Impactos';

export default function MetodologiaPage() {
  const { data, loading, error } = usePageContent('metodologia');
  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center text-green-800 font-bold">Carregando dados...</div>;
  }
  if (error) {
    return <div className="h-screen w-full flex items-center justify-center text-red-600">Erro: {error}</div>;
  }
  if (!data) return null;

  return (
    <>
        <Banner content={data.banner_progress} />
        <Reducoes content={data.reducoes} />
        <Cenarios content={data.cenarios} />
        <Impactos content={data.impactos} />
    </>
  );
}