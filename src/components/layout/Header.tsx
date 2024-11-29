import React from 'react';
import {Navbar} from 'flowbite-react';

interface LogoItemProps {
    src: string;
    alt: string;
    tooltip: string;
}

const LogoItem: React.FC<LogoItemProps> = ({src, alt, tooltip}) => (
    <div className="relative flex items-center">
        <img
            src={src}
            alt={alt}
            className="h-8 md:h-10 w-auto hover:opacity-80 transition-opacity cursor-pointer"
        />
    </div>
);

export const Header: React.FC = () => {
    const logos = [
        {
            src: "/images/unipd.png",
            alt: "University of Padua logo",
            tooltip: "University of Padua"
        },
        {
            src: "/images/dei.png",
            alt: "DEI logo",
            tooltip: "Department of Information Engineering"
        },
        {
            src: "/images/iiiahub.png",
            alt: "IIIAHub logo",
            tooltip: "Intelligent Interactive Information Access Hub"
        }
    ];

    return (
        <Navbar
            className="bg-white border-b shadow-sm py-4"
            fluid
        >
            <div className="container mx-auto">
                <div className="w-full flex flex-wrap justify-center items-center gap-6 md:gap-10">
                    {logos.map((logo, index) => (
                        <LogoItem
                            key={index}
                            src={logo.src}
                            alt={logo.alt}
                            tooltip={logo.tooltip}
                        />
                    ))}
                </div>
            </div>
        </Navbar>
    );
};

export default Header;