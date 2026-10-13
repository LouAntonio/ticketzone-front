import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReactQRCode } from '@lglab/react-qr-code'
import { api } from '../../api/client'
import '../../styles/invitation.css'

export interface Invitation {
	event: {
		title: string
		description: string
		bannerUrl: string | null
		startDate: string
		endDate: string
		location: string
		venue: string | null
		address: string | null
		province: string
		organizer: string
	}
	guest: { name: string; partySize: number }
	ticket: {
		code: string
		status: string
		entriesUsed: number
		entriesAllowed: number
		/** Segredo real do QR — é por ele que `verifyQrCode` localiza o bilhete. */
		qrSecret: string
		qrExpiresAt: string
	}
}

async function loadInvitation(token: string): Promise<Invitation> {
	const response = await api.get<Invitation>(`/invitations/${token}`)
	return response.data
}

/** Igual ao TTL de `rotateQrCode`: 60 segundos. */
async function rotateInvitationQr(
	token: string,
): Promise<{ qrSecret: string; qrExpiresAt: string }> {
	// O interceptor do axios já desembrulha `{ success, msg, data }`.
	const response = await api.post<{ qrSecret: string; qrExpiresAt: string }>(
		`/invitations/${token}/rotate-qr`,
	)
	return response.data
}

function formatDay(iso: string): string {
	return new Date(iso).toLocaleDateString('pt-PT', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

function formatHour(iso: string): string {
	return new Date(iso).toLocaleTimeString('pt-PT', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

const STATUS_TEXT: Record<string, string> = {
	ACTIVE: 'Bilhete activo',
	USED: 'Bilhete usado',
	VOIDED: 'Bilhete anulado',
	CANCELLED: 'Bilhete cancelado',
}

/**
 * Convite pessoal a um evento privado.
 *
 * Fica fora do `PublicLayout` de propósito: não há header, nem catálogo, nem
 * login. Quem chega aqui chega por um link que recebeu, e a única coisa que
 * precisa de fazer é confirmar que vem e guardar o bilhete.
 */
export function InvitationPage() {
	const { token } = useParams<{ token: string }>()
	const [flipped, setFlipped] = useState(false)

	const { data, isLoading, isError } = useQuery({
		queryKey: ['invitation', token],
		queryFn: () => loadInvitation(token as string),
		enabled: Boolean(token),
		retry: false,
	})

	// O QR vive 60 segundos. Mantemos um relógio e renovamos ao expirar, tal
	// como `MyTickets` faz com os bilhetes de um comprador — assim um print do
	// ecrã deixa de servir mal passa um minuto.
	//
	// `renewed` só guarda a última rotação; sem ele o valor vem do convite.
	// Assim não é preciso sincronizar estado dentro de um efeito.
	const [renewed, setRenewed] = useState<{
		qrSecret: string
		qrExpiresAt: string
	} | null>(null)
	const [now, setNow] = useState(() => Date.now())
	const rotating = useRef(false)

	const qr = useMemo<{ qrSecret: string; qrExpiresAt: string } | null>(
		() =>
			renewed ??
			(data
				? { qrSecret: data.ticket.qrSecret, qrExpiresAt: data.ticket.qrExpiresAt }
				: null),
		[renewed, data],
	)

	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(id)
	}, [])

	useEffect(() => {
		if (!qr || !token) return
		if (now < new Date(qr.qrExpiresAt).getTime()) return
		if (rotating.current) return

		rotating.current = true
		rotateInvitationQr(token)
			.then((next) => {
				setRenewed(next)
				setNow(Date.now())
			})
			.catch(() => {
				/* Sem rede: o QR expira e volta quando houver ligação. */
			})
			.finally(() => {
				rotating.current = false
			})
	}, [now, qr, token])

	useEffect(() => {
		document.title = data ? `${data.event.title} — Convite` : 'Convite'
	}, [data])

	if (isLoading) {
		return (
			<main className="invitation">
				<div className="inv-notice">
					<p>A abrir o teu convite…</p>
				</div>
			</main>
		)
	}

	if (isError || !data) {
		return (
			<main className="invitation">
				<div className="inv-notice">
					<h1>Convite não encontrado</h1>
					<p>
						Este link pode ter sido revogado, ou o evento já não está disponível.
						Contacta quem te convidou.
					</p>
				</div>
			</main>
		)
	}

	const { event, guest, ticket } = data
	const used = ticket.entriesUsed >= ticket.entriesAllowed

	return (
		<main className="invitation" data-flipped={flipped ? 'true' : 'false'}>
			<div className="inv-card">
				{/* Frente: o convite. */}
				<div className="inv-card__face">
					<p className="inv-eyebrow">Convite</p>
					<h1 className="inv-names">{event.title}</h1>

					<div className="inv-rule" aria-hidden="true">
						<span>◆</span>
					</div>

					<div className="inv-meta">
						<p>
							{formatDay(event.startDate)} · {formatHour(event.startDate)}
						</p>
						{event.venue && <p className="inv-place">{event.venue}</p>}
						<p>
							{[event.address, event.location || event.province]
								.filter(Boolean)
								.join(' · ')}
						</p>
					</div>

					<div className="inv-rule" aria-hidden="true">
						<span>◆</span>
					</div>

					<div className="inv-to">
						<span className="inv-to__label">Convidado</span>
						<p className="inv-to__name">{guest.name}</p>
						<p className="inv-to__count">
							{guest.partySize} pessoa{guest.partySize === 1 ? '' : 's'} reservada
							{guest.partySize === 1 ? '' : 's'}
						</p>
					</div>

					<button type="button" className="inv-flip" onClick={() => setFlipped(true)}>
						Ver o bilhete
					</button>
				</div>

				{/* Verso: o bilhete. */}
				<div className="inv-card__face inv-card__back">
					<p className="inv-eyebrow">Bilhete</p>
					<p className="inv-code">{ticket.code}</p>

					<div
						style={{
							background: '#ffffff',
							padding: '0.75rem',
							borderRadius: '2px',
						}}
					>
						<ReactQRCode
							// O segredo, não o código: é por `qrSecret` que o
							// scanner encontra o bilhete.
							value={qr?.qrSecret ?? ''}
							size={148}
							level="M"
							marginSize={2}
							dataModulesSettings={{ style: 'rounded', color: '#1a0a13' }}
							finderPatternOuterSettings={{ style: 'rounded', color: '#1a0a13' }}
							finderPatternInnerSettings={{ style: 'rounded', color: '#1a0a13' }}
						/>
					</div>

					<span className="inv-status" data-status={ticket.status}>
						{STATUS_TEXT[ticket.status] ?? ticket.status}
					</span>

					<p className="inv-to__count" style={{ margin: 0 }}>
						{ticket.entriesAllowed} entrada{ticket.entriesAllowed === 1 ? '' : 's'} ·{' '}
						{ticket.entriesUsed} usada{ticket.entriesUsed === 1 ? '' : 's'}
					</p>

					{!used && (
						<button
							type="button"
							className="inv-flip"
							onClick={() => {
								if (!token || rotating.current) return
								rotating.current = true
								rotateInvitationQr(token)
									.then((next) => {
										setRenewed(next)
										setNow(Date.now())
									})
									.finally(() => {
										rotating.current = false
									})
							}}
						>
							Renovar código
						</button>
					)}

					<p className="inv-foot">
						{used
							? 'Este bilhete já deu entrada. Obrigado por teres vindo.'
							: 'Mostra este código à entrada. Renova-o se ficar mais de um minuto sem usar.'}
					</p>

					<button type="button" className="inv-flip" onClick={() => setFlipped(false)}>
						Voltar ao convite
					</button>
				</div>
			</div>
		</main>
	)
}
