import React, { useState } from 'react';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('/');
  const handleTabClick = (path) => {
    setActiveTab(path);
  };
  const baseTabClasses ="flex justify-center items-center h-20 w-32 cursor-pointer rounded-b-md transition-all duration-300 ease-in-out font-medium px-4 lg:w-2xs text-base md:text-lg lg:text-7xl";

  return (
    <div className='bg-green-900 fixed top-0 left-0 w-full h-16 shadow-lg z-50'>
      <ul className='flex space-x-4 gap-4 justify-center h-full items-start '>
        <li 
          onClick={() => handleTabClick('/metodologia')}
          className={`
            ${baseTabClasses}
            ${activeTab === '/metodologia' 
              ? 'bg-(--color-primary) text-(--accent-mint) shadow-md h-25'
              : 'bg-(--green-400) hover:bg-(--green-450) hover:text-(--accent-mint)  hover:h-25'
            }
          `}>
          <a href="#" onClick={(e) => e.preventDefault()}>Metodologia</a>
        </li>
        <li 
          onClick={() => handleTabClick('/dados')}
          className={`
            ${baseTabClasses}
            ${activeTab === '/dados' 
              ? 'bg-(--color-primary) text-(--accent-mint) shadow-md h-25'
              : 'bg-(--green-400) hover:bg-(--green-450) hover:text-(--accent-mint)  hover:h-25'
            }
          `}>
          <a href="#" onClick={(e) => e.preventDefault()}>Dados</a>
        </li>
      </ul>
    </div>
  )
}