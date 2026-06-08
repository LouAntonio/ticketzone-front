import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { Skeleton } from '../components/ui/Skeleton'

export function RedirectIfAuthenticated() {
	const hydrated = useAuthStore.persist.hasHydrated()
	const token = useAuthStore((s) => s.token)

	if (!hydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Skeleton className="w-12 h-12 rounded-xl" />
					<Skeleton className="h-4 w-40" />
				</div>
			</div>
		)
	}

	if (token) {
		return <Navigate to="/account" replace />
	}

	return <Outlet />
}
