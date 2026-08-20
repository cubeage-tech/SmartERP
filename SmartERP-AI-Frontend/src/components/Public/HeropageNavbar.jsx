import { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Modules', href: '#modules' },
  { label: 'AI', href: '#ai' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
];

const HeropageNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[#1a1a1a] px-[70px] pt-4">
      <nav
        className="max-w-[1600px] mx-auto bg-[#f0ede6] rounded-[30px] rounded-b-none px-10 py-4 flex items-center justify-between"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
  to="/"
  className="flex items-center gap-3 shrink-0"
  aria-label="SmartERP home"
>
  {/* Logo Icon */}
  <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#11130f]">
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#9BAF8A" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="#555A52" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="#555A52" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="#718268" />
    </svg>
  </span>

  {/* Brand Name */}
  <span className="font-serif text-[19px] font-normal tracking-[-0.01em] text-[#171815]">
    SmartERP
    <span className="ml-0.5 font-mono text-[14px] tracking-[0.02em] text-[#9BAF8A]">
      AI
    </span>
  </span>
</Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-9" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[#444] text-mono font-normal hover:text-[#1a1a1a] transition-colors duration-150"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-[#444] text-mono font-normal hover:text-[#1a1a1a] transition-colors duration-150"
          >
            Sign In
          </Link>
          <Link
            to="/request-demo"
            className="bg-[#1a1a1a] text-white text-mono font-medium px-2 py-2 rounded-xl hover:bg-[#333] transition-colors duration-150 whitespace-nowrap"
          >
            Request Demo →
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-5 h-0.5 bg-[#1a1a1a] transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#1a1a1a] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#1a1a1a] transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-w-7xl mx-auto bg-[#f5f4f0] rounded-2xl mt-2 px-6 py-4 flex flex-col gap-4 md:hidden"
        >
          <ul className="flex flex-col gap-3" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[#444] text-sm font-normal hover:text-[#1a1a1a] transition-colors duration-150"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-2 border-t border-[#e0e0d8]">
            <Link
              to="/login"
              className="text-[#444] text-sm font-normal hover:text-[#1a1a1a] transition-colors duration-150"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/request-demo"
              className="bg-[#1a1a1a] text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-[#333] transition-colors duration-150 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Request Demo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeropageNavbar;
