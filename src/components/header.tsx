import { NavLink } from "react-router-dom";


const Header = ({location}: {location: (size: string) => void}) => {
    

    return(
        <header className='header absolute top-0 left-0 w-full p-4 z-50'>
            <nav>
                <ul className="flex">
                    <li><NavLink to="/" onClick={() => location('main')}>Main</NavLink></li>
                    <li><NavLink to="/about" onClick={() => location('about')}>About</NavLink></li>
                    <li><NavLink to="/project" onClick={() => location('project')}>Projects</NavLink></li>
                    <li><NavLink to="/guestbook" onClick={() => location('guestbook')}>Guestbook</NavLink></li>
                    <li><NavLink to="/contact" onClick={() => location('contact')}>Contact</NavLink></li>
                    <li><NavLink to="/making" onClick={() => location('making')}>Making</NavLink></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;