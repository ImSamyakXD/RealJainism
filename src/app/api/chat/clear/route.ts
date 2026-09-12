import { NextResponse } from 'next/server';

const RAG_BACKEND_URL = process.env.RAG_BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST() {
  try {
    try {
      const response = await fetch(`${RAG_BACKEND_URL}/clear-memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message || 'Memory cleared' });
      }
    } catch (e) {
      console.warn('Backend clear memory unreachable:', e);
    }

    return NextResponse.json({ message: 'Local memory cleared' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to clear memory' },
      { status: 500 }
    );
  }
}
