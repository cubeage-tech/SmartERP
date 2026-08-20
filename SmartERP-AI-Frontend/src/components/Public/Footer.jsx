import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Platform', href: '#' },
      { label: 'CRM', href: '#' },
      { label: 'Sales', href: '#' },
      { label: 'Purchase', href: '#' },
      { label: 'Inventory', href: '#' },
      { label: 'Manufacturing', href: '#' },
      { label: 'Finance', href: '#' },
      { label: 'HR & Payroll', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Documents', href: '#' },
    ],
  },
  {
    heading: 'AI Capabilities',
    links: [
      { label: 'Business Assistant', href: '#' },
      { label: 'Forecasting', href: '#' },
      { label: 'Automation', href: '#' },
      { label: 'Document AI', href: '#' },
      { label: 'Fraud Detection', href: '#' },
      { label: 'Analytics', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Resources', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Compliance', href: '#' },
    ],
  },
];

const SOCIALS = [
  {
    label: 'LinkedIn',
    abbr: 'LI',
    href: '#',
  },
  {
    label: 'Twitter',
    abbr: 'TW',
    href: '#',
  },
  {
    label: 'YouTube',
    abbr: 'YT',
    href: '#',
  },
  {
    label: 'GitHub',
    abbr: 'GH',
    href: '#',
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#141414] text-[#888] border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 w-fit" aria-label="SmartERP home">
              <span className="w-9 h-9 bg-[#2a2a2a] border border-[#333] rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="#888" />
                  <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" fill="#888" />
                  <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" fill="#888" />
                  <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" fill="#888" />
                </svg>
              </span>
              <span className="text-[#ccc] font-semibold text-base tracking-tight">
                SmartERP
                <span className="text-[9px] font-normal text-[#666] ml-0.5 align-super">AI</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-[#555] text-[11px] font-medium tracking-widest uppercase leading-relaxed">
              Intelligent ERP for modern<br />businesses. One platform. Every<br />function.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2" role="list" aria-label="Social media links">
              {SOCIALS.map((s) => (
                <a
                  key={s.abbr}
                  href={s.href}
                  role="listitem"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-[#555] text-[10px] font-bold tracking-wide hover:border-[#444] hover:text-[#888] transition-colors duration-150"
                >
                  {s.abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h3 className="text-[#444] text-[10px] font-semibold tracking-widest uppercase">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#666] text-sm hover:text-[#aaa] transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#3a3a3a] text-[10px] tracking-widest uppercase">
            © 2026 SmartERP AI. All rights reserved.
          </p>
          <p className="text-[#2e2e2e] text-[10px] tracking-widest uppercase hidden sm:block">
            Built with AI · Powered by Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
