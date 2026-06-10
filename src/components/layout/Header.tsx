import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { authApi } from '../../api/endpoints/auth'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

export function Header() {
	const { user, isOrganizer, clear } = useAuthStore()
	const navigate = useNavigate()
	const [menuOpen, setMenuOpen] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleLogout = async () => {
		try {
			const refreshToken = useAuthStore.getState().refreshToken
			if (refreshToken) {
				await authApi.logout({ refreshToken })
			}
		} catch {
			// remote logout optional — proceed with local cleanup
		}
		clear()
		toast.success('Sessão encerrada')
		navigate('/')
	}

	return (
		<header className="sticky top-0 z-40 bg-surface-card/90 backdrop-blur-md border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 gap-4">
					{/* Logo */}
					<Link to="/" className="flex items-center shrink-0">
						<img src="/logo.png" alt="TicketZone" className="h-9 w-auto" />
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center justify-center gap-8 flex-1">
						<Link
							to="/events"
							className="text-sm font-heading font-500 text-text-secondary hover:text-text transition-colors"
						>
							Eventos
						</Link>
						<Link
							to="/rentals"
							className="text-sm font-heading font-500 text-text-secondary hover:text-text transition-colors"
						>
							Rent-a-Car
						</Link>
						<Link
							to="/como-funciona"
							className="text-sm font-heading font-500 text-text-secondary hover:text-text transition-colors"
						>
							Como Funciona
						</Link>
						<Link
							to="/contacto"
							className="text-sm font-heading font-500 text-text-secondary hover:text-text transition-colors"
						>
							Contacto
						</Link>
						{user && (
							<>
								<Link
									to="/account"
									className="text-sm font-heading font-500 text-text-secondary hover:text-text transition-colors"
								>
									Os Meus Bilhetes
								</Link>
								{isOrganizer() && (
									<Link
										to="/organizer"
										className="text-sm font-heading font-500 text-brand hover:text-brand-dark transition-colors"
									>
										Painel Organizador
									</Link>
								)}
							</>
						)}
					</nav>

					{/* Desktop Auth + Hamburger */}
					<div className="flex items-center gap-3">
						{/* Desktop auth */}
						<div className="hidden md:flex items-center gap-3">
							{user ? (
								<div className="relative">
									<button
										onClick={() => setMenuOpen(!menuOpen)}
										className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
									>
										<img
											src={user.image || '/user.png'}
											alt={user.name}
											className="w-8 h-8 rounded-full object-cover"
										/>
										<span className="hidden sm:block text-sm font-heading font-500">
											{user.name.split(' ')[0]}
										</span>
										<svg
											width="12"
											height="12"
											viewBox="0 0 12 12"
											fill="none"
											className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
										>
											<path
												d="M3 4.5l3 3 3-3"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>

									{menuOpen && (
										<>
											<div
												className="fixed inset-0 z-10"
												onClick={() => setMenuOpen(false)}
											/>
											<div className="absolute right-0 top-full mt-2 w-56 card p-2 z-20 shadow-lg scale-in-y">
												<div className="px-3 py-2 border-b border-border mb-1">
													<p className="text-sm font-heading font-600">
														{user.name}
													</p>
													<p className="text-xs text-text-secondary">
														{user.email}
													</p>
												</div>
												<Link
													to="/account"
													onClick={() => setMenuOpen(false)}
													className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
												>
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
													>
														<circle
															cx="8"
															cy="5"
															r="3"
															stroke="currentColor"
															strokeWidth="1.5"
														/>
														<path
															d="M2 14c0-3 2.7-5 6-5s6 2 6 5"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
														/>
													</svg>
													Minha Conta
												</Link>
												{isOrganizer() && (
													<Link
														to="/organizer"
														onClick={() => setMenuOpen(false)}
														className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
													>
														<svg
															width="16"
															height="16"
															viewBox="0 0 16 16"
															fill="none"
														>
															<rect
																x="2"
																y="3"
																width="12"
																height="10"
																rx="1.5"
																stroke="currentColor"
																strokeWidth="1.5"
															/>
															<path
																d="M5 7h6M5 10h4"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
															/>
														</svg>
														Dashboard
													</Link>
												)}
												<button
													onClick={handleLogout}
													className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full mt-1"
												>
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
													>
														<path
															d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													Sair
												</button>
											</div>
										</>
									)}
								</div>
							) : (
								<>
									<Link to="/login" className="btn-ghost text-sm h-10 px-4">
										Entrar
									</Link>
									<Link to="/register" className="btn-brand text-sm h-10 px-5">
										Criar Conta
									</Link>
								</>
							)}
						</div>

						{/* Hamburger */}
						<button
							className="md:hidden relative z-50 p-2 text-text-secondary hover:text-text transition-colors"
							onClick={() => setMobileOpen(!mobileOpen)}
							aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								className="transition-transform duration-200"
							>
								{mobileOpen ? (
									<path
										d="M6 6l12 12M18 6l-12 12"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								) : (
									<>
										<path
											d="M4 6h16M4 12h16M4 18h16"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</>
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Drawer */}
			{mobileOpen && (
				<>
					<div
						className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
						onClick={() => setMobileOpen(false)}
					/>
					<div className="absolute top-full left-0 right-0 bg-surface-card border-b border-border shadow-lg z-40 md:hidden slide-up">
						<div className="px-4 py-4 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
							{/* Nav links */}
							<Link
								to="/events"
								onClick={() => setMobileOpen(false)}
								className="flex items-center gap-3 px-3 py-3 text-sm font-heading font-500 text-text-secondary hover:text-text hover:bg-surface rounded-xl transition-colors"
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
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								Eventos
							</Link>
							<Link
								to="/rentals"
								onClick={() => setMobileOpen(false)}
								className="flex items-center gap-3 px-3 py-3 text-sm font-heading font-500 text-text-secondary hover:text-text hover:bg-surface rounded-xl transition-colors"
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
									<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<line x1="16" y1="13" x2="8" y2="13" />
									<line x1="16" y1="17" x2="8" y2="17" />
									<polyline points="10 9 9 9 8 9" />
								</svg>
								Rent-a-Car
							</Link>
							<Link
								to="/como-funciona"
								onClick={() => setMobileOpen(false)}
								className="flex items-center gap-3 px-3 py-3 text-sm font-heading font-500 text-text-secondary hover:text-text hover:bg-surface rounded-xl transition-colors"
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
									<circle cx="12" cy="12" r="10" />
									<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
									<line x1="12" y1="17" x2="12.01" y2="17" />
								</svg>
								Como Funciona
							</Link>
							<Link
								to="/contacto"
								onClick={() => setMobileOpen(false)}
								className="flex items-center gap-3 px-3 py-3 text-sm font-heading font-500 text-text-secondary hover:text-text hover:bg-surface rounded-xl transition-colors"
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
									<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
									<polyline points="22,6 12,13 2,6" />
								</svg>
								Contacto
							</Link>

							{/* Logged-in account links */}
							{user && (
								<>
									<div className="h-px bg-border my-2" />
									<Link
										to="/account"
										onClick={() => setMobileOpen(false)}
										className="flex items-center gap-3 px-3 py-3 text-sm font-heading font-500 text-text-secondary hover:text-text hover:bg-surface rounded-xl transition-colors"
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
											<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</svg>
										Minha Conta
									</Link>
									{isOrganizer() && (
										<Link
											to="/organizer"
											onClick={() => setMobileOpen(false)}
											className="flex items-center gap-3 px-3 py-3 text-sm font-heading font-500 text-brand hover:bg-brand-soft rounded-xl transition-colors"
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
												<rect x="3" y="3" width="7" height="7" />
												<rect x="14" y="3" width="7" height="7" />
												<rect x="14" y="14" width="7" height="7" />
												<rect x="3" y="14" width="7" height="7" />
											</svg>
											Painel Organizador
										</Link>
									)}
								</>
							)}

							{/* Auth buttons - sticky bottom area */}
							<div className="mt-4 pt-4 border-t border-border">
								{user ? (
									<div className="space-y-3">
										<div className="px-3 py-2">
											<p className="text-sm font-heading font-600 text-text">
												{user.name}
											</p>
											<p className="text-xs text-text-secondary">
												{user.email}
											</p>
										</div>
										<button
											onClick={() => {
												handleLogout()
												setMobileOpen(false)
											}}
											className="flex items-center justify-center gap-3 w-full px-4 py-3 text-sm font-heading font-500 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
												<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
												<polyline points="16 17 21 12 16 7" />
												<line x1="21" y1="12" x2="9" y2="12" />
											</svg>
											Sair
										</button>
									</div>
								) : (
									<div className="flex gap-3">
										<Link
											to="/login"
											onClick={() => setMobileOpen(false)}
											className="flex-1 btn-ghost text-sm h-12 justify-center rounded-xl"
										>
											Entrar
										</Link>
										<Link
											to="/register"
											onClick={() => setMobileOpen(false)}
											className="flex-1 btn-brand text-sm h-12 justify-center rounded-xl"
										>
											Criar Conta
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</header>
	)
}
