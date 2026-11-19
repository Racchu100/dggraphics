'use client';

import React, { useState, useEffect } from 'react';
import { Customer, Order } from '@/types';
import { Users, Search, Phone, Mail, MapPin, Receipt, Clock, ChevronRight, X } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const loadData = async () => {
    try {
      const [cRes, oRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/orders'),
      ]);
      const cData = await cRes.json();
      const oData = await oRes.json();
      if (cData.success) setCustomers(cData.customers);
      if (oData.success) setOrders(oData.orders);
    } catch (e) {
      console.error('Failed to load customers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q)
    );
  });

  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) =>
          o.customerId === selectedCustomer.id ||
          o.customerPhone.replace(/[^0-9]/g, '') === selectedCustomer.phone.replace(/[^0-9]/g, '')
      )
    : [];

  return (
    <div className="space-y-4">
      {/* Customers Table Card (AdminLTE 4 Standard) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">Customer Directory</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredCustomers.length} clients
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Customer Name</th>
                <th className="py-2.5 px-4">Mobile & WhatsApp</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Total Jobs</th>
                <th className="py-2.5 px-4">Total Billed</th>
                <th className="py-2.5 px-4">Total Paid</th>
                <th className="py-2.5 px-4">Balance Due</th>
                <th className="py-2.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {cust.name}
                      {cust.email && <div className="text-[10px] text-slate-400 font-normal">{cust.email}</div>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-700">{cust.phone}</div>
                      {cust.whatsapp && (
                        <div className="text-[10px] text-emerald-600 font-medium">WA: {cust.whatsapp}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {cust.address || cust.city || 'Bengaluru'}
                    </td>
                    <td className="py-3 px-4 font-bold text-dp-navy whitespace-nowrap">
                      {cust.totalOrders}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      ₹{cust.totalBilled}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-700 whitespace-nowrap">
                      ₹{cust.totalPaid}
                    </td>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      {cust.outstandingBalance === 0 ? (
                        <span className="text-emerald-600 font-bold">Clear (₹0)</span>
                      ) : (
                        <span className="text-amber-700 font-black">₹{cust.outstandingBalance}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="text-xs font-semibold text-dp-orange hover:underline"
                      >
                        Ledger & History &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & Ledger Drawer/Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Customer Ledger & History
                </span>
                <h3 className="text-xl font-extrabold text-dp-navy mt-0.5">{selectedCustomer.name}</h3>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                  <span>📱 {selectedCustomer.phone}</span>
                  {selectedCustomer.email && <span>✉️ {selectedCustomer.email}</span>}
                  <span>📍 {selectedCustomer.address || 'Bengaluru'}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Ledger Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Lifetime Billed</span>
                <span className="text-lg font-black text-dp-navy">₹{selectedCustomer.totalBilled}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Paid Offline</span>
                <span className="text-lg font-black text-emerald-700">₹{selectedCustomer.totalPaid}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Balance Due</span>
                <span className="text-lg font-black text-amber-700">₹{selectedCustomer.outstandingBalance}</span>
              </div>
            </div>

            {/* Past Orders List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dp-navy">
                Job History with DG Graphics ({customerOrders.length})
              </h4>
              {customerOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No orders recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="font-mono font-bold text-dp-navy">{ord.jobNumber}</div>
                        <div className="text-[11px] text-slate-500">
                          {ord.items.map((i) => i.productName).join(', ')} &bull; {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹{ord.grandTotal}</div>
                        <div className="text-[10px] text-slate-400">
                          Status: <span className="font-semibold text-slate-700">{ord.orderStatus}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-dp-navy rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
