'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Calculator, CheckCircle2, Save, Layers, AlertCircle } from 'lucide-react';

export default function AdminPricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?active=false');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleBasePriceChange = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, basePrice: newPrice } : p))
    );
  };

  const handleMaterialPriceChange = (productId: string, matId: string, newRate: number, isSqft: boolean) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedMats = p.materials.map((m) => {
          if (m.id !== matId) return m;
          return isSqft ? { ...m, pricePerSqft: newRate } : { ...m, additionalCharge: newRate };
        });
        return { ...p, materials: updatedMats };
      })
    );
  };

  const handleSaveAll = async (productToSave: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      });
      const data = await res.json();
      if (data.success) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
      }
    } catch (err: any) {
      alert('Save error: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-2 rounded-md flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pricing rules updated successfully!</span>
        </div>
      )}

      <div className="space-y-3">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {prod.pricingType === 'sqft' ? 'Square Feet Rule' : 'Fixed Unit Pricing'}
                </span>
                <h3 className="text-sm font-semibold text-slate-800 mt-1">{prod.name}</h3>
              </div>

              <button
                onClick={() => handleSaveAll(prod)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Rates</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Default Base Rate (₹)
                </label>
                <input
                  type="number"
                  value={prod.basePrice}
                  onChange={(e) => handleBasePriceChange(prod.id, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-sm bg-white"
                />
              </div>

              {prod.pricingType === 'sqft' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Min. Billable Area (Sq.Ft.)
                  </label>
                  <input
                    type="number"
                    value={prod.minBillableArea || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setProducts((prev) =>
                        prev.map((p) => (p.id === prod.id ? { ...p, minBillableArea: val } : p))
                      );
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-sm bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Min. Order Quantity
                </label>
                <input
                  type="number"
                  value={prod.minQuantity || 1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setProducts((prev) =>
                      prev.map((p) => (p.id === prod.id ? { ...p, minQuantity: val } : p))
                    );
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-sm bg-white"
                />
              </div>
            </div>

            {/* Material Specific Pricing */}
            {prod.materials && prod.materials.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase text-slate-600 block">
                  Material Variant Rates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {prod.materials.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl border border-slate-200 text-xs bg-white space-y-1">
                      <span className="font-bold text-dp-navy block truncate">{m.name}</span>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-slate-400 text-[11px]">Rate:</span>
                        <input
                          type="number"
                          value={prod.pricingType === 'sqft' ? m.pricePerSqft || prod.basePrice : m.additionalCharge || 0}
                          onChange={(e) =>
                            handleMaterialPriceChange(
                              prod.id,
                              m.id,
                              parseFloat(e.target.value) || 0,
                              prod.pricingType === 'sqft'
                            )
                          }
                          className="w-24 px-2 py-1 border border-slate-200 rounded font-bold text-xs"
                        />
                        <span className="text-[10px] text-slate-400">
                          {prod.pricingType === 'sqft' ? '₹/sq.ft' : '₹ add-on'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
