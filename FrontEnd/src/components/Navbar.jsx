import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const baseTabClasses =
    "flex justify-center items-center h-20 w-32 cursor-pointer rounded-b-md transition-all duration-300 ease-in-out font-medium px-4 lg:w-2xs text-base md:text-lg";

  const activeClasses =
    "bg-(--color-primary) text-(--accent-mint) shadow-md h-25";

  const inactiveClasses =
    "bg-(--green-400) hover:bg-(--green-450) hover:text-(--accent-mint) hover:h-25";

  return (
    <div className="bg-green-900 fixed top-0 left-0 w-full h-16 shadow-lg z-50">
      <ul className="flex gap-4 justify-center h-full items-start">
        <li>
          <NavLink
            to="/metodologia"
            className={({ isActive }) => `${baseTabClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            Metodologia
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dados"
            className={({ isActive }) =>`${baseTabClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            Dados
          </NavLink>
        </li>
      </ul>
    </div>
  );
}