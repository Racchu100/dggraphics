import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobNumber = searchParams.get('jobNumber')?.trim().toUpperCase();
    const phone = searchParams.get('phone')?.replace(/[^0-9]/g, '');

    if (!jobNumber || !phone) {
      return NextResponse.json({ success: false, error: 'Please provide both Job Number and registered Mobile Number.' }, { status: 400 });
    }

    const order = db.getOrderByJobNumber(jobNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: `No order found with Job Number "${jobNumber}".` }, { status: 404 });
    }

    const cleanOrderPhone = order.customerPhone.replace(/[^0-9]/g, '');
    if (!cleanOrderPhone.endsWith(phone) && !phone.endsWith(cleanOrderPhone)) {
      return NextResponse.json({ success: false, error: 'Mobile number does not match this Job Number. Please verify your registered number.' }, { status: 403 });
    }

    // Also fetch design preview if available
    const revisions = db.getDesignRevisions(jobNumber);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        jobNumber: order.jobNumber,
        createdAt: order.createdAt,
        expectedCompletionDate: order.expectedCompletionDate,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharges: order.deliveryCharges,
        grandTotal: order.grandTotal,
        advancePaid: order.advancePaid,
        balanceDue: order.balanceDue,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        deliveryMethod: order.deliveryMethod,
        customerNotes: order.customerNotes,
        revisions,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
