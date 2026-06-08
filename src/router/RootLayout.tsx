import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { setNavigate } from '../lib/navigate'

export function RootLayout() {
	const navigate = useNavigate()

	useEffect(() => {
		setNavigate(navigate)
	}, [navigate])

	useScrollToTop()
	return <Outlet />
}
