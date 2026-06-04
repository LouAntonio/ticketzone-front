import { Outlet } from 'react-router-dom'
import { useScrollToTop } from '../hooks/useScrollToTop'

export function RootLayout() {
	useScrollToTop()
	return <Outlet />
}
