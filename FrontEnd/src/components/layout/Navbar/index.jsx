import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import NavLinks from './NavLinks';
import HamburgerBtn from './HamburgerBtn';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import bloomberg from '@/assets/images/bloomberg-philanthropies.svg';
import prefeitura from '@/assets/images/prefeitura-de-sao-paulo.svg';
import Johns from '@/assets/images/Johns-Hopkins-University.svg';
import SPMaisVerde from '@/assets/images/sao-paulo-mais-verde.svg';


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth() || {}; 
    const API = "http://10.80.14.29:3001";

    return (
        <nav className="flex flex-col">
            <section className="fixed top-0 left-0 w-full h-auto z-[500]">
                <div className="relative z-20 bg-[var(--green-800)] h-full w-full shadow-lg">
                    <div className="w-full mx-auto px-10 py-8 h-full flex items-center justify-between">
                        <div className="flex items-center w-full lg:w-auto">
                            <HamburgerBtn isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
                            <BrandLogo />
                        </div>
                        <div className="hidden lg:flex items-center gap-8">
                            <NavLinks />
                            {user && (
                                <div className="relative">
                                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none transition-transform hover:scale-105" title="Menu do Usuário">
                                        <img src={user.avatar ? `${API}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.nome}`} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer shadow-sm"/>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fade-in">
                                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                                <p className="text-xs text-gray-500">Logado como</p>
                                                <p className="text-sm font-bold text-[#0A290F] truncate">{user.nome}</p>
                                            </div>
                                            <button onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    if (logout) logout();
                                                }}  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium">
                                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                                Sair da conta
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu Mobile */}
                <div className={`absolute top-0 left-0 w-full bg-green-900 transition-transform duration-300 ease-in-out lg:hidden z-10 pt-24 pb-10 shadow-xl ${isOpen ? 'translate-y-0' : '-translate-y-full'} shadow-[0px_1px_20px_2px_green-900]`}>
                    <div className="w-full px-8">
                        <NavLinks mobile closeMenu={() => setIsOpen(false)} />
                    </div>
                </div>
            </section>
            <section className="w-full mt-32 py-12 lg:h-[4.3rem] bg-[var(--green-450)] !flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-40">
                <img className='w-50' src={bloomberg} alt="Logo da Bloomberg Philanthropies" />
                <img className='w-60' src={Johns} alt="Logo da Johns Hopkins - University" />
                <img className='w-50' src={prefeitura} alt="Logo da Prefeitura de São Paulo - Governo" />
            </section>
            <section className='absolute left-0 w-full h-20 !flex justify-center lg:justify-end items-start flex-row flex-nowrap pt-4 lg:-left-8 z-50'>
                <img src={SPMaisVerde} alt="" />
            </section>
        </nav>
    );
}