import { Link } from 'react-router-dom';

const links = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Returns', href: '/returns' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Track Order', href: '/track' },
  ],
};

export const FooterLinks = () => {
  return (
    <div className="w-full md:w-1/3 grid grid-cols-2 gap-8 mb-8 md:mb-0">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Company</h3>
        <ul className="space-y-2">
          {links.company.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="text-gray-300 hover:text-[#febe03] transition-colors duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
        <ul className="space-y-2">
          {links.support.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="text-gray-300 hover:text-[#febe03] transition-colors duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};