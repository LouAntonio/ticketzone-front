import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { usePageTitle } from '../../hooks/usePageTitle'

const contactMethods = [
	{
		id: 'email',
		icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		label: 'Email',
		value: 'geral@ticketzone.co.ao',
		href: 'mailto:geral@ticketzone.co.ao',
		color: 'bg-brand-soft text-brand',
	},
	{
		id: 'phone',
		icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
		label: 'Telefone',
		value: '+244 900 000 000',
		href: 'tel:+244900000000',
		color: 'bg-brand/10 text-brand-dark',
	},
	{
		id: 'whatsapp',
		icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
		label: 'WhatsApp',
		value: 'Fala connosco',
		href: 'https://wa.me/244900000000',
		color: 'bg-green-50 text-green-700',
		badge: 'Resposta rápida',
	},
	{
		id: 'location',
		icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z',
		label: 'Morada',
		value: 'Luanda, Angola',
		href: 'https://maps.google.com/?q=Luanda+Angola',
		color: 'bg-brand-soft text-brand',
	},
]

const socialLinks = [
	{
		name: 'Facebook',
		url: '#',
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
				<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
			</svg>
		),
	},
	{
		name: 'Instagram',
		url: '#',
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
				<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
			</svg>
		),
	},
	{
		name: 'TikTok',
		url: '#',
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
				<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
			</svg>
		),
	},
	{
		name: 'WhatsApp',
		url: 'https://wa.me/244900000000',
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
			</svg>
		),
	},
]

export function Contacto() {
	usePageTitle('Contacto | TicketZone')

	const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
	const [sending, setSending] = useState(false)

	const updateField = (field: string, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
			toast.error('Por favor, preenche todos os campos obrigatórios.')
			return
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			toast.error('Insere um email válido.')
			return
		}

		setSending(true)
		await new Promise((r) => setTimeout(r, 1500))
		setSending(false)
		toast.success('Mensagem enviada com sucesso! Entraremos em contacto brevemente.')
		setForm({ name: '', email: '', subject: '', message: '' })
	}

	return (
		<div>
			<section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div className="absolute inset-0 pattern-diamonds opacity-[0.15]" />
				<div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
				<div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-white/5 blur-3xl" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
					<div className="relative">
						<span className="font-display text-[18rem] sm:text-[24rem] text-white/5 leading-none select-none absolute -top-36 -right-8 sm:-top-44 sm:-right-12 pointer-events-none">
							@
						</span>
						<div className="relative max-w-3xl">
							<h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-white mb-5 leading-none slide-up">
								Entre em
								<br />
								Contacto
							</h1>
							<div className="w-20 h-1 bg-white/40 rounded-full mb-5 slide-up" />
							<p
								className="text-white/70 text-lg sm:text-xl max-w-2xl slide-up"
								style={{ animationDelay: '100ms' }}
							>
								Tem alguma pergunta, sugestão ou precisa de ajuda? Estamos aqui para
								si. Escolha o canal que preferir.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex items-start gap-5 mb-12 slide-up">
					<div className="w-1.5 h-12 bg-brand rounded-full shrink-0" />
					<div>
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em]">
							Fala Connosco
						</span>
						<h2 className="font-display text-4xl sm:text-5xl text-text mt-2 leading-none">
							Escolhe o método
							<br />
							que preferires
						</h2>
					</div>
				</div>

				<div className="grid lg:grid-cols-12 gap-5">
					<div className="lg:col-span-7 self-start">
						<a
							href={contactMethods[2].href}
							target="_blank"
							rel="noopener noreferrer"
							className="group block bg-surface-card rounded-3xl p-8 sm:p-10 border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 slide-up"
							style={{ animationDelay: '60ms' }}
						>
							<div className="flex items-start gap-5">
								<div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
									<svg
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="text-green-700"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
									</svg>
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-3 flex-wrap mb-1">
										<span className="font-heading font-700 text-lg">
											WhatsApp
										</span>
										<span className="text-xs font-heading font-600 bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
											Resposta rápida
										</span>
									</div>
									<p className="text-text-secondary text-sm mb-2">
										O canal mais rápido. Fala connosco diretamente pelo
										WhatsApp.
									</p>
									<span className="text-brand font-heading font-600 text-sm group-hover:underline inline-flex items-center gap-1">
										+244 900 000 000
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="transition-transform group-hover:translate-x-0.5"
										>
											<path d="M7 17l9.2-9.2M17 17V7H7" />
										</svg>
									</span>
								</div>
							</div>
						</a>
					</div>

					<div className="lg:col-span-5 flex flex-col gap-5">
						{[contactMethods[0], contactMethods[1]].map((method, i) => (
							<a
								key={method.id}
								href={method.href}
								className="group block bg-surface-card rounded-2xl p-6 border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 slide-up"
								style={{ animationDelay: `${100 + i * 60}ms` }}
							>
								<div className="flex items-center gap-4">
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${method.color}`}
									>
										<svg
											width="22"
											height="22"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d={method.icon} />
										</svg>
									</div>
									<div className="min-w-0">
										<p className="text-xs font-heading font-600 text-text-secondary uppercase tracking-wider mb-0.5">
											{method.label}
										</p>
										<p className="font-heading font-500 text-text group-hover:text-brand transition-colors truncate">
											{method.value}
										</p>
									</div>
								</div>
							</a>
						))}
						<a
							href={contactMethods[3].href}
							target="_blank"
							rel="noopener noreferrer"
							className="group block bg-surface-card rounded-2xl p-6 border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 slide-up"
							style={{ animationDelay: '220ms' }}
						>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 text-brand">
									<svg
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d={contactMethods[3].icon} />
									</svg>
								</div>
								<div className="min-w-0">
									<p className="text-xs font-heading font-600 text-text-secondary uppercase tracking-wider mb-0.5">
										{contactMethods[3].label}
									</p>
									<p className="font-heading font-500 text-text group-hover:text-brand transition-colors truncate">
										{contactMethods[3].value}
									</p>
								</div>
							</div>
						</a>
					</div>
				</div>
			</section>

			<section className="bg-surface-card border-y border-border py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 slide-up">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em]">
							Redes Sociais
						</span>
						<h2 className="font-display text-4xl sm:text-5xl text-text mt-2 leading-none">
							Segue-nos
						</h2>
					</div>
					<div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
						{socialLinks.map((social, i) => (
							<a
								key={social.name}
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.name}
								className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl bg-surface hover:bg-brand hover:text-white transition-all duration-300 min-w-[120px] sm:min-w-[140px] slide-up"
								style={{ animationDelay: `${i * 80}ms` }}
							>
								<div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									{social.icon}
								</div>
								<span className="font-heading font-600 text-sm">{social.name}</span>
							</a>
						))}
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-12 gap-10 items-start">
					<div className="lg:col-span-7 slide-up">
						<div className="flex items-start gap-5 mb-8">
							<div className="w-1.5 h-10 bg-brand rounded-full shrink-0" />
							<div>
								<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em]">
									Envia-nos uma mensagem
								</span>
								<h2 className="font-display text-4xl sm:text-5xl text-text mt-2 leading-none">
									Fala
									<br />
									Connosco
								</h2>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label
									htmlFor="contact-name"
									className="block text-sm font-heading font-600 text-text mb-1.5"
								>
									Nome <span className="text-brand">*</span>
								</label>
								<input
									id="contact-name"
									type="text"
									value={form.name}
									onChange={(e) => updateField('name', e.target.value)}
									placeholder="O teu nome"
									className="input-field"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="contact-email"
									className="block text-sm font-heading font-600 text-text mb-1.5"
								>
									Email <span className="text-brand">*</span>
								</label>
								<input
									id="contact-email"
									type="email"
									value={form.email}
									onChange={(e) => updateField('email', e.target.value)}
									placeholder="teu@email.com"
									className="input-field"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="contact-subject"
									className="block text-sm font-heading font-600 text-text mb-1.5"
								>
									Assunto
								</label>
								<input
									id="contact-subject"
									type="text"
									value={form.subject}
									onChange={(e) => updateField('subject', e.target.value)}
									placeholder="Assunto da mensagem"
									className="input-field"
								/>
							</div>
							<div>
								<label
									htmlFor="contact-message"
									className="block text-sm font-heading font-600 text-text mb-1.5"
								>
									Mensagem <span className="text-brand">*</span>
								</label>
								<textarea
									id="contact-message"
									value={form.message}
									onChange={(e) => updateField('message', e.target.value)}
									placeholder="Escreve a tua mensagem aqui..."
									rows={5}
									className="input-field resize-y min-h-[120px]"
									required
								/>
							</div>
							<button
								type="submit"
								disabled={sending}
								className="btn-brand h-12 px-8 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{sending ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4"
											viewBox="0 0 24 24"
											fill="none"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											/>
										</svg>
										A enviar...
									</>
								) : (
									'Enviar Mensagem'
								)}
							</button>
						</form>
					</div>

					<div
						className="lg:col-span-5 lg:sticky lg:top-24 slide-up"
						style={{ animationDelay: '120ms' }}
					>
						<div className="bg-brand rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
							<div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
							<div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
							<div className="relative">
								<div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
									</svg>
								</div>
								<h3 className="font-display text-2xl sm:text-3xl mb-4">
									Preferes outro método?
								</h3>
								<p className="text-white/70 text-sm leading-relaxed mb-6">
									Se preferes um contacto mais direto, estamos disponíveis através
									dos seguintes canais:
								</p>
								<div className="space-y-4">
									<a
										href="mailto:geral@ticketzone.co.ao"
										className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
											<polyline points="22,6 12,13 2,6" />
										</svg>
										<span className="text-sm font-heading font-500 group-hover:underline">
											geral@ticketzone.co.ao
										</span>
									</a>
									<a
										href="tel:+244900000000"
										className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
										</svg>
										<span className="text-sm font-heading font-500 group-hover:underline">
											+244 900 000 000
										</span>
									</a>
									<a
										href="https://wa.me/244900000000"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
										</svg>
										<span className="text-sm font-heading font-500 group-hover:underline">
											Falar no WhatsApp
										</span>
									</a>
								</div>
								<div className="mt-8 pt-6 border-t border-white/15">
									<p className="text-white/50 text-xs">
										Horário de atendimento: Seg–Sex, 08h–18h
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-surface border-y border-border py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-start gap-5 mb-8 slide-up">
							<div className="w-1.5 h-10 bg-brand rounded-full shrink-0" />
							<div>
								<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em]">
									Onde Estamos
								</span>
								<h2 className="font-display text-4xl sm:text-5xl text-text mt-2 leading-none">
									A Nossa
									<br />
									Localização
								</h2>
							</div>
						</div>
						<div
							className="bg-surface-card rounded-3xl p-8 sm:p-10 border border-border/50 slide-up"
							style={{ animationDelay: '80ms' }}
						>
							<div className="flex flex-col sm:flex-row items-start gap-6">
								<div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center shrink-0">
									<svg
										width="30"
										height="30"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-brand"
									>
										<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
								</div>
								<div className="min-w-0">
									<h3 className="font-heading font-700 text-lg mb-2">
										Luanda, Angola
									</h3>
									<p className="text-text-secondary text-sm leading-relaxed max-w-lg mb-4">
										A nossa sede está localizada em Luanda, de onde gerimos
										todas as operações da TicketZone. Estamos presentes nas 18
										províncias de Angola.
									</p>
									<a
										href="https://maps.google.com/?q=Luanda+Angola"
										target="_blank"
										rel="noopener noreferrer"
										className="btn-outline h-10 px-5 text-xs inline-flex items-center gap-2"
									>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
										</svg>
										Abrir no Google Maps
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div className="absolute inset-0 pattern-diamonds opacity-[0.12]" />
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
					<span className="font-display text-[10rem] sm:text-[14rem] text-white/5 leading-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
						?
					</span>
					<div className="relative">
						<h2 className="font-display text-3xl sm:text-5xl text-white mb-4">
							Vamos trabalhar juntos?
						</h2>
						<p className="text-white/70 max-w-lg mx-auto mb-10">
							Se és organizador de eventos ou tens um projeto entre nós, estamos
							prontos para colaborar.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<a
								href="https://wa.me/244900000000"
								target="_blank"
								rel="noopener noreferrer"
								className="btn bg-white text-text hover:bg-gray-100 h-12 px-8 text-sm font-heading font-700"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
								</svg>
								Falar no WhatsApp
							</a>
							<a
								href="mailto:geral@ticketzone.co.ao"
								className="btn border-2 border-white/25 text-white hover:bg-white/10 h-12 px-8 text-sm font-heading font-700"
							>
								Enviar Email
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
