import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/getServerUser';

export async function GET() {
  try {
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
