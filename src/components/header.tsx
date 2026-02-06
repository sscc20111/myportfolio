import { NavLink } from "react-router-dom";


const Header = ({location}: {location: () => void}) => {
    

    return(
        <header className='header absolute top-0 left-0 w-full p-4 z-50'>
            <nav>
                <ul className="flex">
                    <li><NavLink to="/" onClick={location}>Main</NavLink></li>
                    <li><NavLink to="/sub1" onClick={location}>Sub1</NavLink></li>
                    <li><NavLink to="/sub2" onClick={location}>Sub2</NavLink></li>
                    <li><NavLink to="/sub3" onClick={location}>Sub3</NavLink></li>
                    <li><NavLink to="/sub4" onClick={location}>Sub4</NavLink></li>
                    <li><NavLink to="/sub5" onClick={location}>Sub5</NavLink></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;