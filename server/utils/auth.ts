export const generateSessionId = () => {
  return crypto.randomUUID()
}

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const hash = await hashPassword(password)
    return hash === hashedPassword
  } catch {
    return false
  }
}
