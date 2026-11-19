import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const customers = db.getCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: 'Name and Phone are required' }, { status: 400 });
    }

    const existing = db.findCustomerByPhone(body.phone);
    const customer = db.saveCustomer({
      id: body.id || existing?.id || `cust-${Date.now()}`,
      name: body.name,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      email: body.email || '',
      address: body.address || '',
      pincode: body.pincode || '',
      city: body.city || 'Bengaluru',
      firstOrderDate: existing?.firstOrderDate || new Date().toISOString(),
      totalOrders: existing?.totalOrders || 0,
      totalBilled: existing?.totalBilled || 0,
      totalPaid: existing?.totalPaid || 0,
      outstandingBalance: existing?.outstandingBalance || 0,
      notes: body.notes || '',
      createdAt: existing?.createdAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
