// src/components/layout/Header.tsx
import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {Button, Navbar, Avatar, Dropdown} from 'flowbite-react';

export const Header = () => {
    const {isAuthenticated, user, logout} = useAuth();

    return (
        <header className="w-full py-6 bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                    <div className="flex items-center" data-tooltip-target="tooltip-unipd">
                        <img src="/images/unipd.png" alt="University of Padua logo" className="h-8 md:h-10 w-auto"/>
                        <div id="tooltip-unipd" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            University of Padua
                            <div className="tooltip-arrow" data-popper-arrow=""></div>
                        </div>
                    </div>

                    <div className="flex items-center" data-tooltip-target="tooltip-dei">
                        <img src="/images/dei.png" alt="DEI logo" className="h-8 md:h-10 w-auto"/>
                        <div id="tooltip-dei" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Department of Information Engineering
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>

                    <div className="flex items-center" data-tooltip-target="tooltip-iiiahub">
                        <img src="/images/iiiahub.png" alt="IIIAHub logo" className="h-8 md:h-10 w-auto"/>
                        <div id="tooltip-iiiahub" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Intelligent Interactive Information Access Hub
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};