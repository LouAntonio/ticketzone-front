export function parseJwt(token: string): Record<string, unknown> | null {
	try {
		const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
		if (!base64) return null
		return JSON.parse(atob(base64))
	} catch {
		return null
	}
}
