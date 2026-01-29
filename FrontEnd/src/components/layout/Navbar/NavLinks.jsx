import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavLinks({ mobile, closeMenu }) {
  const links = [
    { name: 'metodologia', path: '/metodologia' },
    { name: 'dados', path: '/dados' },
    { name: 'simulação', path: '/simulacao' },
  ];

  return (
    <ul className={`flex ${mobile ? 'flex-col pt-8 gap-6 items-start w-full' : 'flex-row gap-8 items-center'}`}>
      {links.map((link) => (
        <li key={link.name} className="w-full lg:w-auto">
          <NavLink 
            to={link.path}
            onClick={mobile ? closeMenu : undefined}
            className={({ isActive }) => 
              `capitalize font-bold tracking-wide nav-hover-effect !text-2xl
               ${mobile ? '!text-base py-2 block w-full' : '!text-2xl'}
               ${isActive ? 'active-link' : ''}`}>
            {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}