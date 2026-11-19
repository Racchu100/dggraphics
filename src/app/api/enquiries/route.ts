import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const enquiries = db.getEnquiries();
    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json({ success: false, error: 'Name, Phone, and Message are required' }, { status: 400 });
    }

    const enquiry = db.saveEnquiry({
      id: body.id || `enq-${Date.now()}`,
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      productOrService: body.productOrService || 'General Inquiry',
      message: body.message,
      attachmentUrl: body.attachmentUrl,
      status: body.status || 'New',
      internalNotes: body.internalNotes || '',
      assignedStaff: body.assignedStaff || '',
      convertedJobNumber: body.convertedJobNumber,
      createdAt: body.createdAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
