import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
} from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/about#team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  programs: [
    { name: 'Leadership Development', href: '/programs#leadership' },
    { name: 'Entrepreneurship', href: '/programs#entrepreneurship' },
    { name: 'Mentorship', href: '/programs#mentorship' },
    { name: 'Workshops', href: '/programs#workshops' },
  ],
  community: [
    { name: 'Events', href: '/events' },
    { name: 'Host a Course', href: '/#register' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Newsletter', href: '/join' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-950 to-purple-950 text-white">
      {/* Main Footer */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-2xl font-display">
                  G
                </span>
              </div>
              <span className="text-2xl font-bold font-display">GZURA</span>
            </Link>
            <p className="mt-6 text-white/70 leading-relaxed">
              Empowering men and women through leadership development,
              entrepreneurship training, and community building. Together, we
              build stronger leaders and successful entrepreneurs.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-purple-800/50 flex items-center justify-center hover:bg-gold-500 hover:text-purple-950 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 border-t border-purple-800/50 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="mailto:teamgzura@gmail.com"
              className="flex items-center gap-3 group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-800/50">
                <Mail className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <p className="text-sm text-white/50">Email Us</p>
                <p className="text-white transition-colors group-hover:text-gold-400">
                  teamgzura@gmail.com
                </p>
              </div>
            </a>
            <a
              href="tel:+916360685656"
              className="flex items-center gap-3 group sm:text-right"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-800/50 sm:order-2">
                <Phone className="h-5 w-5 text-gold-400" />
              </div>
              <div className="sm:order-1">
                <p className="text-sm text-white/50">Call Us</p>
                <p className="text-white transition-colors group-hover:text-gold-400">
                  +91 63606 85656
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-800/30">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} GZURA. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
