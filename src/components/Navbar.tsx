import React from 'react';
import { NavLink } from 'react-router-dom';
import { Feather } from 'lucide-react';
import { useScrollTop } from '../hooks/useScrollTop';

const Navbar = () => {
  const scrollToTop = useScrollTop();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#8B4513] text-[#FDF5E6] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center space-x-3 text-2xl font-serif" onClick={scrollToTop}>
          <Feather className="h-6 w-6 transform transition-transform duration-700 hover:rotate-12" />
          <span>Luigi Boccilli</span>
          <span className="text-sm text-[#DEB887] mt-1">Poeta Romanesco</span>
        </NavLink>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#654321] transition-colors duration-300"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current mb-1.5"></div>
            <div className="w-6 h-0.5 bg-current"></div>
          </button>
          
          <div className="hidden md:flex space-x-6 font-serif text-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-[#DEB887] transition-all duration-700 hover:scale-110 ${isActive ? 'text-[#DEB887]' : ''}`
              }
              onClick={scrollToTop}
            >
              Home
            </NavLink>
            <NavLink
              to="/autore"
              className={({ isActive }) =>
                `hover:text-[#DEB887] transition-all duration-700 hover:scale-110 ${isActive ? 'text-[#DEB887]' : ''}`
              }
              onClick={scrollToTop}
            >
              Autore
            </NavLink>
            <NavLink
              to="/opere"
              className={({ isActive }) =>
                `hover:text-[#DEB887] transition-all duration-700 hover:scale-110 ${isActive ? 'text-[#DEB887]' : ''}`
              }
              onClick={scrollToTop}
            >
              Opere
            </NavLink>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-4 space-y-4 font-serif text-lg`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block hover:text-[#DEB887] transition-all duration-700 ${isActive ? 'text-[#DEB887]' : ''}`
            }
            onClick={() => {
              setIsMenuOpen(false);
              scrollToTop();
            }}
          >
            Home
          </NavLink>
          <NavLink
            to="/autore"
            className={({ isActive }) =>
              `block hover:text-[#DEB887] transition-all duration-700 ${isActive ? 'text-[#DEB887]' : ''}`
            }
            onClick={() => {
              setIsMenuOpen(false);
              scrollToTop();
            }}
          >
            Autore
          </NavLink>
          <NavLink
            to="/opere"
            className={({ isActive }) =>
              `block hover:text-[#DEB887] transition-all duration-700 ${isActive ? 'text-[#DEB887]' : ''}`
            }
            onClick={() => {
              setIsMenuOpen(false);
              scrollToTop();
            }}
          >
            Opere
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
export default Navbar