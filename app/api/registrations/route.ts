import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { getAdminSession } from '@/lib/auth';

// POST /api/registrations — public, called from PaymentModal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, email, phone, subject, courseName, paymentMethod, zelleReference } = body;

    if (!studentName || !email || !phone || !subject || !courseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const registration = await Registration.create({
      studentName,
      email,
      phone,
      subject,
      courseName,
      paymentMethod: paymentMethod ?? 'pending',
      zelleReference,
      status: 'pending',
    });

    return NextResponse.json({ success: true, id: registration._id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/registrations]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/registrations — admin only
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status   = searchParams.get('status');
    const subject  = searchParams.get('subject');
    const search   = searchParams.get('search');
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit    = Math.min(100, parseInt(searchParams.get('limit') ?? '50'));

    const filter: Record<string, unknown> = {};
    if (status)  filter.status  = status;
    if (subject) filter.subject = subject;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { email:       { $regex: search, $options: 'i' } },
        { courseName:  { $regex: search, $options: 'i' } },
      ];
    }

    const [registrations, total] = await Promise.all([
      Registration.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Registration.countDocuments(filter),
    ]);

    return NextResponse.json({ registrations, total, page, limit });
  } catch (err) {
    console.error('[GET /api/registrations]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
