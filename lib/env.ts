export function getEnvValue(name: string): string | null {
  const value = process.env[name]

  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function hasEnvValue(name: string): boolean {
  return getEnvValue(name) !== null
}

export function requireEnvValue(name: string): string {
  const value = getEnvValue(name)

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}
