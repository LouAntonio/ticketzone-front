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
		<div className="min-h-screen flex flex-col bg-surface-dark">
			{/* Warm grain overlay */}
			<div className="fixed inset-0 pointer-events-none grain-overlay opacity-40 z-0" />

			{/* Header */}
			<header className="relative h-16 bg-[#1c1613] border-b-2 border-[#3d3028] flex items-center px-6 shrink-0 z-10">
				<Link to="/admin" className="flex items-center gap-3">
					<div className="w-8 h-8 bg-brand flex items-center justify-center rounded-sm">
						<span className="font-display text-sm text-white">TZ</span>
					</div>
					<span className="font-display text-xl tracking-[0.15em] text-white">
						TICKET<span className="text-brand">ZONE</span>
					</span>
					<span className="px-2 py-0.5 bg-brand/20 text-brand text-[10px] font-heading font-700 uppercase tracking-widest border border-brand/30">
						ADMIN
					</span>
				</Link>
				<div className="ml-auto flex items-center gap-4">
					<Link
						to="/"
						className="text-sm text-[#8a7a6e] hover:text-[#d4c5b8] transition-colors font-heading font-500"
					>
						Ver Site
					</Link>
					<div className="flex items-center gap-3 pl-4 border-l-2 border-[#3d3028]">
						<div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-heading font-700 text-xs ring-2 ring-brand/30">
							{user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
						</div>
						<div className="hidden sm:block">
							<p className="text-sm text-[#d4c5b8] font-heading font-600 leading-tight">
								{user?.name}
							</p>
							<p className="text-[11px] text-[#8a7a6e] font-heading font-500 uppercase tracking-wider">
								Administrador
							</p>
						</div>
					</div>
				</div>
			</header>

			<div className="relative flex-1 flex z-10">
				{/* Sidebar */}
				<aside className="hidden lg:flex flex-col w-64 bg-[#1c1613] border-r-2 border-[#3d3028] shrink-0">
					<nav className="flex-1 p-3 space-y-0.5">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								end={item.end}
								className={({ isActive }) =>
									`flex items-center gap-3 px-4 py-2.5 text-sm font-heading font-500 transition-all duration-150 border-l-2 ${
										isActive
											? 'bg-brand/10 text-brand border-brand shadow-[inset_0_0_20px_-12px_rgba(241,101,34,0.3)]'
											: 'text-[#8a7a6e] border-transparent hover:text-[#d4c5b8] hover:bg-white/[0.03] hover:border-[#8a7a6e]/30'
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
									className="shrink-0"
								>
									<path d={item.icon} />
								</svg>
								{item.label}
							</NavLink>
						))}
					</nav>

					{/* Footer */}
					<div className="p-4 border-t-2 border-[#3d3028]">
						<div className="text-[10px] text-[#6a5a4e] font-heading font-500 uppercase tracking-widest">
							Ticketzone v1.0
						</div>
					</div>
				</aside>

				{/* Mobile bottom nav */}
				<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1c1613] border-t-2 border-[#3d3028] flex z-20 overflow-x-auto scrollbar-hide">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`flex flex-col items-center gap-0.5 px-3 py-2 min-w-[64px] text-[10px] font-heading font-500 transition-colors ${
									isActive ? 'text-brand' : 'text-[#6a5a4e]'
								}`
							}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d={item.icon} />
							</svg>
							<span>{item.label}</span>
						</NavLink>
					))}
				</nav>

				{/* Content */}
				<div className="flex-1 min-w-0 overflow-auto pb-16 lg:pb-0">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
