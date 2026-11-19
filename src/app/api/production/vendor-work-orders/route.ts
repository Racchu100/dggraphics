import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId') || undefined;
    const jobNumber = searchParams.get('jobNumber') || undefined;

    const workOrders = db.getVendorWorkOrders({ vendorId, jobNumber });
    return NextResponse.json({ success: true, workOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.vendorId || !body.jobNumber || !body.taskDescription) {
      return NextResponse.json({ success: false, error: 'Vendor, Job Number, and Task Description are required' }, { status: 400 });
    }

    const vendor = db.getVendorById(body.vendorId);
    const agreedPrice = Number(body.agreedPrice) || 0;
    const advancePaid = Number(body.advancePaid) || 0;
    const balanceDue = Math.max(0, agreedPrice - advancePaid);

    const workOrderNumber = body.workOrderNumber || db.getNextVendorWorkOrderNumber();
    const workOrder = db.saveVendorWorkOrder({
      id: body.id || `vwo-${Date.now()}`,
      workOrderNumber,
      vendorId: body.vendorId,
      vendorName: vendor?.name || body.vendorName || 'External Vendor',
      vendorPhone: vendor?.phone || body.vendorPhone || '',
      jobNumber: body.jobNumber,
      taskDescription: body.taskDescription,
      specifications: body.specifications || '',
      quantity: Number(body.quantity) || 1,
      dimensions: body.dimensions || '',
      agreedPrice,
      advancePaid,
      balanceDue,
      status: body.status || 'Assigned',
      expectedDeliveryDate: body.expectedDeliveryDate,
      artworkUrl: body.artworkUrl,
      notes: body.notes,
      createdAt: body.createdAt || new Date().toISOString(),
    });

    // Also auto-create or link a production task for this job
    const task = db.saveProductionTask({
      id: `pt-vwo-${Date.now()}`,
      orderId: '',
      jobNumber: body.jobNumber,
      taskName: `[Vendor: ${vendor?.name || 'Partner'}] ${body.taskDescription}`,
      type: 'outsourced',
      vendorId: body.vendorId,
      vendorName: vendor?.name,
      vendorWorkOrderId: workOrder.id,
      materialCost: 0,
      labourCost: 0,
      vendorCost: agreedPrice,
      status: 'In Progress',
      notes: `Work Order: ${workOrder.workOrderNumber}. Specifications: ${body.specifications || 'See work order'}`,
    });

    // If advance is paid, record it as a vendor payment expense
    if (advancePaid > 0) {
      db.recordExpense({
        id: `exp-vwo-adv-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        jobNumber: body.jobNumber,
        category: 'Vendor Payment',
        description: `Advance payment for Work Order ${workOrder.workOrderNumber} (${body.taskDescription})`,
        amount: advancePaid,
        paymentStatus: 'Paid',
        paymentMethod: body.paymentMethod || 'Bank Transfer',
        vendorId: body.vendorId,
        vendorName: vendor?.name,
        vendorWorkOrderId: workOrder.id,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, workOrder, task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
