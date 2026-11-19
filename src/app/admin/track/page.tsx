'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Phone,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Factory,
  Receipt,
  RotateCcw,
  X,
  XCircle,
  Eye,
  PlusCircle,
} from 'lucide-react';

function AdminTrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('job') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);

        if (initialQuery) {
          const q = initialQuery.toLowerCase().trim();
          const found = data.orders.find(
            (o: Order) =>
              o.jobNumber.toLowerCase() === q ||
              o.customerPhone.includes(q) ||
              o.customerName.toLowerCase().includes(q)
          );
          if (found) setSelectedOrder(found);
        }
      }
    } catch (e) {
      console.error('Failed to load orders for tracking', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const found = orders.find(
      (o) =>
        o.jobNumber.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerName.toLowerCase().includes(q)
    );
    if (found) {
      setSelectedOrder(found);
      setSelectedStatusFilter(null);
    } else {
      alert(`No order found matching "${searchQuery}". Please check the Job Number or Phone.`);
    }
  };

  const allStatuses = [
    'Order Received',
    'Design Pending',
    'Design Approved',
    'Work in Progress',
    'Printing Completed',
    'Ready for Collection',
    'Delivered',
    'Cancelled',
  ];

  const stageDefinitions = [
    {
      id: 'Order Received',
      num: '01',
      label: 'Order Received',
      shortLabel: 'Pending Booking',
      activeBorder: 'border-amber-300',
      activeBg: 'bg-amber-50/70',
      activeText: 'text-amber-950',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
    },
    {
      id: 'Design Pending',
      num: '02',
      label: 'Design Pending',
      shortLabel: 'Artwork Queue',
      activeBorder: 'border-purple-300',
      activeBg: 'bg-purple-50/70',
      activeText: 'text-purple-950',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      badgeBorder: 'border-purple-300',
    },
    {
      id: 'Design Approved',
      num: '03',
      label: 'Design Approved',
      shortLabel: 'Proof Cleared',
      activeBorder: 'border-indigo-300',
      activeBg: 'bg-indigo-50/70',
      activeText: 'text-indigo-950',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      badgeBorder: 'border-indigo-300',
    },
    {
      id: 'Work in Progress',
      num: '04',
      label: 'Work in Progress',
      shortLabel: 'In Production',
      activeBorder: 'border-blue-300',
      activeBg: 'bg-blue-50/70',
      activeText: 'text-blue-950',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      badgeBorder: 'border-blue-300',
    },
    {
      id: 'Printing Completed',
      num: '05',
      label: 'Printing Completed',
      shortLabel: 'Print Done',
      activeBorder: 'border-teal-300',
      activeBg: 'bg-teal-50/70',
      activeText: 'text-teal-950',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      badgeBorder: 'border-teal-300',
    },
    {
      id: 'Ready for Collection',
      num: '06',
      label: 'Ready for Collection',
      shortLabel: 'Ready at Counter',
      activeBorder: 'border-emerald-300',
      activeBg: 'bg-emerald-50/70',
      activeText: 'text-emerald-950',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300',
    },
    {
      id: 'Delivered',
      num: '07',
      label: 'Delivered',
      shortLabel: 'Collected / Closed',
      activeBorder: 'border-slate-300',
      activeBg: 'bg-slate-100/80',
      activeText: 'text-slate-900',
      badgeBg: 'bg-slate-200',
      badgeText: 'text-slate-700',
      badgeBorder: 'border-slate-300',
    },
    {
      id: 'Cancelled',
      num: '08',
      label: 'Cancelled',
      shortLabel: 'Cancelled / Void',
      activeBorder: 'border-rose-300',
      activeBg: 'bg-rose-50/70',
      activeText: 'text-rose-950',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      badgeBorder: 'border-rose-300',
    },
  ];

  const countsByStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
      } else {
        alert('Failed to update status: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const currentStatusIndex = selectedOrder ? allStatuses.indexOf(selectedOrder.orderStatus) : -1;

  return (
    <div className="space-y-4">
      {/* Quick Search & Actions Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Job # (e.g. JOB-2026-0008), Phone, or Client Name..."
              className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-md shadow-xs transition shrink-0"
          >
            Track Job
          </button>
        </form>

        <Link
          href="/admin/orders?action=new"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition shrink-0 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Walk-in Order</span>
        </Link>
      </div>

      {/* Real-time Order Stages & Counts Tracker Dashboard */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Live Stage Tracker & Order Counts
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {orders.length} Total Studio Orders
            </span>
          </div>
          {selectedStatusFilter && (
            <button
              onClick={() => setSelectedStatusFilter(null)}
              className="text-xs font-bold text-dp-orange hover:text-dp-orangeHover flex items-center gap-1 transition self-start sm:self-auto"
            >
              <span>Show All Stages ({orders.length})</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 8-Stage Clickable Metric Cards Grid (Including Cancelled) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stageDefinitions.map((st) => {
            const count = countsByStatus[st.id] || 0;
            const isSelected = selectedStatusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatusFilter(isSelected ? null : st.id)}
                className={`p-2.5 rounded-md border text-left transition relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-mono font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {st.num}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-500'
                        : count > 0
                        ? 'bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {st.label}
                  </div>
                  <div className={`text-[10px] font-normal mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {st.shortLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single-Row Jobs Table List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">
              {selectedStatusFilter ? `Stage: ${selectedStatusFilter}` : 'All Studio Orders'}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {orders.filter((o) => {
                if (selectedStatusFilter && o.orderStatus !== selectedStatusFilter) return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase().trim();
                  const matchJob = o.jobNumber.toLowerCase().includes(q);
                  const matchName = o.customerName.toLowerCase().includes(q);
                  const matchPhone = o.customerPhone.includes(q);
                  const matchProd = o.items.some((i) => i.productName.toLowerCase().includes(q));
                  if (!matchJob && !matchName && !matchPhone && !matchProd) return false;
                }
                return true;
              }).length} Orders
            </span>
          </div>

          <div className="flex items-center gap-3">
            {selectedStatusFilter && (
              <button
                onClick={() => setSelectedStatusFilter(null)}
                className="text-xs font-bold text-dp-orange hover:text-dp-orangeHover flex items-center gap-1 transition"
              >
                <span>Clear Stage Filter</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Click &quot;View&quot; on any job row to inspect production pipeline
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-7 h-7 border-3 border-dp-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Job # & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product & Specs</th>
                  <th className="py-3 px-4">Production</th>
                  <th className="py-3 px-4">Amount / Dues</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter((o) => {
                    if (selectedStatusFilter && o.orderStatus !== selectedStatusFilter) return false;
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase().trim();
                      const matchJob = o.jobNumber.toLowerCase().includes(q);
                      const matchName = o.customerName.toLowerCase().includes(q);
                      const matchPhone = o.customerPhone.includes(q);
                      const matchProd = o.items.some((i) => i.productName.toLowerCase().includes(q));
                      if (!matchJob && !matchName && !matchPhone && !matchProd) return false;
                    }
                    return true;
                  })
                  .map((ord) => {
                    const isSelected = selectedOrder?.id === ord.id;
                    return (
                      <React.Fragment key={ord.id}>
                        <tr
                          className={`transition ${
                            isSelected
                              ? 'bg-orange-50/70 border-l-4 border-l-dp-orange font-medium'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-dp-navy whitespace-nowrap">
                            <div className="text-xs text-dp-navy font-bold">{ord.jobNumber}</div>
                            <div className="text-[10px] text-slate-400 font-sans font-normal">
                              {ord.createdAt.split('T')[0]}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{ord.customerName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{ord.customerPhone}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            {ord.items.map((it) => (
                              <div key={it.id} className="truncate">
                                <span className="font-semibold text-slate-800">{it.productName}</span>{' '}
                                <span className="text-slate-500 font-bold">x{it.quantity}</span>
                                {it.material && (
                                  <span className="text-[10px] text-slate-400 ml-1">({it.material})</span>
                                )}
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.productionMethod === 'in_house'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {ord.productionMethod === 'in_house' ? 'In-House' : 'Vendor'}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">₹{ord.grandTotal}</div>
                            <div
                              className={`text-[10px] font-bold ${
                                ord.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'
                              }`}
                            >
                              {ord.balanceDue > 0 ? `Due: ₹${ord.balanceDue}` : 'Paid'}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium inline-flex items-center gap-1 border ${
                                ord.orderStatus === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : ord.orderStatus === 'Delivered'
                                  ? 'bg-slate-50 text-slate-700 border-slate-200'
                                  : ord.orderStatus === 'Ready for Collection'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : ord.orderStatus === 'Work in Progress'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {ord.orderStatus === 'Cancelled' && <XCircle className="w-3 h-3 text-rose-600" />}
                              <span>{ord.orderStatus}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedOrder(null);
                                } else {
                                  setSelectedOrder(ord);
                                }
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-medium inline-flex items-center gap-1 border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isSelected ? 'Close' : 'View'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* Detailed Card Expanded Directly Below THIS Actual Job */}
                        {isSelected && (
                          <tr key={`${ord.id}-expanded`} className="bg-slate-50/70">
                            <td colSpan={7} className="p-2 sm:p-3 border-b-2 border-slate-200">
                              <div id="full-job-detail" className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden text-xs transition-all">
                                {/* Top Job Banner */}
                                <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-mono text-base sm:text-lg font-black text-dp-orange tracking-tight">
                                        {ord.jobNumber}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold text-[10px]">
                                        Offline Counter Order
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                                        {ord.productionMethod === 'in_house' ? 'In-House Production' : 'Vendor Outsourced'}
                                      </span>
                                      {ord.orderStatus === 'Cancelled' && (
                                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                                          ✕ Cancelled
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-400 text-[11px] mt-0.5">
                                      Booked on {ord.createdAt.split('T')[0]} &bull; Expected Delivery: {ord.expectedCompletionDate || 'Same Day / 24 Hours'}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                      href={`/admin/billing?search=${encodeURIComponent(ord.jobNumber)}`}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                                    >
                                      <Receipt className="w-3.5 h-3.5 text-dp-orange" />
                                      <span>View Invoice</span>
                                    </Link>
                                    <a
                                      href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                        `Hello ${ord.customerName}, your job ${ord.jobNumber} at DG graphics is currently at: ${ord.orderStatus}. Balance Due: ₹${ord.balanceDue}.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>WhatsApp Client</span>
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrder(null)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                      title="Close Full View"
                                    >
                                      <X className="w-3.5 h-3.5 text-rose-400" />
                                      <span>Close</span>
                                    </button>
                                  </div>
                                </div>

                                <div className="p-3 sm:p-4 space-y-3">
                                  {/* Interactive Production Pipeline */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                        Production Workflow Stage (Click to Update)
                                      </span>
                                      {updatingStatus && (
                                        <span className="text-xs font-bold text-dp-orange flex items-center gap-1">
                                          <div className="w-3 h-3 border-2 border-dp-orange border-t-transparent rounded-full animate-spin" />
                                          Updating status...
                                        </span>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
                                      {allStatuses.map((st, idx) => {
                                        const isCancelledStage = st === 'Cancelled';
                                        const isOrderCancelled = ord.orderStatus === 'Cancelled';
                                        const isCurrent = ord.orderStatus === st;
                                        const isDone = !isOrderCancelled && !isCancelledStage && idx < currentStatusIndex;
                                        return (
                                          <button
                                            key={st}
                                            type="button"
                                            disabled={updatingStatus}
                                            onClick={() => handleUpdateStatus(st)}
                                            className={`px-2 py-1.5 rounded-xl border text-left transition relative ${
                                              isCurrent
                                                ? isCancelledStage
                                                  ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                                                  : 'bg-dp-orange text-white border-dp-orange font-bold shadow-sm'
                                                : isDone
                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold hover:bg-emerald-100'
                                                : isCancelledStage
                                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-0.5">
                                              <span className="text-[9px] font-black opacity-70">
                                                {isCancelledStage ? '✕' : `0${idx + 1}`}
                                              </span>
                                              {isDone ? (
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                              ) : isCurrent ? (
                                                isCancelledStage ? (
                                                  <XCircle className="w-3 h-3 text-white" />
                                                ) : (
                                                  <Clock className="w-3 h-3 text-white animate-pulse" />
                                                )
                                              ) : isCancelledStage ? (
                                                <XCircle className="w-3 h-3 text-rose-500" />
                                              ) : null}
                                            </div>
                                            <div className="text-[10px] font-bold leading-tight">{st}</div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Grid: Customer Info & Product Specifications */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {/* Customer Details Card */}
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
                                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                                        Client Information
                                      </span>
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-extrabold text-xs text-slate-900">{ord.customerName}</div>
                                          <div className="text-slate-600 flex items-center gap-1 mt-0.5 text-[11px]">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            <span>{ord.customerPhone}</span>
                                          </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-dp-navy text-[10px]">
                                          Shop Collection
                                        </span>
                                      </div>
                                      {ord.internalNotes && (
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                                          <strong className="text-slate-800">Workshop Note:</strong> {ord.internalNotes}
                                        </div>
                                      )}
                                    </div>

                                    {/* Financials & Balance Card */}
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
                                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                                        Payment Collection & Dues
                                      </span>
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                                          <span className="text-[9px] text-slate-400 font-bold block">Total Billed</span>
                                          <span className="font-black text-xs text-dp-navy">₹{ord.grandTotal}</span>
                                        </div>
                                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                                          <span className="text-[9px] text-emerald-600 font-bold block">Advance Paid</span>
                                          <span className="font-black text-xs text-emerald-700">₹{ord.advancePaid}</span>
                                        </div>
                                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                                          <span className="text-[9px] text-amber-600 font-bold block">Balance Due</span>
                                          <span className={`font-black text-xs ${ord.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                            {ord.balanceDue > 0 ? `₹${ord.balanceDue}` : 'Cleared'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between pt-0.5">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                          ord.balanceDue === 0
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : ord.advancePaid > 0
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-rose-100 text-rose-800'
                                        }`}>
                                          {ord.paymentStatus}
                                        </span>

                                        {ord.balanceDue > 0 && (
                                          <Link
                                            href={`/admin/billing?search=${encodeURIComponent(ord.jobNumber)}`}
                                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                                          >
                                            Collect Balance &rarr;
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Products & Technical Specifications Card */}
                                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                                      Products & Production Specifications
                                    </span>
                                    <div className="space-y-1.5">
                                      {ord.items.map((item, idx) => (
                                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                                          <div>
                                            <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                                              <span>{item.productName}</span>
                                              <span className="text-[9px] font-black bg-orange-100 text-dp-orange px-1.5 py-0.5 rounded-md">
                                                Qty: {item.quantity}
                                              </span>
                                            </div>
                                            <div className="text-slate-500 text-[11px] mt-0.5 space-x-2">
                                              {item.material && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">{item.material}</span>}
                                              {item.specialInstructions && <span>{item.specialInstructions}</span>}
                                            </div>
                                          </div>
                                          <div className="font-black text-xs text-dp-navy shrink-0">
                                            ₹{item.totalPrice}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading tracker...</div>}>
      <AdminTrackContent />
    </Suspense>
  );
}
