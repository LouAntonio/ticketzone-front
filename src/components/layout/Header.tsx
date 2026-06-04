import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useState } from 'react'

export function Header() {
	const { user, isOrganizer, clear } = useAuthStore()
	const navigate = useNavigate()
	const [menuOpen, setMenuOpen] = useState(false)

	const handleLogout = () => {
		clear()
		navigate('/')
	}

	return (
		<header className="sticky top-0 z-40 bg-surface-card/90 backdrop-blur-md border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2">
						<div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
							<span className="text-white font-display text-lg leading-none">T</span>
						</div>
						<span className="font-display text-2xl tracking-wide text-text hidden sm:block">
							TicketZone
						</span>
					</Link>

					{/* Nav */}
					<nav className="hidden md:flex items-center gap-8">
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
						{user ? (
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
						) : null}
					</nav>

					{/* Auth */}
					<div className="flex items-center gap-3">
						{user ? (
							<div className="relative">
								<button
									onClick={() => setMenuOpen(!menuOpen)}
									className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center">
										<span className="text-sm font-heading font-700 text-brand">
											{user.name.charAt(0).toUpperCase()}
										</span>
									</div>
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
										<div className="absolute right-0 top-full mt-2 w-56 card p-2 z-20 shadow-lg slide-up">
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

					{/* Mobile menu button */}
					<button
						className="md:hidden p-2 text-text-secondary"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path
								d="M4 6h16M4 12h16M4 18h16"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</header>
	)
}
