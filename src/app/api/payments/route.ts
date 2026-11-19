import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobNumber = searchParams.get('jobNumber') || undefined;
    const customerId = searchParams.get('customerId') || undefined;

    const payments = db.getPayments({ jobNumber, customerId });
    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.jobNumber || !body.amount) {
      return NextResponse.json({ success: false, error: 'Job Number and Amount are required' }, { status: 400 });
    }

    const payment = db.recordPayment({
      id: body.id || `pay-${Date.now()}`,
      invoiceId: body.invoiceId,
      orderId: body.orderId,
      jobNumber: body.jobNumber,
      customerId: body.customerId,
      amount: Number(body.amount),
      paymentMethod: body.paymentMethod || 'Cash',
      transactionReference: body.transactionReference || '',
      notes: body.notes || '',
      date: body.date || new Date().toISOString().split('T')[0],
      receivedBy: body.receivedBy || 'Staff',
    });

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
