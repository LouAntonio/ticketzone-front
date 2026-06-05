import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export function AdminRoute() {
	const token = useAuthStore((s) => s.token)
	const user = useAuthStore((s) => s.user)

	if (!token) {
		return <Navigate to="/login" replace />
	}

	if (user?.role !== 'admin') {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}
