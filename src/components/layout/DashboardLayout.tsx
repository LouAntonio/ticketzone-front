import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { authApi } from '../../api/endpoints/auth'
import { Header } from './Header'

type SidebarLink = {
	to: string
	label: string
	icon: string
	end?: boolean
}

const buyerLinks: SidebarLink[] = [
	{
		to: '/account',
		label: 'Dashboard',
		end: true,
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
	},
	{
		to: '/account/tickets',
		label: 'Os Meus Bilhetes',
		icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
	},
	{
		to: '/account/orders',
		label: 'As Minhas Compras',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
	},
	{
		to: '/account/profile',
		label: 'Perfil',
		icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
	},
	{
		to: '/account/security',
		label: 'Segurança',
		icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
	},
]

const organizerLinks: SidebarLink[] = [
	{
		to: '/organizer',
		label: 'Dashboard',
		end: true,
		icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
	},
	{
		to: '/organizer/events',
		label: 'Eventos',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
	},
	{
		to: '/organizer/attendees',
		label: 'Participantes',
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
	},
	{
		to: '/organizer/settings',
		label: 'Definições',
		icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
	},
]

export function DashboardLayout() {
	const user = useAuthStore((s) => s.user)
	const setUser = useAuthStore((s) => s.setUser)

	useEffect(() => {
		if (!user?.emailVerified && user?.id) {
			authApi
				.me()
				.then((fullUser) => {
					if (fullUser) setUser(fullUser)
				})
				.catch(() => {})
		}
	}, [user?.id, user?.emailVerified, setUser])

	const isOrg = user?.role === 'PROMOTER'
	const links = isOrg ? organizerLinks : buyerLinks

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex-1 flex">
				{/* Sidebar */}
				<aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface-card/50 shrink-0">
					<nav className="flex-1 p-4 space-y-1">
						{links.map((link) => (
							<NavLink
								key={link.to}
								to={link.to}
								end={link.end}
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-500 transition-all ${
										isActive
											? 'bg-brand-soft text-brand font-600'
											: 'text-text-secondary hover:bg-gray-50 hover:text-text'
									}`
								}
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d={link.icon} />
								</svg>
								{link.label}
							</NavLink>
						))}
					</nav>

					{/* Quick validation link */}
					{isOrg && (
						<div className="p-4 border-t border-border">
							<NavLink
								to="/validate"
								className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-500 bg-brand text-white hover:bg-brand-dark transition-colors"
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 4v16m-8-8h16" />
								</svg>
								Validar Bilhetes
							</NavLink>
						</div>
					)}
				</aside>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
