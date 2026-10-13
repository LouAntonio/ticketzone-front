import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
		status: string
		entriesUsed: number
		entriesAllowed: number
		/** Segredo real do QR. É por ele que o scanner encontra o bilhete. */
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
		weekday: 'long',
		day: 'numeric',
		month: 'long',
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
 * Convite pessoal a um evento privado, dentro de um envelope.
 *
 * Fica fora do `PublicLayout` de propósito: não há header, nem catálogo, nem
 * login. Quem chega aqui chega por um link que recebeu.
 *
 * O envelope começa fechado, como no original. O nome do evento está na capa,
 * que é onde se lê um convite em papel antes de o abrir; ao levantar a aba, o
 * envelope leva o título consigo e a carta passa a ser o convite.
 */
export function InvitationPage() {
	const { token } = useParams<{ token: string }>()

	const { data, isLoading, isError } = useQuery({
		queryKey: ['invitation', token],
		queryFn: () => loadInvitation(token as string),
		enabled: Boolean(token),
		retry: false,
	})

	// O QR vive 60 segundos. Renovamos ao expirar, tal como `MyTickets` faz
	// com os bilhetes de um comprador, para que um print do ecrã deixe de
	// servir mal passa um minuto.
	//
	// `renewed` só guarda a última rotação; sem ele o valor vem do convite.
	// Assim não é preciso sincronizar estado dentro de um efeito.
	const [renewed, setRenewed] = useState<{
		qrSecret: string
		qrExpiresAt: string
	} | null>(null)
	const [now, setNow] = useState(() => Date.now())
	const rotating = useRef(false)

	/** O envelope começa fechado. Ver a nota acima. */
	const [open, setOpen] = useState(false)
	const toggle = useCallback(() => setOpen((v) => !v), [])

	const qr = useMemo<{ qrSecret: string; qrExpiresAt: string } | null>(
		() =>
			renewed ??
			(data
				? {
						qrSecret: data.ticket.qrSecret,
						qrExpiresAt: data.ticket.qrExpiresAt,
					}
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
		document.title = data ? `${data.event.title}, convite` : 'Convite'
	}, [data])

	if (isLoading) {
		return (
			<main className="invitation">
				<div className="notice">
					<p>A abrir o teu convite...</p>
				</div>
			</main>
		)
	}

	if (isError || !data) {
		return (
			<main className="invitation">
				<div className="notice">
					<h1>Convite indisponível</h1>
					<p>
						Este link já não abre. Pede a quem te convidou um link novo, ou manda
						mensagem se achas que é um engano.
					</p>
				</div>
			</main>
		)
	}

	const { event, guest, ticket } = data
	const used = ticket.entriesUsed >= ticket.entriesAllowed
	const secondsLeft = qr
		? Math.max(0, Math.ceil((new Date(qr.qrExpiresAt).getTime() - now) / 1000))
		: 0

	return (
		<main className="invitation">
			<button
				type="button"
				className={`envelope-wrapper${open ? ' flap' : ''}`}
				onClick={toggle}
				aria-expanded={open}
				aria-label={open ? 'Fechar o convite' : `Abrir o convite para ${event.title}`}
			>
				<div className="envelope">
					{/*
					 * O nome do evento na capa. Está antes da carta no DOM para
					 * ser lido pelos leitores de ecrã antes do conteúdo que só
					 * aparece depois de abrir.
					 */}
					<p className="envelope-label">{event.title}</p>

					{/*
					 * Fechada, a carta está atrás da capa: não se vê. O
					 * `inert` tira-a da árvore de acessibilidade para que um
					 * leitor de ecrã não leia um QR e um estado que ninguém
					 * está a ver. `inert` e não `hidden`, porque `hidden`
					 * saltaria a animação de abertura.
					 */}
					<div className="letter" inert={!open}>
						<div className="text">
							<strong>{guest.name}</strong>
							<p className="sincerely">
								{guest.partySize === 1
									? 'Um lugar reservado'
									: `${guest.partySize} lugares reservados`}{' '}
								por {event.organizer}
							</p>
						</div>

						<p className="when">
							{formatDay(event.startDate)}, {formatHour(event.startDate)}
							{event.venue ? `\n${event.venue}` : ''}
						</p>

						<div className="qr">
							<div className="qr-frame">
								<ReactQRCode
									// O segredo, não um código: é por `qrSecret` que o
									// scanner encontra o bilhete.
									value={qr?.qrSecret ?? ''}
									size={128}
									level="M"
									marginSize={1}
									dataModulesSettings={{ style: 'rounded', color: '#1c1c1c' }}
									finderPatternOuterSettings={{
										style: 'rounded',
										color: '#1c1c1c',
									}}
									finderPatternInnerSettings={{
										style: 'rounded',
										color: '#1c1c1c',
									}}
								/>
							</div>
						</div>

						<p className="qr-life">
							{secondsLeft > 0 ? `Renova em ${secondsLeft}s` : 'A renovar...'}
						</p>

						<span className="status" data-status={ticket.status}>
							{STATUS_TEXT[ticket.status] ?? ticket.status}
						</span>

						<p className="sincerely">
							{used ? 'A tua entrada já foi registada.' : 'Mostra este QR à porta.'}
						</p>
					</div>
				</div>

				<span className="heart" aria-hidden="true" />
			</button>

			<span className="hint" aria-hidden="true">
				{open ? 'Toca para fechar' : 'Toca para abrir'}
			</span>
		</main>
	)
}
