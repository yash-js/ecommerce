import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
];

export const FooterSocial = () => {
  return (
    <div className="w-full md:w-1/3">
      <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
      <div className="flex gap-4">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#febe03] hover:text-white transition-all duration-300"
              aria-label={link.name}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
};