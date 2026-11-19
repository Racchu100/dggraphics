'use client';

import React, { useState, useEffect } from 'react';
import { Vendor, VendorWorkOrder } from '@/types';
import { Building2, PlusCircle, Search, Phone, Mail, MapPin, Receipt, X } from 'lucide-react';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [workOrders, setWorkOrders] = useState<VendorWorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Offset Printing');
  const [services, setServices] = useState('Catalogues, Booklets, Packaging');
  const [address, setAddress] = useState('');

  const loadData = async () => {
    try {
      const [vRes, wRes] = await Promise.all([
        fetch('/api/vendors'),
        fetch('/api/production/vendor-work-orders'),
      ]);
      const vData = await vRes.json();
      const wData = await wRes.json();
      if (vData.success) setVendors(vData.vendors);
      if (wData.success) setWorkOrders(wData.workOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          businessName: businessName.trim(),
          phone: phone.trim(),
          category,
          servicesProvided: services.split(',').map((s) => s.trim()),
          address: address.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setName('');
        setBusinessName('');
        setPhone('');
        setAddress('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const vendorWorkOrders = selectedVendor
    ? workOrders.filter((w) => w.vendorId === selectedVendor.id)
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-800">Partner Directory</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {vendors.length} vendors
          </span>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Vendor Partner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vendors.map((v) => (
          <div key={v.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {v.category}
                  </span>
                  <h3 className="font-semibold text-slate-800 text-sm mt-1">{v.name}</h3>
                  {v.businessName && <div className="text-xs text-slate-500">{v.businessName}</div>}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{v.phone}</span>
                </div>
                {v.address && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{v.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Work Assigned</span>
                  <span className="font-bold text-slate-900">₹{v.totalWorkAssigned}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Balance Payable</span>
                  <span className="font-black text-amber-700">₹{v.outstandingBalance}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedVendor(v)}
                className="w-full text-center py-1.5 text-xs font-bold text-dp-navy hover:text-dp-orange bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                View Work Orders & Statement &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vendor Statement Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 block tracking-wider">
                  Vendor Partner Ledger
                </span>
                <h3 className="text-xl font-extrabold text-dp-navy mt-0.5">{selectedVendor.name}</h3>
                <div className="text-slate-500 mt-1">Ph: {selectedVendor.phone} &bull; {selectedVendor.address}</div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Work Assigned</span>
                <span className="text-lg font-black text-dp-navy">₹{selectedVendor.totalWorkAssigned}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Paid To Vendor</span>
                <span className="text-lg font-black text-emerald-700">₹{selectedVendor.totalPaid}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Outstanding Due</span>
                <span className="text-lg font-black text-amber-700">₹{selectedVendor.outstandingBalance}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold uppercase text-slate-700">Assigned Work Orders ({vendorWorkOrders.length})</h4>
              {vendorWorkOrders.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No work orders assigned yet.</p>
              ) : (
                <div className="space-y-2">
                  {vendorWorkOrders.map((wo) => (
                    <div key={wo.id} className="p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-slate-50">
                      <div>
                        <div className="font-mono font-bold text-dp-navy">{wo.workOrderNumber} (Job: {wo.jobNumber})</div>
                        <div className="text-slate-600 mt-0.5">{wo.taskDescription}</div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-bold text-slate-900">₹{wo.agreedPrice}</div>
                        <div className="text-[11px] text-amber-700 font-semibold">Bal: ₹{wo.balanceDue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 font-bold bg-slate-100 hover:bg-slate-200 text-dp-navy rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-dp-navy">Add External Vendor Partner</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Vendor Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Offset Printing">Offset Printing</option>
                    <option value="Apparel Screenprint">Apparel Screenprint</option>
                    <option value="Acrylic & LED Signs">Acrylic & LED Signs</option>
                    <option value="Raw Materials Supplier">Raw Materials Supplier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Address / Industrial Area</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
