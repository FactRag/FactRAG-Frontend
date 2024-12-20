import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Button } from 'flowbite-react';
import { Users, Home } from 'lucide-react';

interface LogoItemProps {
  src: string;
  alt: string;
  tooltip: string;
  href?: string;
}

const LogoItem: React.FC<LogoItemProps> = ({ src, alt, tooltip, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative flex items-center group"
    title={tooltip}
  >
    <img
      src={src}
      alt={alt}
      className="h-8 md:h-10 w-auto transition-opacity duration-200 group-hover:opacity-80"
    />
  </a>
);

export const Header: React.FC = () => {
  const location = useLocation();
  const isCreditsPage = location.pathname === '/credits';

  const logos = [
    {
      src: '/images/unipd.png',
      alt: 'University of Padua logo',
      tooltip: 'University of Padua',
      href: 'https://www.unipd.it'
    },
    {
      src: '/images/dei.png',
      alt: 'DEI logo',
      tooltip: 'Department of Information Engineering',
      href: 'https://www.dei.unipd.it'
    },
    {
      src: '/images/iiiahub.png',
      alt: 'IIIAHub logo',
      tooltip: 'Intelligent Interactive Information Access Hub',
      href: 'https://iiiahub.dei.unipd.it'
    }
  ];

  const NavigationButton = () => {
    if (isCreditsPage) {
      return (
        <Link to="/" data-testid="home-link">
          <Button color="light" size="sm" className="flex items-center gap-2">
            <Home className="w-4 h-4 mr-2" />
            Main Page
          </Button>
        </Link>
      );
    }
    return (
      <Link to="/credits" data-testid="credits-link">
        <Button color="light" size="sm" className="flex items-center gap-4">
          <Users className="w-4 h-4 mr-2" />
          Our Team
        </Button>
      </Link>
    );
  };

  return (
    <Navbar className="bg-white border-b shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="w-full flex justify-between items-center">
          {/* Logos Section */}
          <div className="flex items-center gap-6 md:gap-10">
            {logos.map((logo, index) => (
              <LogoItem
                key={index}
                src={logo.src}
                alt={logo.alt}
                tooltip={logo.tooltip}
                href={logo.href}
              />
            ))}
          </div>

          {/* Dynamic Navigation Button */}
          <div className="flex items-center gap-4">
            <NavigationButton />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;