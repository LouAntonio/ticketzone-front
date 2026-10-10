export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ?? window.location.origin

export const IS_DEVELOPMENT = import.meta.env.DEV

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
