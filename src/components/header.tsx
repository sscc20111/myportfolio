import { NavLink } from "react-router-dom";


const Header = () => {
    

    return(
        <header className='header absolute top-0 left-0 w-full p-4 z-50'>
            <nav>
                <ul className="flex">
                    <li><NavLink to="/">Main</NavLink></li>
                    <li><NavLink to="/sub1">Sub1</NavLink></li>
                    <li><NavLink to="/sub2">Sub2</NavLink></li>
                    <li><NavLink to="/sub3">Sub3</NavLink></li>
                    <li><NavLink to="/sub4">Sub4</NavLink></li>
                    <li><NavLink to="/sub5">Sub5</NavLink></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;