import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const [total, pending, confirmed, cancelled, bySubject, byCourse] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'pending' }),
      Registration.countDocuments({ status: 'confirmed' }),
      Registration.countDocuments({ status: 'cancelled' }),
      Registration.aggregate([{ $group: { _id: '$subject', count: { $sum: 1 } } }]),
      Registration.aggregate([{ $group: { _id: '$courseName', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);

    return NextResponse.json({ total, pending, confirmed, cancelled, bySubject, byCourse });
  } catch (err) {
    console.error('[GET /api/admin/stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
