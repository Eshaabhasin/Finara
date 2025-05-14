import React, { useState } from 'react';
import { Link } from "react-router-dom";

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="backdrop-blur-sm bg-zinc-800/40 w-[97vw] ml-2 rounded-[1.3vw] fixed top-5 text-white z-[99]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
                
                    <Link to='/'><span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Finara</span></Link>
                </a>
                <button 
                    onClick={toggleMenu}
                    type="button" 
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-smrounded-lg md:hidden focus:outline-none"
                    aria-controls="navbar-default" 
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-semibold lg:text-sm text-2xl flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 tracking-[2px] md:border-0 dark:bg-gray-80">
                        <li>
                            <Link to='/'><span className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0 dark:text-white md:hover:text-gray-200" aria-current="page">Home</span></Link>
                        </li>
                        <li>
                            <Link to='/Spendly'><span className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0">Spendly</span></Link>
                        </li>
                        <li>
                            <Link to='/Investimate'><span className="block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-200 md:p-0">InvestiMate</span></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;