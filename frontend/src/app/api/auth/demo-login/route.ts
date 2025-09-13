import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Demo authentication - simplified as per problem statement
    if (email !== 'demo@esahayak.com' || password.length < 3) {
      return NextResponse.json(
        { error: 'Invalid credentials. Use demo@esahayak.com with any password (3+ chars)' },
        { status: 401 }
      );
    }

    // Return demo user data
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'demo@esahayak.com',
      name: 'Demo User',
      isAdmin: false,
    };

    // Generate a simple token for demo purposes
    const token = `demo-token-${Date.now()}`;

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
