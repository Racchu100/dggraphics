'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { ShieldAlert, PlusCircle, UserCheck, Mail, Phone, CheckCircle2, X } from 'lucide-react';

export default function AdminStaffPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [phone, setPhone] = useState('');

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/settings');
      // For now we get users or settings
      setUsers([
        {
          id: 'user-1',
          name: 'D.P. Murthy',
          email: 'owner@dpgraphics.com',
          role: 'owner',
          phone: '+91 98450 12345',
          isActive: true,
          createdAt: '2026-01-01',
        },
        {
          id: 'user-2',
          name: 'Ravi Kumar',
          email: 'ravi@dpgraphics.com',
          role: 'manager',
          phone: '+91 98450 98765',
          isActive: true,
          createdAt: '2026-03-01',
        },
        {
          id: 'user-3',
          name: 'Kumar Swamy',
          email: 'kumar@dpgraphics.com',
          role: 'production',
          phone: '+91 98801 98765',
          isActive: true,
          createdAt: '2026-04-01',
        },
        {
          id: 'user-4',
          name: 'Anil Accounts Lead',
          email: 'accounts@dpgraphics.com',
          role: 'accounts',
          phone: '+91 97401 12345',
          isActive: true,
          createdAt: '2026-05-01',
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      phone: phone.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const rolePermissions: Record<UserRole, string[]> = {
    owner: ['Full Platform Control', 'All P&L & Audits', 'Pricing Management', 'Staff Access Rights', 'Database Operations'],
    admin: ['Order Processing', 'Billing & Invoices', 'Expense Logging', 'Production Scheduling', 'Vendor Outsourcing'],
    manager: ['Order Processing', 'Production Tasks', 'Customer Profiles', 'Vendor Work Orders'],
    designer: ['Design Previews Upload', 'Approval Tracking', 'Artwork Pre-flight Inspection'],
    production: ['Shop Floor Tasks', 'Job Cards Printing', 'Material Consumption Logging'],
    accounts: ['Customer Invoices', 'Offline Payment Collection', 'Expense Audits', 'P&L Reports'],
    staff: ['General View Access'],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dp-navy tracking-tight">
            Staff & Role-Based Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure access control for owners, studio managers, graphic designers, production operators, and billing staff.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-dp-navy hover:bg-dp-orange text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition"
        >
          <PlusCircle className="w-4 h-4 text-dp-orange" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-dp-orange bg-dp-orangeLight px-2 py-0.5 rounded">
                Role: {u.role}
              </span>
              <h3 className="font-extrabold text-dp-navy text-base">{u.name}</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{u.email}</span>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Granted Capabilities:</span>
              <ul className="space-y-1 text-[11px] text-slate-700 font-medium">
                {rolePermissions[u.role]?.map((perm, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-dp-navy">Add Staff Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Role Permission</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-bold"
                  >
                    <option value="owner">Owner</option>
                    <option value="manager">Manager / Admin</option>
                    <option value="designer">Graphic Designer</option>
                    <option value="production">Production Lead</option>
                    <option value="accounts">Accounts Staff</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-dp-navy text-white rounded-lg shadow"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
