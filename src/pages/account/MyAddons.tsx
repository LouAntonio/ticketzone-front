import { Link } from 'react-router-dom'
import { useMyAddons, useRotateAddonQrCode } from '../../api/hooks/useTickets'
import type { AddonInstance } from '../../types/ticket'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { ReactQRCode } from '@lglab/react-qr-code'
import { useState, useEffect, useRef, useMemo } from 'react'

const statusVariant: Record<string, 'emerald' | 'gray' | 'red'> = {
	active: 'emerald',
	used: 'gray',
	cancelled: 'red',
}

const statusLabel: Record<string, string> = {
	ACTIVE: 'Ativo',
	USED: 'Usado',
	CANCELLED: 'Cancelado',
	VOIDED: 'Anulado',
}

interface QrState {
	qrCode: string
	qrExpiresAt: string
}

export function MyAddonsPage() {
	const { data, isLoading } = useMyAddons()
	const [selectedAddon, setSelectedAddon] = useState<string | null>(null)
	const [now, setNow] = useState(() => Date.now())
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const rotateMutation = useRotateAddonQrCode()
	const rotatingRef = useRef<Set<string>>(new Set())

	const instances: AddonInstance[] = useMemo(
		() => (Array.isArray(data) ? data : (data?.data ?? [])),
		[data],
	)

	const baseQrStates = useMemo(() => {
		const map: Record<string, QrState> = {}
		for (const inst of instances) {
			map[inst.id] = { qrCode: inst.qrSecret, qrExpiresAt: inst.qrExpiresAt }
		}
		return map
	}, [instances])

	const [rotationUpdates, setRotationUpdates] = useState<Record<string, QrState>>({})
	const qrStates = useMemo(
		() => ({
			...baseQrStates,
			...rotationUpdates,
		}),
		[baseQrStates, rotationUpdates],
	)

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setNow(Date.now())
		}, 1000)
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	useEffect(() => {
		if (!selectedAddon || !qrStates[selectedAddon]) return

		const qs = qrStates[selectedAddon]
		const expiresAt = new Date(qs.qrExpiresAt).getTime()

		if (now >= expiresAt && !rotatingRef.current.has(selectedAddon)) {
			rotatingRef.current.add(selectedAddon)
			rotateMutation
				.mutateAsync(selectedAddon)
				.then((res) => {
					setRotationUpdates((prev) => ({
						...prev,
						[selectedAddon]: { qrCode: res.qrCode, qrExpiresAt: res.qrExpiresAt },
					}))
				})
				.finally(() => {
					rotatingRef.current.delete(selectedAddon)
				})
		}
	}, [now, selectedAddon, qrStates, rotateMutation])

	const handleToggle = (addonId: string) => {
		setSelectedAddon((prev) => (prev === addonId ? null : addonId))
	}

	const getCountdown = (addonId: string): number | null => {
		const qs = qrStates[addonId]
		if (!qs) return null
		const diff = new Date(qs.qrExpiresAt).getTime() - now
		return diff > 0 ? Math.ceil(diff / 1000) : 0
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-display-alt font-700 text-2xl text-warm-text mb-1">
						Os Meus Add-ons
					</h1>
					<p className="text-text-secondary text-sm">
						{isLoading
							? 'A carregar...'
							: `${instances.length} add-on${instances.length !== 1 ? 's' : ''}`}
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="grid sm:grid-cols-2 gap-4">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-border overflow-hidden p-4"
						>
							<div className="flex gap-4">
								<Skeleton className="w-14 h-14 rounded-xl shrink-0" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-28" />
									<Skeleton className="h-3 w-24" />
									<div className="flex gap-2 mt-2">
										<Skeleton className="h-5 w-14 rounded-full" />
									</div>
								</div>
							</div>
							<div className="mt-4 pt-4 border-t border-border">
								<div className="flex items-center gap-3">
									<Skeleton className="w-12 h-12 rounded-lg" />
									<div className="space-y-1.5 flex-1">
										<Skeleton className="h-3 w-32" />
										<Skeleton className="h-3 w-24" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : instances.length === 0 ? (
				<div className="card-account">
					<div className="p-12 text-center">
						<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-soft flex items-center justify-center">
							<svg
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								className="text-brand"
							>
								<path d="M20 12H4M12 4v16" />
							</svg>
						</div>
						<p className="font-heading font-600 text-warm-text mb-2">
							Nenhum add-on encontrado
						</p>
						<p className="text-sm text-text-secondary mb-6">
							Os add-ons que comprares aparecerão aqui.
						</p>
						<Link
							to="/events"
							className="btn-brand h-11 px-6 rounded-xl inline-flex items-center gap-2 text-sm font-heading font-600"
						>
							Explorar Eventos
						</Link>
					</div>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 gap-4">
					{instances.map((instance) => {
						const qs = qrStates[instance.id]
						const countdown = getCountdown(instance.id)

						return (
							<div key={instance.id} className="card-account overflow-hidden">
								<div className="p-4">
									<div className="flex items-center gap-4">
										<div className="w-14 h-14 shrink-0 bg-white rounded-xl border-2 border-warm-border flex items-center justify-center overflow-hidden">
											{qs && (
												<ReactQRCode
													value={qs.qrCode}
													size={50}
													level="M"
													dataModulesSettings={{ style: 'rounded', color: '#f16522' }}
													finderPatternOuterSettings={{ style: 'rounded-lg', color: '#f16522' }}
													finderPatternInnerSettings={{ style: 'rounded', color: '#f16522' }}
												/>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-heading font-600 text-sm text-warm-text truncate">
													{instance.addonName}
												</p>
												<Badge
													variant={
														statusVariant[
															instance.status.toLowerCase() as keyof typeof statusVariant
														] ?? 'gray'
													}
													className="text-xs shrink-0"
												>
													{statusLabel[instance.status] ??
														instance.status}
												</Badge>
											</div>
											<p className="text-xs text-text-secondary truncate">
												{instance.event?.title ?? 'Evento'}
											</p>
											<p className="text-xs text-text-secondary">
												{instance.entriesUsed}/{instance.entriesAllowed}{' '}
												entradas usadas
											</p>
										</div>
									</div>

									<div className="mt-4 pt-4 border-t border-warm-border">
										<button
											onClick={() => handleToggle(instance.id)}
											className="flex items-center gap-3 w-full text-left"
										>
											<div className="w-12 h-12 bg-white rounded-lg border-2 border-warm-border flex items-center justify-center overflow-hidden shrink-0">
												{qs && (
													<ReactQRCode
														value={qs.qrCode}
														size={44}
														level="M"
														dataModulesSettings={{ style: 'rounded', color: '#f16522' }}
														finderPatternOuterSettings={{ style: 'rounded-lg', color: '#f16522' }}
														finderPatternInnerSettings={{ style: 'rounded', color: '#f16522' }}
													/>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-heading font-600 text-warm-text">
													{selectedAddon === instance.id
														? 'Clique para fechar'
														: 'Ver QR Code completo'}
												</p>
											</div>
										</button>

										{selectedAddon === instance.id && qs && (
											<div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-xl slide-up">
												{countdown !== null && countdown > 0 && (
													<div className="mb-3 flex items-center gap-2">
														<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
														<span className="text-xs text-emerald-600 font-heading font-600">
															QR expira em {countdown}s
														</span>
													</div>
												)}
												{countdown !== null && countdown <= 0 && (
													<div className="mb-3 flex items-center gap-2">
														<div className="w-2 h-2 rounded-full bg-amber-500" />
														<span className="text-xs text-amber-600 font-heading font-600">
															A renovar QR Code...
														</span>
													</div>
												)}
												<ReactQRCode
													value={qs.qrCode}
													size={180}
													level="H"
													marginSize={4}
													dataModulesSettings={{ style: 'rounded', color: '#f16522' }}
													finderPatternOuterSettings={{ style: 'rounded-lg', color: '#f16522' }}
													finderPatternInnerSettings={{ style: 'rounded', color: '#f16522' }}
												/>
												<p className="text-xs text-text-secondary text-center mt-3">
													Apresenta este código no evento para validar o
													teu add-on.
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
