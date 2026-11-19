import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Truck, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dp-navyDark text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-800/80 rounded-xl text-dp-orange">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Studio-Grade Precision</h4>
              <p className="text-slate-400 text-sm mt-1">
                Calibrated UV solvent plotters, DTF heat press, and premium paper stocks for sharp color reproduction.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-800/80 rounded-xl text-dp-orange">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Pay Offline After Print</h4>
              <p className="text-slate-400 text-sm mt-1">
                Zero advance online gatekeeping. Place your custom order online and pay via Cash or UPI at our shop counter.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-800/80 rounded-xl text-dp-orange">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Express Turnaround</h4>
              <p className="text-slate-400 text-sm mt-1">
                Same-day flex banners and 24-48 hour turnaround on customized merchandise with doorstep dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-dp-orange flex items-center justify-center text-white font-extrabold text-lg">
                DG
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                DG <span className="text-dp-orange">graphics</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your trusted partner for commercial large-format flex printing, customized corporate merchandise, apparel, promotional stickers, and high-impact graphic design.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-slate-800/70 border border-slate-700 px-3.5 py-2 rounded-lg text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Production Facility Open Today &bull; 9:30 AM – 8:30 PM</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore Studio
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">Product Catalog</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">Commercial Services</Link>
              </li>
              <li>
                <Link href="/track" className="text-amber-300 hover:text-amber-200 font-medium transition">
                  Track Job Status
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Request Custom Quote</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About DG Graphics</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Categories */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Popular Print Work
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/shop?category=photo-gifts" className="hover:text-white transition">Personalized Mugs</Link>
              </li>
              <li>
                <Link href="/shop?category=large-format" className="hover:text-white transition">Frontlit & Star Flex Banners</Link>
              </li>
              <li>
                <Link href="/shop?category=apparel-printing" className="hover:text-white transition">Cotton T-Shirt Printing</Link>
              </li>
              <li>
                <Link href="/shop?category=stickers-labels" className="hover:text-white transition">Die-Cut Vinyl Stickers</Link>
              </li>
              <li>
                <Link href="/shop?category=business-stationery" className="hover:text-white transition">Matte Visiting Cards</Link>
              </li>
              <li>
                <Link href="/shop?category=graphic-design" className="hover:text-white transition">Logo & Brand Identity</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Visit Shop */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact & Visit Us
            </h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dp-orange mt-0.5 shrink-0" />
                <span>No. 42, Commercial Print Street, Indiranagar, Bengaluru - 560038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dp-orange shrink-0" />
                <a href="tel:+919845012345" className="hover:text-white transition">+91 98450 12345</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/919845012345?text=Hello%20DP%20Graphics,%20I%20have%20a%20printing%20enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  WhatsApp: +91 98450 12345
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-dp-orange shrink-0" />
                <a href="mailto:contact@dpgraphics.com" className="hover:text-white transition">contact@dpgraphics.com</a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-500">Mon - Sat: 9:30 AM to 8:30 PM &bull; Sunday: On Appointment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} DG graphics. All rights reserved. Professional Printing & Graphic Design Management System.</p>
          <div className="flex items-center gap-4">
            <Link href="/track" className="hover:text-slate-300">Customer Job Tracking</Link>
            <span>&bull;</span>
            <Link href="/admin" className="text-slate-400 hover:text-slate-200">Staff & Management Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
