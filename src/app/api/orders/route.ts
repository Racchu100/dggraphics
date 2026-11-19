import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const customerPhone = searchParams.get('customerPhone') || undefined;

    const orders = db.getOrders({ status, search, customerPhone });
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Customer name, phone, and at least one item are required.' }, { status: 400 });
    }

    const order = db.createOrder({
      source: body.source || 'online',
      customerId: body.customerId || '',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerWhatsapp: body.customerWhatsapp || body.customerPhone,
      customerEmail: body.customerEmail || '',
      deliveryMethod: body.deliveryMethod || 'shop_collection',
      deliveryAddress: body.deliveryAddress || '',
      deliveryPincode: body.deliveryPincode || '',
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      designCharges: Number(body.designCharges) || 0,
      additionalCharges: Number(body.additionalCharges) || 0,
      discount: Number(body.discount) || 0,
      deliveryCharges: Number(body.deliveryCharges) || 0,
      grandTotal: Number(body.grandTotal) || 0,
      advancePaid: Number(body.advancePaid) || 0,
      balanceDue: Number(body.balanceDue) || Number(body.grandTotal) || 0,
      orderStatus: body.orderStatus || 'Order Received',
      paymentStatus: body.paymentStatus || (Number(body.advancePaid) > 0 ? (Number(body.advancePaid) >= Number(body.grandTotal) ? 'Paid' : 'Partially Paid') : 'Unpaid'),
      productionMethod: body.productionMethod || 'in_house',
      expectedCompletionDate: body.expectedCompletionDate,
      internalNotes: body.internalNotes || '',
      customerNotes: body.customerNotes || '',
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
