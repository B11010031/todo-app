import { NextRequest, NextResponse } from 'next/server';
import { getTask, updateTask, deleteTask, completeSubTasks } from '@/lib/notion';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = await getTask(params.id);
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    // If marking done, complete subtasks too
    if (body.status === 'done' && body.subTaskIds?.length) {
      await completeSubTasks(body.subTaskIds);
    }
    await updateTask(params.id, body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteTask(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
