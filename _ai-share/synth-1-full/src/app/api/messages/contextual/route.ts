import { NextRequest, NextResponse } from 'next/server';
import {
  appendWorkshop2ContextualMessage,
  listWorkshop2ContextualMessages,
} from '@/lib/server/workshop2-contextual-messages-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

export interface ContextualMessage {
  id: string;
  contextType: string;
  contextId: string;
  message: string;
  createdAt: string;
  sender: string;
}

export async function GET(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const contextType = searchParams.get('contextType');
  const contextId = searchParams.get('contextId');

  if (!contextType || !contextId) {
    return NextResponse.json({ error: 'Missing contextType or contextId' }, { status: 400 });
  }

  const records = await listWorkshop2ContextualMessages({ contextType, contextId });
  const messages: ContextualMessage[] = records.map((m) => ({
    id: m.id,
    contextType: m.contextType,
    contextId: m.contextId,
    message: m.message,
    createdAt: m.createdAt,
    sender: m.sender,
  }));

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = (await request.json()) as {
      contextType?: string;
      contextId?: string;
      message?: string;
    };
    const { contextType, contextId, message } = body;

    if (!contextType || !contextId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await appendWorkshop2ContextualMessage({
      contextType: String(contextType),
      contextId: String(contextId),
      message: String(message),
      headers: request.headers,
      isSystem: false,
    });

    const newMessage: ContextualMessage = {
      id: record.id,
      contextType: record.contextType,
      contextId: record.contextId,
      message: record.message,
      createdAt: record.createdAt,
      sender: record.sender,
    };

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
