import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '@/lib/auth';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get progress for all lessons
export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', session.userId);

    if (error) throw error;

    return NextResponse.json({ progress: data });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update lesson progress
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { moduleSlug, lessonSlug, status } = await req.json();

    // Validate status
    const validStatuses = ['not_started', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          user_id: session.userId,
          module_slug: moduleSlug,
          lesson_slug: lessonSlug,
          status, // Directly set the status
          completed_at:
            status === 'completed' ? new Date().toISOString() : null,
        },
        {
          onConflict: 'user_id,module_slug,lesson_slug',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ progress: data });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
