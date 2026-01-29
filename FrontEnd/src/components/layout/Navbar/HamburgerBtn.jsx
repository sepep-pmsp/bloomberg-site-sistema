import React from 'react';

export default function HamburgerBtn({ isOpen, toggle }) {
  const barBase = "absolute left-0 w-8 h-1 bg-white rounded transition-all duration-300 ease-in-out";
  const styles = {
    top: isOpen ? { transform: 'translate(0, 0.75rem) rotate(270deg) scaleX(0.35) scaleY(1.75)', transformOrigin: 'bottom right' } : { top: '0' },
    mid: isOpen ? { transform: 'translate(0, 0) rotate(-270deg) scaleX(0.35) scaleY(1.75)', transformOrigin: '50% 50%' } : { top: '0.75rem' },
    bot: isOpen ? { transform: 'translate(0, -0.75rem) rotate(270deg) scaleX(0.35) scaleY(1.75)', transformOrigin: 'top left' } : { top: '1.5rem' }
  };

  return (
    <button onClick={toggle} className="relative w-8 h-8 focus:outline-none z-50 lg:hidden mr-4 ">
      <div className="relative w-8 h-8 pt-4">
        <span className={barBase} style={styles.top}></span>
        <span className={barBase} style={styles.mid}></span>
        <span className={barBase} style={styles.bot}></span>
      </div>
    </button>
  );
}