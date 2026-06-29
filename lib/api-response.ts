import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      ok: true,
      data,
    },
    init
  )
}

export function apiError(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  )
}
