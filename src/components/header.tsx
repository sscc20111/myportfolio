import { useEffect } from "react";
import { NavLink } from "react-router-dom";


const Header = ({locationFunc}: {locationFunc: (size: string) => void}) => {

    return(
        <header className='header absolute top-0 left-0 w-full p-4 z-50'>
            <nav>
                <ul className="flex">
                    <li><NavLink to="/" onClick={() => locationFunc('main')} className={({ isActive }) => isActive ? "pointer-events-none active" : ""}>Main</NavLink></li>
                    <li><NavLink to="/about" onClick={() => locationFunc('about')} className={({ isActive }) => isActive ? "pointer-events-none active" : ""}>About</NavLink></li>
                    <li><NavLink to="/project" onClick={() => locationFunc('project')} className={({ isActive }) => isActive ? "pointer-events-none active" : ""}>Projects</NavLink></li>
                    <li><NavLink to="/guestbook" onClick={() => locationFunc('guestbook')} className={({ isActive }) => isActive ? "pointer-events-none active" : ""}>Guestbook</NavLink></li>
                    <li><NavLink to="/contact" onClick={() => locationFunc('contact')} className={({ isActive }) => isActive ? "pointer-events-none active" : ""}>Contact</NavLink></li>
                    <li><NavLink to="/making" onClick={() => locationFunc('making')} className={({ isActive }) => isActive ? "pointer-events-none active" : ""}>Making</NavLink></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;