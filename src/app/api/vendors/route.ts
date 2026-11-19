import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const vendors = db.getVendors();
    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: 'Vendor name and phone are required' }, { status: 400 });
    }

    const vendor = db.saveVendor({
      id: body.id || `vend-${Date.now()}`,
      name: body.name,
      businessName: body.businessName || '',
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      email: body.email || '',
      address: body.address || '',
      category: body.category || 'General Printing',
      servicesProvided: body.servicesProvided || [],
      totalWorkAssigned: Number(body.totalWorkAssigned) || 0,
      totalPaid: Number(body.totalPaid) || 0,
      outstandingBalance: Number(body.outstandingBalance) || 0,
      createdAt: body.createdAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, vendor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
