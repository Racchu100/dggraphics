'use client';

import React, { useState, useEffect } from 'react';
import { ProductionTask, VendorWorkOrder, Vendor, Order, Material, Labour } from '@/types';
import {
  Factory,
  Building2,
  Users,
  PlusCircle,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';

export default function AdminProductionPage() {
  const [tasks, setTasks] = useState<ProductionTask[]>([]);
  const [workOrders, setWorkOrders] = useState<VendorWorkOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labourList, setLabourList] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'all' | 'in_house' | 'outsourced'>('all');

  // Modals
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [inHouseModalOpen, setInHouseModalOpen] = useState(false);
  const [printableWorkOrder, setPrintableWorkOrder] = useState<VendorWorkOrder | null>(null);

  // Vendor Assignment Form State
  const [vwoJobNumber, setVwoJobNumber] = useState('');
  const [vwoVendorId, setVwoVendorId] = useState('');
  const [vwoTaskDesc, setVwoTaskDesc] = useState('');
  const [vwoSpecs, setVwoSpecs] = useState('');
  const [vwoQuantity, setVwoQuantity] = useState(1);
  const [vwoDimensions, setVwoDimensions] = useState('');
  const [vwoAgreedPrice, setVwoAgreedPrice] = useState(0);
  const [vwoAdvance, setVwoAdvance] = useState(0);
  const [vwoExpectedDate, setVwoExpectedDate] = useState('');

  // In-House Task Form State
  const [inhouseJobNumber, setInhouseJobNumber] = useState('');
  const [inhouseTaskName, setInhouseTaskName] = useState('');
  const [inhouseStaffName, setInhouseStaffName] = useState('Kumar Swamy');
  const [inhouseMaterialCost, setInhouseMaterialCost] = useState(0);
  const [inhouseLabourCost, setInhouseLabourCost] = useState(0);
  const [inhouseNotes, setInhouseNotes] = useState('');

  const loadData = async () => {
    try {
      const [tRes, wRes, vRes, oRes, mRes, lRes] = await Promise.all([
        fetch('/api/production/tasks'),
        fetch('/api/production/vendor-work-orders'),
        fetch('/api/vendors'),
        fetch('/api/orders'),
        fetch('/api/inventory'),
        fetch('/api/labour'),
      ]);
      const tData = await tRes.json();
      const wData = await wRes.json();
      const vData = await vRes.json();
      const oData = await oRes.json();
      const mData = await mRes.json();
      const lData = await lRes.json();

      if (tData.success) setTasks(tData.tasks);
      if (wData.success) setWorkOrders(wData.workOrders);
      if (vData.success) {
        setVendors(vData.vendors);
        if (vData.vendors.length > 0) setVwoVendorId(vData.vendors[0].id);
      }
      if (oData.success) {
        setOrders(oData.orders);
        if (oData.orders.length > 0) {
          setVwoJobNumber(oData.orders[0].jobNumber);
          setInhouseJobNumber(oData.orders[0].jobNumber);
        }
      }
      if (mData.success) setMaterials(mData.materials);
      if (lData.success) setLabourList(lData.labour);
    } catch (e) {
      console.error('Failed to load production data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Task Status
  const handleTaskStatusChange = async (task: ProductionTask, status: string) => {
    try {
      const res = await fetch('/api/production/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status }),
      });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Submit Vendor Assignment Work Order
  const handleCreateVendorWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/production/vendor-work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vwoVendorId,
          jobNumber: vwoJobNumber,
          taskDescription: vwoTaskDesc,
          specifications: vwoSpecs,
          quantity: vwoQuantity,
          dimensions: vwoDimensions,
          agreedPrice: vwoAgreedPrice,
          advancePaid: vwoAdvance,
          expectedDeliveryDate: vwoExpectedDate || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVendorModalOpen(false);
        setVwoTaskDesc('');
        setVwoSpecs('');
        setVwoAgreedPrice(0);
        setVwoAdvance(0);
        loadData();
      } else {
        alert('Failed to assign vendor job: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      alert('Error creating work order: ' + err.message);
    }
  };

  // Submit In-House Task
  const handleCreateInhouseTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/production/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobNumber: inhouseJobNumber,
          taskName: inhouseTaskName,
          type: 'in_house',
          assignedStaffName: inhouseStaffName,
          materialCost: inhouseMaterialCost,
          labourCost: inhouseLabourCost,
          vendorCost: 0,
          status: 'In Progress',
          notes: inhouseNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInHouseModalOpen(false);
        setInhouseTaskName('');
        setInhouseMaterialCost(0);
        setInhouseLabourCost(0);
        setInhouseNotes('');
        loadData();
      } else {
        alert('Failed to add in-house task: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      alert('Error adding in-house task: ' + err.message);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'in_house') return t.type === 'in_house';
    if (activeTab === 'outsourced') return t.type === 'outsourced';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Controls & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition shrink-0 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('in_house')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition shrink-0 ${
              activeTab === 'in_house'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            In-House ({tasks.filter((t) => t.type === 'in_house').length})
          </button>
          <button
            onClick={() => setActiveTab('outsourced')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition shrink-0 ${
              activeTab === 'outsourced'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            Outsourced ({tasks.filter((t) => t.type === 'outsourced').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInHouseModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition"
          >
            <Factory className="w-3.5 h-3.5 text-slate-500" />
            <span>In-House Task</span>
          </button>

          <button
            onClick={() => setVendorModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-xs transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Outsource to Vendor</span>
          </button>
        </div>
      </div>

      {/* Production Tasks Table Card (AdminLTE 4) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-900 uppercase">Workshop & Outsourcing Queue</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {filteredTasks.length} Tasks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInHouseModalOpen(true)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
            >
              + In-House
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setVendorModalOpen(true)}
              className="text-xs font-bold text-dp-orange hover:underline"
            >
              + Outsource
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Job Number</th>
                <th className="py-2.5 px-4">Task Name</th>
                <th className="py-2.5 px-4">Production Method</th>
                <th className="py-2.5 px-4">Assigned To</th>
                <th className="py-2.5 px-4">Material Cost</th>
                <th className="py-2.5 px-4">Labour Cost</th>
                <th className="py-2.5 px-4">Vendor Agreed Cost</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Loading production schedules...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No production tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-dp-navy whitespace-nowrap">
                      {task.jobNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {task.taskName}
                      {task.notes && <div className="text-[10px] text-slate-400 font-normal">{task.notes}</div>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.type === 'outsourced'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {task.type === 'outsourced' ? 'Vendor Outsourced' : 'In-House'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {task.vendorName ? (
                        <span className="text-purple-900 font-bold">🏢 {task.vendorName}</span>
                      ) : (
                        <span>👤 {task.assignedStaffName || 'Internal Staff'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      ₹{task.materialCost}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      ₹{task.labourCost}
                    </td>
                    <td className="py-3 px-4 font-black text-dp-navy whitespace-nowrap">
                      {task.vendorCost > 0 ? `₹${task.vendorCost}` : '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-slate-200 bg-white font-medium focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {task.vendorWorkOrderId ? (
                        <button
                          onClick={() => {
                            const wo = workOrders.find((w) => w.id === task.vendorWorkOrderId);
                            if (wo) setPrintableWorkOrder(wo);
                          }}
                          className="text-xs font-bold text-dp-orange hover:underline inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Work Order</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">In-House Task</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VENDOR OUTSOURCING WORK ORDERS SECTION */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-dp-navy">Vendor Work Orders Ledger ({workOrders.length})</h3>
            <p className="text-xs text-slate-400">
              Official purchase work orders issued to external printing and fabrication partners.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Work Order #</th>
                <th className="py-3 px-3">Linked Job #</th>
                <th className="py-3 px-3">Vendor Partner</th>
                <th className="py-3 px-3">Task & Specs</th>
                <th className="py-3 px-3">Agreed Cost</th>
                <th className="py-3 px-3">Advance Paid</th>
                <th className="py-3 px-3">Balance Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Print Work Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-dp-navy">{wo.workOrderNumber}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">{wo.jobNumber}</td>
                  <td className="py-3 px-3 font-bold text-purple-900">{wo.vendorName}</td>
                  <td className="py-3 px-3 max-w-xs truncate">{wo.taskDescription}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{wo.agreedPrice}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">₹{wo.advancePaid}</td>
                  <td className="py-3 px-3 font-black text-amber-700">₹{wo.balanceDue}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {wo.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setPrintableWorkOrder(wo)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-dp-navy transition"
                      title="Print Vendor Work Order"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: OUTSOURCE JOB TO VENDOR */}
      {/* ========================================================= */}
      {vendorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-dp-navy">Assign Production Task to Vendor</h3>
                <p className="text-xs text-slate-500">
                  Links agreed vendor cost to customer job without customer billing disclosure.
                </p>
              </div>
              <button onClick={() => setVendorModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendorWorkOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer Job Number *</label>
                  <select
                    value={vwoJobNumber}
                    onChange={(e) => setVwoJobNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy bg-white font-mono"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.jobNumber}>
                        {o.jobNumber} ({o.customerName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select External Vendor *</label>
                  <select
                    value={vwoVendorId}
                    onChange={(e) => setVwoVendorId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy bg-white font-semibold"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  value={vwoTaskDesc}
                  onChange={(e) => setVwoTaskDesc(e.target.value)}
                  placeholder="e.g. 20 T-shirts screen printed with cyan & white ink"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={vwoQuantity}
                    onChange={(e) => setVwoQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dimensions (if banner/acrylic)</label>
                  <input
                    type="text"
                    value={vwoDimensions}
                    onChange={(e) => setVwoDimensions(e.target.value)}
                    placeholder="e.g. 20x10 ft (400 sq.ft)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Agreed Vendor Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={vwoAgreedPrice}
                    onChange={(e) => setVwoAgreedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy font-bold text-dp-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Advance Paid to Vendor (₹)</label>
                  <input
                    type="number"
                    value={vwoAdvance}
                    onChange={(e) => setVwoAdvance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technical Specifications for Vendor</label>
                <textarea
                  rows={2}
                  value={vwoSpecs}
                  onChange={(e) => setVwoSpecs(e.target.value)}
                  placeholder="Material specs, ink type, bleed margins, packaging instructions..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-dp-navy resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVendorModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-dp-navy hover:bg-dp-orange text-white rounded-lg shadow"
                >
                  Create Vendor Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: IN-HOUSE TASK CREATION */}
      {/* ========================================================= */}
      {inHouseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-dp-navy">Add In-House Production Task</h3>
              <button onClick={() => setInHouseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInhouseTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Customer Job Number</label>
                <select
                  value={inhouseJobNumber}
                  onChange={(e) => setInhouseJobNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.jobNumber}>
                      {o.jobNumber} ({o.customerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Task Name</label>
                <input
                  type="text"
                  required
                  value={inhouseTaskName}
                  onChange={(e) => setInhouseTaskName(e.target.value)}
                  placeholder="e.g. Sublimation Mug Heat Press"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Employee</label>
                <input
                  type="text"
                  value={inhouseStaffName}
                  onChange={(e) => setInhouseStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Material Cost (₹)</label>
                  <input
                    type="number"
                    value={inhouseMaterialCost}
                    onChange={(e) => setInhouseMaterialCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Labour Charge (₹)</label>
                  <input
                    type="number"
                    value={inhouseLabourCost}
                    onChange={(e) => setInhouseLabourCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInHouseModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-dp-navy text-white rounded-lg shadow"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: PRINTABLE VENDOR WORK ORDER (CONFIDENTIAL BILLING HIDDEN) */}
      {/* ========================================================= */}
      {printableWorkOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200 no-print">
              <span className="font-bold text-xs uppercase tracking-wider text-purple-700">
                Official Vendor Work Order Proof
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => window.print()}
                  className="bg-dp-navy text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Order</span>
                </button>
                <button onClick={() => setPrintableWorkOrder(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Work order document */}
            <div className="space-y-4 sm:space-y-5 text-xs text-dp-charcoal">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-slate-900 pb-3">
                <div>
                  <div className="text-lg font-black text-dp-navy">DG graphics</div>
                  <div className="text-[10px] text-slate-500">Commercial Print Studio &bull; Procurement Dept</div>
                  <div className="text-[10px] text-slate-400">Ph: +91 98450 12345 &bull; Bengaluru</div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">VENDOR WORK ORDER</span>
                  <span className="text-xl font-mono font-black text-purple-900 block">{printableWorkOrder.workOrderNumber}</span>
                  <span className="text-[10px] text-slate-500">Date: {new Date(printableWorkOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200">
                <span className="text-[10px] uppercase font-bold text-purple-900 block">Vendor Partner</span>
                <div className="font-bold text-sm text-slate-900 mt-0.5">{printableWorkOrder.vendorName}</div>
                <div className="text-[11px] text-slate-600">Ph: {printableWorkOrder.vendorPhone}</div>
              </div>

              {/* Task Details */}
              <div className="space-y-2">
                <div className="font-bold text-xs uppercase text-slate-500">Production Specifications</div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-slate-500">Task Description:</span>
                    <strong className="font-bold text-slate-900">{printableWorkOrder.taskDescription}</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <strong className="font-bold">{printableWorkOrder.quantity} units</strong>
                  </div>
                  {printableWorkOrder.dimensions && (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-slate-500">Dimensions:</span>
                      <strong className="font-bold">{printableWorkOrder.dimensions}</strong>
                    </div>
                  )}
                  {printableWorkOrder.specifications && (
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700">
                      <strong>Specs:</strong> {printableWorkOrder.specifications}
                    </div>
                  )}
                </div>
              </div>

              {/* Agreed Cost & Payment Summary for Vendor */}
              <div className="bg-slate-100 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Agreed Vendor Fee:</span>
                  <span className="text-base font-black text-slate-900">₹{printableWorkOrder.agreedPrice}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Advance Disbursed:</span>
                  <span className="text-sm font-bold text-emerald-700">₹{printableWorkOrder.advancePaid}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Balance on Delivery:</span>
                  <span className="text-base font-black text-amber-700">₹{printableWorkOrder.balanceDue}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[10px] text-slate-500">
                * Note: Delivery must be accompanied with clean protective packaging and delivered before deadline. Customer billing data remains confidential.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
