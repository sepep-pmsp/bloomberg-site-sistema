import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import NavLinks from './NavLinks';
import HamburgerBtn from './HamburgerBtn';
import { useAuth } from '../../../modules/auth/hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth() || {}; 
  const API = "http://10.80.14.29:3001";

  return (
    <nav className="fixed w-full h-20 z-500">
      <div className="relative z-20 bg-[var(--green-800)] h-full w-full shadow-lg">
        <div className="w-full mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center w-full lg:w-auto">
              <HamburgerBtn isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
              <BrandLogo />
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <NavLinks />
              {user && (
                <img 
                  src={user.avatar ? `${API}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.nome}`} 
                  alt="Perfil" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              )}
            </div>
        </div>
      </div>
      <div className={`absolute top-0 left-0 w-full bg-green-900 transition-transform duration-300 ease-in-out lg:hidden z-10 pt-24 pb-10 shadow-xl ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="w-full px-8">
            <NavLinks mobile closeMenu={() => setIsOpen(false)} />
        </div>
      </div>
    </nav>
  );
}