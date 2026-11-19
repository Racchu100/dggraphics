import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobNumber = searchParams.get('jobNumber');
    if (!jobNumber) {
      return NextResponse.json({ success: false, error: 'Job Number is required' }, { status: 400 });
    }

    const revisions = db.getDesignRevisions(jobNumber);
    return NextResponse.json({ success: true, revisions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.jobNumber || !body.previewUrl) {
      return NextResponse.json({ success: false, error: 'Job Number and Preview URL are required' }, { status: 400 });
    }

    const existing = db.getDesignRevisions(body.jobNumber);
    const version = existing.length + 1;

    const revision = db.saveDesignRevision({
      id: body.id || `rev-${Date.now()}`,
      orderId: body.orderId || '',
      jobNumber: body.jobNumber,
      version,
      previewUrl: body.previewUrl,
      notes: body.notes || `Design Preview Version ${version}`,
      status: 'Awaiting Approval',
      customerFeedback: '',
      uploadedAt: new Date().toISOString(),
    });

    // Update the order status to 'Design Pending' or 'Design Awaiting Approval'
    const order = db.getOrderByJobNumber(body.jobNumber);
    if (order) {
      db.updateOrder(order.id, { orderStatus: 'Design Pending' });
    }

    return NextResponse.json({ success: true, revision });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'Revision ID and Status are required' }, { status: 400 });
    }

    const revision = db.saveDesignRevision({
      ...body,
      reviewedAt: new Date().toISOString(),
    });

    // If approved, update order status to 'Design Approved'
    if (body.status === 'Approved' && revision.jobNumber) {
      const order = db.getOrderByJobNumber(revision.jobNumber);
      if (order) {
        db.updateOrder(order.id, { orderStatus: 'Design Approved' });
      }
    }

    return NextResponse.json({ success: true, revision });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
