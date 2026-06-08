import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { GOOGLE_CLIENT_ID, USE_MOCK, IS_DEVELOPMENT } from './lib/env'
import './index.css'

async function startApp() {
	if (USE_MOCK) {
		try {
			const { worker } = await import('./api/mock/browser')
			await worker.start({
				onUnhandledRequest: 'bypass',
				quiet: !IS_DEVELOPMENT,
				waitUntilReady: false,
			})
		} catch (error) {
			console.error('[MSW] Falha ao iniciar mock:', error)
		}
	}

	createRoot(document.getElementById('root')!).render(
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<App />
		</GoogleOAuthProvider>,
	)
}

startApp()
