import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useVerifyQrUnified, useValidateTicket, useValidateAddon } from '../../api/hooks/useTickets'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { VerifyQrResponse, ValidationResult } from '../../types/ticket'

export function ValidationPortal() {
	const [scannerPaused, setScannerPaused] = useState(false)
	const [scannerError, setScannerError] = useState<string | null>(null)
	const verify = useVerifyQrUnified()
	const validateTicket = useValidateTicket()
	const validateAddon = useValidateAddon()
	const [result, setResult] = useState<VerifyQrResponse | null>(null)
	const [validateResult, setValidateResult] = useState<ValidationResult | null>(null)

	const handleVerify = useCallback(async (code: string) => {
		if (!code.trim()) return
		setResult(null)
		setValidateResult(null)
		try {
			const res = await verify.mutateAsync(code.trim())
			setResult(res)
			if (res.status === 'valid') {
				if (res.type === 'ticket') {
					toast.success('Bilhete válido')
				} else {
					toast.success('Add-on válido')
				}
			}
		} catch {
			toast.error('Erro ao verificar código')
			setResult({
				type: 'ticket',
				status: 'invalid',
				msg: 'Código não encontrado ou erro na verificação',
				ticket: null,
			})
		}
	}, [verify])

	const handleScan = useCallback((detectedCodes: { rawValue: string }[]) => {
		if (scannerPaused || detectedCodes.length === 0) return
		const code = detectedCodes[0].rawValue
		if (!code) return
		setScannerPaused(true)
		handleVerify(code)
	}, [scannerPaused, handleVerify])

	const handleValidate = async () => {
		if (!result?.ticket?.id && !result?.addon?.id) return
		try {
			if (result.type === 'ticket' && result.ticket) {
				const res = await validateTicket.mutateAsync(result.ticket.id)
				setValidateResult(res)
				toast.success(res.msg)
			} else if (result.type === 'addon' && result.addon) {
				const res = await validateAddon.mutateAsync(result.addon.id)
				setValidateResult(res)
				toast.success(res.msg)
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Erro ao validar'
			toast.error(msg)
		}
	}

	const handleReset = () => {
		setResult(null)
		setValidateResult(null)
		setScannerPaused(false)
		setScannerError(null)
		verify.reset()
		validateTicket.reset()
		validateAddon.reset()
	}

	const statusConfig: Record<
		string,
		{ label: string; variant: 'emerald' | 'red' | 'amber' | 'blue'; icon: string }
	> = {
		valid: {
			label: 'Código Válido',
			variant: 'emerald',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		invalid: {
			label: 'Código Inválido',
			variant: 'red',
			icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
		},
		expired: {
			label: 'QR Code Expirado',
			variant: 'amber',
			icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
	}

	const isAddon = result?.type === 'addon'
	const canValidate =
		result?.status === 'valid' &&
		((isAddon && result.addon?.eventStarted) ||
			(!isAddon && result?.ticket?.eventStarted))

	const typeLabel = isAddon ? 'Add-on' : 'Bilhete'

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="text-center">
				<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-soft flex items-center justify-center">
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-brand"
					>
						<path d="M12 4v16m-8-8h16" />
					</svg>
				</div>
				<h1 className="font-heading font-700 text-2xl">Validar Bilhetes e Add-ons</h1>
				<p className="text-text-secondary text-sm mt-1">Portal de verificação de ingressos</p>
			</div>

			{/* Scanner always active when no result */}
			{!result && !validateResult && (
				<div className="flex items-center justify-center gap-2">
					<span className="px-4 py-2 text-sm font-heading font-600 rounded-lg border bg-brand text-white border-brand">
						<svg
							width="16"
							height="16"
							className="inline mr-1.5 -mt-0.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						>
							<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
							<circle cx="12" cy="13" r="4" />
						</svg>
						Câmara
					</span>
				</div>
			)}

			{!result ? (
				<Card className="p-6">
					<div className="flex flex-col items-center gap-4">
						{scannerError ? (
							<div className="w-full p-6 text-center">
								<div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
									<svg
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#DC2626"
										strokeWidth="1.5"
									>
										<path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<p className="text-sm text-red-600 font-heading font-600 mb-1">
									Câmara indisponível
								</p>
								<p className="text-xs text-text-secondary mb-4">{scannerError}</p>
								<Button variant="outline" size="sm" onClick={() => setScannerError(null)}>
									Tentar novamente
								</Button>
							</div>
						) : (
							<div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl">
								<Scanner
									onScan={handleScan}
									onError={(err) => {
										setScannerError(err?.message ?? 'Erro ao aceder à câmara')
									}}
									constraints={{ facingMode: 'environment' }}
									paused={scannerPaused}
									sound
									components={{ tracker: true }}
									styles={{
										container: { borderRadius: '12px', overflow: 'hidden' },
										video: { width: '100%', display: 'block' },
									}}
								/>
							</div>
						)}
						<p className="text-xs text-text-secondary text-center max-w-xs">
							Aponte a câmara para o QR Code do bilhete ou add-on. A verificação é automática.
						</p>
					</div>
				</Card>
			) : (
				<>
					{/* Verification result */}
					<Card className={`p-8 slide-up ${validateResult ? 'opacity-60' : ''}`}>
						<div className="flex flex-col items-center text-center">
							<div
								className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
									result.status === 'valid' ? 'bg-emerald-100' : 'bg-red-100'
								}`}
							>
								<svg
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke={result.status === 'valid' ? '#059669' : '#DC2626'}
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										d={
											statusConfig[result.status]?.icon ??
											statusConfig.invalid.icon
										}
									/>
								</svg>
							</div>

							<Badge
								variant={statusConfig[result.status]?.variant ?? 'red'}
								className="text-base px-4 py-1.5 mb-4"
							>
								{statusConfig[result.status]?.label ?? 'Desconhecido'}
							</Badge>

							{result.status === 'valid' && result.type === 'ticket' && result.ticket && (
								<div className="space-y-3 w-full max-w-sm">
									<div className="p-3 bg-blue-50 rounded-xl">
										<p className="text-xs text-blue-600 font-heading font-600">Bilhete</p>
									</div>

									<div className="p-3 bg-gray-50 rounded-xl">
										<p className="text-xs text-text-secondary">Evento</p>
										<p className="font-heading font-600">{result.ticket.eventTitle}</p>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-gray-50 rounded-xl">
											<p className="text-xs text-text-secondary">Tipo</p>
											<p className="font-heading font-600">{result.ticket.ticketType}</p>
										</div>
										<div className="p-3 bg-gray-50 rounded-xl">
											<p className="text-xs text-text-secondary">Comprador</p>
											<p className="font-heading font-600">{result.ticket.ownerName}</p>
										</div>
									</div>

									<div className="p-3 bg-gray-50 rounded-xl">
										<p className="text-xs text-text-secondary">Email do comprador</p>
										<p className="font-heading font-600 text-sm">{result.ticket.ownerEmail}</p>
									</div>

									{result.ticket.isGroupTicket && result.ticket.groupSize && (
										<div className="p-3 bg-brand-soft rounded-xl">
											<p className="text-xs text-brand">Bilhete de Grupo</p>
											<p className="font-heading font-600 text-brand">
												{result.ticket.entriesUsed}/{result.ticket.groupSize} usados ·{' '}
												{result.ticket.entriesAllowed - result.ticket.entriesUsed} restantes
											</p>
										</div>
									)}

									{!result.ticket.isGroupTicket && (
										<div className="p-3 bg-gray-50 rounded-xl">
											<p className="text-xs text-text-secondary">Entradas</p>
											<p className="font-heading font-600">
												{result.ticket.entriesUsed}/{result.ticket.entriesAllowed} usadas
											</p>
										</div>
									)}

									{!result.ticket.eventStarted && (
										<div className="p-3 bg-amber-50 rounded-xl">
											<p className="text-xs text-amber-700">
												Evento ainda não iniciado. Apenas verificação consultiva — não é
												possível consumir entradas.
											</p>
										</div>
									)}

									<p className="text-xs text-text-secondary italic">{result.note}</p>
								</div>
							)}

							{result.status === 'valid' && result.type === 'addon' && result.addon && (
								<div className="space-y-3 w-full max-w-sm">
									<div className="p-3 bg-purple-50 rounded-xl">
										<p className="text-xs text-purple-600 font-heading font-600">Add-on</p>
									</div>

									<div className="p-3 bg-gray-50 rounded-xl">
										<p className="text-xs text-text-secondary">Evento</p>
										<p className="font-heading font-600">{result.addon.eventTitle}</p>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-gray-50 rounded-xl">
											<p className="text-xs text-text-secondary">Add-on</p>
											<p className="font-heading font-600">{result.addon.addonName}</p>
										</div>
										<div className="p-3 bg-gray-50 rounded-xl">
											<p className="text-xs text-text-secondary">Comprador</p>
											<p className="font-heading font-600">{result.addon.ownerName}</p>
										</div>
									</div>

									{result.addon.addonDescription && (
										<div className="p-3 bg-gray-50 rounded-xl">
											<p className="text-xs text-text-secondary">Descrição</p>
											<p className="font-heading font-600 text-sm">{result.addon.addonDescription}</p>
										</div>
									)}

									<div className="p-3 bg-gray-50 rounded-xl">
										<p className="text-xs text-text-secondary">Entradas</p>
										<p className="font-heading font-600">
											{result.addon.entriesUsed}/{result.addon.entriesAllowed} usadas
										</p>
									</div>

									{!result.addon.eventStarted && (
										<div className="p-3 bg-amber-50 rounded-xl">
											<p className="text-xs text-amber-700">
												Evento ainda não iniciado. Apenas verificação consultiva.
											</p>
										</div>
									)}

									<p className="text-xs text-text-secondary italic">{result.note}</p>
								</div>
							)}

							{result.status !== 'valid' && (
								<div className="p-4 bg-red-50 rounded-xl w-full max-w-sm">
									<p className="text-sm text-red-600">
										{result.status === 'expired'
											? 'QR Code expirado. O comprador deve renovar o código na página do bilhete/add-on.'
											: result.msg || 'Este código não é válido.'}
									</p>
								</div>
							)}
						</div>
					</Card>

					{/* Validate button (step 2) */}
					{canValidate && !validateResult && (
						<Card className="p-6 text-center">
							<Button
								onClick={handleValidate}
								loading={isAddon ? validateAddon.isPending : validateTicket.isPending}
								size="lg"
								className="w-full max-w-xs"
							>
								Validar Entrada ({typeLabel})
							</Button>
							<p className="text-xs text-text-secondary mt-2">
								Ao validar, uma entrada será consumida
							</p>
						</Card>
					)}

					{/* Validation success result */}
					{validateResult && (validateResult.type === 'validation' || validateResult.type === 'addon-validation') && (
						<Card className="p-8 text-center bg-emerald-50 border-emerald-200">
							<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
								<svg
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#059669"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<Badge variant="emerald" className="text-base px-4 py-1.5 mb-4">
								{validateResult.type === 'addon-validation' ? 'Add-on Confirmado' : 'Entrada Confirmada'}
							</Badge>
							<div className="space-y-1">
								<p className="font-heading font-600 text-lg">
									{validateResult.addonName ?? `Entrada ${validateResult.entry} de ${validateResult.total}`}
								</p>
								<p className="text-sm text-text-secondary">{validateResult.event}</p>
							</div>
						</Card>
					)}

					<Button variant="outline" className="mt-2 w-full" onClick={handleReset}>
						{validateResult ? 'Validar Outro Código' : 'Cancelar'}
					</Button>
				</>
			)}

			<Card className="p-4">
				<h4 className="font-heading font-600 text-sm mb-2">Como validar</h4>
				<ol className="text-xs text-text-secondary space-y-1 list-decimal list-inside">
					<li>Aponta a câmara para o QR Code do bilhete ou add-on</li>
					<li>O sistema verifica a autenticidade do código automaticamente</li>
					<li>Confirma os dados apresentados</li>
					<li>Clica em "Validar Entrada" para consumir uma entrada</li>
				</ol>
			</Card>
		</div>
	)
}
