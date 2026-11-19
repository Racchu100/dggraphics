import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobNumber = searchParams.get('jobNumber') || undefined;
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;

    const tasks = db.getProductionTasks({ jobNumber, type, status });
    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.jobNumber || !body.taskName) {
      return NextResponse.json({ success: false, error: 'Job Number and Task Name are required' }, { status: 400 });
    }

    const task = db.saveProductionTask({
      id: body.id || `pt-${Date.now()}`,
      orderId: body.orderId || '',
      jobNumber: body.jobNumber,
      taskName: body.taskName,
      type: body.type || 'in_house',
      assignedStaffId: body.assignedStaffId,
      assignedStaffName: body.assignedStaffName,
      vendorId: body.vendorId,
      vendorName: body.vendorName,
      vendorWorkOrderId: body.vendorWorkOrderId,
      materialCost: Number(body.materialCost) || 0,
      labourCost: Number(body.labourCost) || 0,
      vendorCost: Number(body.vendorCost) || 0,
      status: body.status || 'Pending',
      notes: body.notes || '',
      completedAt: body.completedAt,
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID required' }, { status: 400 });
    }
    const deleted = db.deleteProductionTask(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
