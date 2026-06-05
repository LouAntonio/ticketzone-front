import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'

const navItems = [
	{
		to: '/admin',
		end: true,
		label: 'Dashboard',
		icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
	},
	{
		to: '/admin/users',
		label: 'Utilizadores',
		icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
	},
	{
		to: '/admin/events',
		label: 'Eventos',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
	},
	{
		to: '/admin/orders',
		label: 'Encomendas',
		icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
	},
	{
		to: '/admin/organizers',
		label: 'Organizadores',
		icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
	},
	{
		to: '/admin/financial',
		label: 'Financeiro',
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
	},
	{
		to: '/admin/fleet',
		label: 'Frota',
		icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 0l2 1m-2-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4M6 16m-2 0h2M6 16H4m2 0l2-1m-2 1l-2 1m8-1l-2-1m2 1l2 1',
	},
]

export function AdminLayout() {
	const user = useAuthStore((s) => s.user)

	return (
		<div className="min-h-screen flex flex-col bg-[#121212]">
			{/* Header */}
			<header className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-6 shrink-0">
				<Link to="/admin" className="flex items-center gap-3">
					<span className="font-display text-xl tracking-wider text-white">
						TICKET<span className="text-brand">ZONE</span>
					</span>
					<span className="px-2 py-0.5 rounded-md bg-brand/20 text-brand text-xs font-heading font-600">
						ADMIN
					</span>
				</Link>
				<div className="ml-auto flex items-center gap-4">
					<Link
						to="/"
						className="text-sm text-gray-400 hover:text-white transition-colors font-heading"
					>
						Ver Site
					</Link>
					<div className="flex items-center gap-3 pl-4 border-l border-[#2a2a2a]">
						<div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-heading font-700 text-xs">
							{user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
						</div>
						<div className="hidden sm:block">
							<p className="text-sm text-white font-heading font-600 leading-tight">
								{user?.name}
							</p>
							<p className="text-xs text-gray-500">Administrador</p>
						</div>
					</div>
				</div>
			</header>

			<div className="flex-1 flex">
				{/* Sidebar */}
				<aside className="hidden lg:flex flex-col w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] shrink-0">
					<nav className="flex-1 p-3 space-y-1">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								end={item.end}
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-heading font-500 transition-all ${
										isActive
											? 'bg-brand text-white shadow-lg shadow-brand/20'
											: 'text-gray-400 hover:bg-[#252525] hover:text-white'
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
									<path d={item.icon} />
								</svg>
								{item.label}
							</NavLink>
						))}
					</nav>
				</aside>

				{/* Content */}
				<div className="flex-1 min-w-0 overflow-auto">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
