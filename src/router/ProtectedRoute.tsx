import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { Spinner } from '../components/ui/Spinner'

export function ProtectedRoute() {
	const hydrated = useAuthStore.persist.hasHydrated()
	const token = useAuthStore((s) => s.token)
	const location = useLocation()

	if (!hydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spinner size="lg" />
			</div>
		)
	}

	if (!token) {
		return <Navigate to="/login" state={{ from: location }} replace />
	}

	return <Outlet />
}
