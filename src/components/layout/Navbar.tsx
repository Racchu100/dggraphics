'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/#categories' },
    { name: 'Our Services', href: '/services' },
    { name: 'Track Order', href: '/track' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-white border-b border-dp-border py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-dp-navy flex items-center justify-center text-white font-bold text-xl tracking-tight shadow-sm group-hover:bg-dp-orange transition">
                DG
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-dp-navy block leading-none">
                  DG <span className="text-dp-orange">graphics</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-dp-muted font-medium block mt-0.5">
                  Print & Creative Studio
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-dp-orange font-semibold bg-dp-orangeLight'
                        : 'text-dp-charcoal hover:text-dp-navy hover:bg-dp-softGrey'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-dp-charcoal hover:text-dp-orange hover:bg-dp-softGrey rounded-full transition"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center gap-2 bg-dp-softGrey hover:bg-slate-200 text-dp-navy px-3.5 py-2 rounded-lg font-semibold text-sm transition"
              >
                <ShoppingBag className="w-5 h-5 text-dp-navy" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="bg-dp-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Quick Quote Button */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center justify-center bg-dp-navy hover:bg-dp-navyLight text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
              >
                Get Custom Quote
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-dp-charcoal hover:text-dp-orange rounded-md"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Dropdown Bar */}
          {searchOpen && (
            <div className="mt-3 pt-3 border-t border-slate-100 animate-fadeIn">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customized mugs, flex banners, t-shirts, visiting cards, stickers..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-dp-border rounded-lg focus:outline-none focus:border-dp-navy"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="bg-dp-navy text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-dp-navyLight"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-dp-border px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-dp-charcoal hover:bg-dp-softGrey hover:text-dp-orange"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-amber-50 text-amber-900 border border-amber-200 py-2.5 rounded-lg text-sm font-semibold"
              >
                Track Order by Job Number
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-dp-orange text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-dp-orangeHover"
              >
                Get a Custom Quote
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
