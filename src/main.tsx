import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { GOOGLE_CLIENT_ID, USE_MOCK } from './lib/env'
import './index.css'

async function startApp() {
	// Only start MSW in development or when VITE_USE_MOCK=true
	if (import.meta.env.DEV || USE_MOCK) {
		const { worker } = await import('./api/mock/browser')
		await worker.start({
			onUnhandledRequest: 'bypass',
			quiet: true,
		})
	}

	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
				<App />
			</GoogleOAuthProvider>
		</StrictMode>,
	)
}

startApp()
