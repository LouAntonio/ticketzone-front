import { Navigate, Outlet } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '../stores/useAuthStore'
import { Skeleton } from '../components/ui/Skeleton'

export function AdminRoute() {
	const hydrated = useAuthStore.persist.hasHydrated()
	const { token, user } = useAuthStore(useShallow((s) => ({ token: s.token, user: s.user })))

	if (!hydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#121212]">
				<div className="flex flex-col items-center gap-4">
					<Skeleton variant="dark" className="w-12 h-12 rounded-xl" />
					<Skeleton variant="dark" className="h-4 w-40" />
				</div>
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
