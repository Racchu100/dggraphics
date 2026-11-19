import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobNumber = searchParams.get('jobNumber') || undefined;
    const customerPhone = searchParams.get('customerPhone') || undefined;

    const invoices = db.getInvoices({ jobNumber, customerPhone });
    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Customer name and items are required' }, { status: 400 });
    }

    const grandTotal = Number(body.grandTotal) || 0;
    const amountPaid = Number(body.amountPaid) || 0;
    const balanceDue = Math.max(0, grandTotal - amountPaid);
    const invoiceNumber = body.invoiceNumber || db.getNextInvoiceNumber();
    const jobNumber = body.jobNumber || db.getNextJobNumber();

    const invoice = db.saveInvoice({
      id: body.id || `inv-${Date.now()}`,
      invoiceNumber,
      orderId: body.orderId,
      jobNumber,
      customerId: body.customerId || `cust-${Date.now()}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone || '',
      customerAddress: body.customerAddress || '',
      date: body.date || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate,
      items: body.items,
      subtotal: Number(body.subtotal) || grandTotal,
      discount: Number(body.discount) || 0,
      tax: Number(body.tax) || 0,
      deliveryCharges: Number(body.deliveryCharges) || 0,
      grandTotal,
      amountPaid,
      balanceDue,
      paymentStatus: balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid',
      status: balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Issued',
      createdAt: body.createdAt || new Date().toISOString(),
    });

    if (amountPaid > 0) {
      db.recordPayment({
        id: `pay-${Date.now()}`,
        invoiceId: invoice.id,
        jobNumber: invoice.jobNumber,
        customerId: invoice.customerId,
        amount: amountPaid,
        paymentMethod: body.paymentMethod || 'Cash',
        notes: 'Payment upon invoice issuance',
        date: invoice.date,
        receivedBy: body.receivedBy || 'Counter',
      });
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Invoice ID is required' }, { status: 400 });
    }

    const updated = db.updateInvoice(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Invoice ID is required' }, { status: 400 });
    }

    const deleted = db.deleteInvoice(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
