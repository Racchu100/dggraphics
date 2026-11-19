'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Factory,
  Users,
  Package,
  Layers,
  Calculator,
  Receipt,
  TrendingDown,
  BarChart3,
  Settings,
  Menu,
  X,
  PlusCircle,
  Bell,
  Search,
  Clock,
  Printer,
  UserCheck,
  Truck,
  Boxes,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile slideover
  const [isSidebarHovered, setIsSidebarHovered] = useState(false); // Desktop hover-expand mode
  const [menuFilter, setMenuFilter] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  // On desktop, the sidebar expands when hovered; on mobile, when sidebarOpen is true
  const isExpanded = sidebarOpen || isSidebarHovered;

  // Navigation Groups aligned with AdminLTE 4
  const navGroups: NavGroup[] = [
    {
      title: 'MAIN WORKFLOW',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: 'ERP', badgeColor: 'bg-blue-600' },
        { name: 'Offline Orders', href: '/admin/orders', icon: ShoppingCart, badge: 'POS', badgeColor: 'bg-emerald-600' },
        { name: 'Track Job Status', href: '/admin/track', icon: Clock, badge: 'Live', badgeColor: 'bg-amber-600' },
        { name: 'Production Mgmt', href: '/admin/production', icon: Factory },
      ],
    },
    {
      title: 'STUDIO OPERATIONS',
      items: [
        { name: 'Employee Attendance', href: '/admin/attendance', icon: UserCheck, badge: 'HR', badgeColor: 'bg-purple-600' },
        { name: 'Customers CRM', href: '/admin/customers', icon: Users },
        { name: 'Outsourcing Vendors', href: '/admin/vendors', icon: Truck },
        { name: 'Material Inventory', href: '/admin/inventory', icon: Boxes },
      ],
    },
    {
      title: 'CATALOG & PRICING',
      items: [
        { name: 'Products & Rates', href: '/admin/products', icon: Package },
        { name: 'Categories', href: '/admin/categories', icon: Layers },
        { name: 'Pricing Engine', href: '/admin/pricing', icon: Calculator },
      ],
    },
    {
      title: 'FINANCE & AUDIT',
      items: [
        { name: 'Billing & Invoices', href: '/admin/billing', icon: Receipt },
        { name: 'Expenses & Costs', href: '/admin/expenses', icon: TrendingDown },
        { name: 'Reports & P&L', href: '/admin/reports', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Studio Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  // Route metadata for breadcrumb header
  const routeMeta: Record<string, { title: string; subtitle: string; section: string }> = {
    '/admin': {
      title: 'Executive Business Dashboard',
      subtitle: 'Real-time studio revenue, production workload and profit performance',
      section: 'Main Workflow',
    },
    '/admin/orders': {
      title: 'Offline Counter Orders (POS)',
      subtitle: 'Walk-in customer orders, spot billing and counter production tokens',
      section: 'Main Workflow',
    },
    '/admin/track': {
      title: 'Live Stage Tracker & Production Pipeline',
      subtitle: 'Real-time 8-stage production pipeline monitoring and client dispatch',
      section: 'Main Workflow',
    },
    '/admin/production': {
      title: 'Production & Outsourced Work Orders',
      subtitle: 'In-house printer queues and vendor outsourced job dispatches',
      section: 'Main Workflow',
    },
    '/admin/attendance': {
      title: 'Employee Attendance & Wage Ledger',
      subtitle: 'Permanent salary, temporary daily wages, and monthly payout tracker',
      section: 'Studio Operations',
    },
    '/admin/customers': {
      title: 'Customer Directory & Accounts CRM',
      subtitle: 'Client accounts, order history, phone directory and ledger balances',
      section: 'Studio Operations',
    },
    '/admin/vendors': {
      title: 'Outsourcing Vendors & Suppliers',
      subtitle: 'Third-party printing partners, raw material suppliers and payable dues',
      section: 'Studio Operations',
    },
    '/admin/inventory': {
      title: 'Raw Stock & Materials Inventory',
      subtitle: 'Flex rolls, vinyl stock, mug blanks, inks and minimum stock alerts',
      section: 'Studio Operations',
    },
    '/admin/products': {
      title: 'Product Catalog & Rate Cards',
      subtitle: 'Studio print products, square-feet base rates and turnaround times',
      section: 'Catalog & Rates',
    },
    '/admin/categories': {
      title: 'Product Categories & Departments',
      subtitle: 'Catalog departments, signage, gifts and business stationery categories',
      section: 'Catalog & Rates',
    },
    '/admin/pricing': {
      title: 'Studio Pricing & Estimation Engine',
      subtitle: 'Interactive rate calculator for square feet and custom job estimates',
      section: 'Catalog & Rates',
    },
    '/admin/billing': {
      title: 'Billing, Tax Invoices & Receipts',
      subtitle: 'GST tax invoices, 3-inch thermal receipts and balance payment collection',
      section: 'Finance & Audit',
    },
    '/admin/expenses': {
      title: 'Business Expenses & Vendor Purchases',
      subtitle: 'Operational overheads, vendor materials, rent, utilities and labour ledger',
      section: 'Finance & Audit',
    },
    '/admin/reports': {
      title: 'Financial Statements & P&L Reports',
      subtitle: 'Gross revenue, direct production costs, net profit margins and monthly audit',
      section: 'Finance & Audit',
    },
    '/admin/settings': {
      title: 'Studio Configuration & OS Settings',
      subtitle: 'Studio GST details, POS invoice templates, printer configuration and backup',
      section: 'System',
    },
  };

  const currentMeta = routeMeta[pathname] || {
    title: 'DG graphics Studio OS',
    subtitle: 'Professional Commercial Printing ERP & Management Suite',
    section: 'Admin Portal',
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col lg:flex-row antialiased font-sans">
      {/* ========================================================================= */}
      {/* MOBILE HEADER BAR */}
      {/* ========================================================================= */}
      <div className="lg:hidden bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-xs">
              DG
            </div>
            <span className="font-extrabold tracking-tight text-sm">
              DG <span className="text-blue-500">graphics</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders?action=new"
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Walk-in</span>
          </Link>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Desktop Spacer Rail to preserve layout flow while sidebar hover-expands as an overlay */}
      <div className="hidden lg:block w-[68px] shrink-0" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* ADMINLTE 4 SIDEBAR (DESKTOP HOVER-EXPANDING MINI RAIL + MOBILE SLIDEOVER) */}
      {/* ========================================================================= */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => {
          setIsSidebarHovered(false);
          setMenuFilter('');
        }}
        className={`fixed inset-y-0 left-0 z-50 bg-[#1e293b] text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-slate-800/80 ${
          sidebarOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        } ${
          isExpanded
            ? 'lg:w-64 lg:shadow-2xl'
            : 'lg:w-[68px] lg:shadow-sm'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className={`p-4 border-b border-slate-800 flex items-center ${!isExpanded ? 'justify-center' : 'justify-between'}`}>
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-xs shrink-0">
                DG
              </div>
              {isExpanded && (
                <div className="min-w-0 transition-opacity duration-200">
                  <span className="font-bold text-sm text-white block leading-tight tracking-tight truncate">
                    DG graphics
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">
                    AdminLTE 4 OS
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Menu Filter (AdminLTE 4 Filter Menu) */}
          {isExpanded && (
            <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={menuFilter}
                  onChange={(e) => setMenuFilter(e.target.value)}
                  placeholder="Filter menu..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-800/90 text-slate-200 placeholder-slate-400 border border-slate-700/80 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
                {menuFilter && (
                  <button
                    onClick={() => setMenuFilter('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links Scrollable List */}
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {navGroups.map((group) => {
              const filteredItems = group.items.filter((item) =>
                item.name.toLowerCase().includes(menuFilter.toLowerCase())
              );
              if (filteredItems.length === 0) return null;

              return (
                <div key={group.title} className="space-y-1">
                  {isExpanded && (
                    <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {group.title}
                    </div>
                  )}

                  {filteredItems.map((item) => {
                    const isActive =
                      item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        title={!isExpanded ? item.name : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition group ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-normal'
                        } ${!isExpanded ? 'justify-center px-0' : ''}`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        {isExpanded && (
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider text-white ${
                                  item.badgeColor || 'bg-slate-700'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Bottom Counter Terminal Status */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60">
            <div
              className={`flex items-center gap-2 px-2.5 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-300 text-xs ${
                !isExpanded ? 'justify-center px-1' : ''
              }`}
              title={!isExpanded ? 'POS Terminal #1 (Indiranagar • Offline)' : undefined}
            >
              <Printer className="w-4 h-4 text-blue-400 shrink-0" />
              {isExpanded && (
                <div className="min-w-0">
                  <div className="font-semibold text-white text-[11px] truncate flex items-center gap-1.5">
                    <span>POS Terminal #1</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Indiranagar • Offline</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar (AdminLTE 4 Navbar) */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 hidden lg:flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Quick Nav Links, Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Quick Nav Links */}
            <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
              <Link href="/admin" className="hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link href="/admin/orders" className="hover:text-blue-600 transition">
                Walk-in POS
              </Link>
              <Link href="/admin/track" className="hover:text-blue-600 transition">
                Job Tracker
              </Link>
              <Link href="/admin/attendance" className="hover:text-blue-600 transition">
                Attendance
              </Link>
              <Link href="/admin/billing" className="hover:text-blue-600 transition">
                Invoices
              </Link>
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 max-w-sm ml-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search jobs, customers, invoices..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickSearch.trim()) {
                    window.location.href = `/admin/orders?search=${encodeURIComponent(quickSearch.trim())}`;
                  }
                }}
                className="w-full pl-8 pr-12 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 transition"
              />
              <span className="absolute right-2.5 top-1.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-mono text-[9px] font-bold">
                ↵
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons, Notifications, User Pill */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/orders?action=new"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Walk-in Order</span>
            </Link>

            <Link
              href="/admin/billing?action=new"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-medium transition"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              <span>Create Invoice</span>
            </Link>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Operator Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-md bg-slate-700 text-white text-xs font-semibold flex items-center justify-center">
                DG
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-medium text-slate-800 block leading-tight">
                  Studio Admin
                </span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Counter Live
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Header (AdminLTE 4 Standard) */}
        <div className="px-4 sm:px-6 pt-4 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h1 className="text-xl sm:text-2xl font-normal text-slate-800">
            {currentMeta.title}
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/admin" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">{currentMeta.section}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">
              {currentMeta.title}
            </span>
          </nav>
        </div>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 min-w-0 max-w-full">
          {children}
        </main>

        {/* Sticky App Footer (AdminLTE 4 Footer) */}
        <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div>
            <strong>Copyright © 2014-2026 <span className="text-slate-900 font-bold">DG graphics</span>.</strong> All rights reserved. Commercial Printing & Studio ERP.
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>AdminLTE v4 Pro Architecture</span>
            <span>•</span>
            <span className="font-mono font-bold text-slate-600">v4.2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
