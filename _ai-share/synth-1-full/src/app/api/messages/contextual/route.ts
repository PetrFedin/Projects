import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateGlobalRuntime } from '@/lib/server/global-runtime-singleton';

export interface ContextualMessage {
  id: string;
  contextType: string;
  contextId: string;
  message: string;
  createdAt: string;
  sender: string;
}

const MESSAGES_RUNTIME_KEY = Symbol.for('synth.contextual_messages');

function getMessagesStore(): ContextualMessage[] {
  return getOrCreateGlobalRuntime(MESSAGES_RUNTIME_KEY, () => []);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contextType = searchParams.get('contextType');
  const contextId = searchParams.get('contextId');

  if (!contextType || !contextId) {
    return NextResponse.json({ error: 'Missing contextType or contextId' }, { status: 400 });
  }

  const store = getMessagesStore();
  const messages = store.filter((m) => m.contextType === contextType && m.contextId === contextId);

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contextType, contextId, message } = body;

    if (!contextType || !contextId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const store = getMessagesStore();

    // Sanitize message to prevent basic XSS (as per threat model T-13-01)
    const sanitizedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const newMessage: ContextualMessage = {
      id: crypto.randomUUID(),
      contextType,
      contextId,
      message: sanitizedMessage,
      createdAt: new Date().toISOString(),
      sender: 'Current User', // Mock sender
    };

    store.push(newMessage);

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
