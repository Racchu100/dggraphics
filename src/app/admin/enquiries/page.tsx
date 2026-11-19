'use client';

import React, { useState, useEffect } from 'react';
import { Enquiry } from '@/types';
import { HelpCircle, Phone, MessageSquare, Mail, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (data.success) setEnquiries(data.enquiries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (enquiry: Enquiry, status: any) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...enquiry, status }),
      });
      const data = await res.json();
      if (data.success) loadEnquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dp-navy tracking-tight">
            Customer Enquiries & Lead Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Incoming custom quotation requests from the customer website. Follow up via WhatsApp and convert leads into orders.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Requested Service</th>
                <th className="py-3 px-4">Message / Specs</th>
                <th className="py-3 px-4">Lead Status</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">Loading website enquiries...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">No incoming enquiries yet.</td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{enq.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-700">{enq.phone}</div>
                      {enq.email && <div className="text-[10px] text-slate-400">{enq.email}</div>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-900 whitespace-nowrap">
                      {enq.productOrService}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-600">
                      {enq.message}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-slate-200 bg-white font-medium focus:outline-none"
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Converted">Converted to Order</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${enq.name}, thank you for inquiring about ${enq.productOrService} at DG graphics! How can we assist you with dimensions and quotation?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition inline-block align-middle"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${enq.phone}`}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-dp-navy transition inline-block align-middle"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`/admin/orders?action=new`}
                        className="px-2 py-1 rounded bg-dp-navy hover:bg-dp-orange text-white text-[10px] font-bold transition inline-block align-middle ml-1"
                        title="Convert to Order"
                      >
                        Convert &rarr;
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
