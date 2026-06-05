import { Navigate, Outlet } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '../stores/useAuthStore'
import { Spinner } from '../components/ui/Spinner'

export function AdminRoute() {
	const hydrated = useAuthStore.persist.hasHydrated()
	const { token, user } = useAuthStore(useShallow((s) => ({ token: s.token, user: s.user })))

	if (!hydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#121212]">
				<Spinner size="lg" />
			</div>
		)
	}

	if (!token) {
		return <Navigate to="/login" replace />
	}

	if (user?.role !== 'admin') {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}
