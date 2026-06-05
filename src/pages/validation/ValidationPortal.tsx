import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useValidateTicket } from '../../api/hooks/useTickets'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { ValidationResult } from '../../types/ticket'

export function ValidationPortal() {
	const [qrCode, setQrCode] = useState('')
	const validate = useValidateTicket()
	const [result, setResult] = useState<ValidationResult | null>(null)

	const handleValidate = async () => {
		if (!qrCode.trim()) return
		setResult(null)
		try {
			const res = await validate.mutateAsync(qrCode.trim())
			setResult(res)
		} catch {
			toast.error('Bilhete inválido ou código incorreto')
			setResult({
				ticketId: '',
				eventTitle: '',
				ticketType: '',
				buyerName: '',
				status: 'invalid',
			})
		}
	}

	const handleReset = () => {
		setQrCode('')
		setResult(null)
		validate.reset()
	}

	const statusConfig: Record<
		string,
		{ label: string; variant: 'emerald' | 'red' | 'amber'; icon: string }
	> = {
		valid: {
			label: 'Bilhete Válido',
			variant: 'emerald',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		already_used: {
			label: 'Bilhete já utilizado',
			variant: 'red',
			icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
		},
		invalid: {
			label: 'Bilhete Inválido',
			variant: 'red',
			icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
		},
		expired: {
			label: 'Bilhete Expirado',
			variant: 'amber',
			icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
	}

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
				<h1 className="font-heading font-700 text-2xl">Validar Bilhetes</h1>
				<p className="text-text-secondary text-sm mt-1">Portal de validação de ingressos</p>
			</div>

			{!result ? (
				<Card className="p-8">
					<div className="flex flex-col items-center gap-6">
						<div className="w-64 h-64 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-gray-50">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1"
								className="text-gray-300"
							>
								<rect x="2" y="2" width="8" height="8" rx="1" />
								<rect x="14" y="2" width="8" height="8" rx="1" />
								<rect x="2" y="14" width="8" height="8" rx="1" />
								<rect x="14" y="14" width="8" height="8" rx="1" />
							</svg>
							<p className="text-xs text-text-secondary mt-3 text-center max-w-[200px]">
								Escaneia o QR Code do bilhete ou insere o código manualmente
							</p>
						</div>

						<div className="w-full max-w-sm">
							<div className="flex gap-2">
								<div className="flex-1">
									<input
										className="input-field text-center font-heading font-600 tracking-widest uppercase"
										placeholder="Código do bilhete"
										value={qrCode}
										onChange={(e) => setQrCode(e.target.value.toUpperCase())}
										onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
									/>
								</div>
								<Button
									onClick={handleValidate}
									loading={validate.isPending}
									disabled={!qrCode.trim()}
								>
									Validar
								</Button>
							</div>
						</div>
					</div>
				</Card>
			) : (
				<Card className="p-8 slide-up">
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

						{result.status === 'valid' && (
							<div className="space-y-3 w-full max-w-sm">
								<div className="p-3 bg-gray-50 rounded-xl">
									<p className="text-xs text-text-secondary">Evento</p>
									<p className="font-heading font-600">{result.eventTitle}</p>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="p-3 bg-gray-50 rounded-xl">
										<p className="text-xs text-text-secondary">Tipo</p>
										<p className="font-heading font-600">{result.ticketType}</p>
									</div>
									<div className="p-3 bg-gray-50 rounded-xl">
										<p className="text-xs text-text-secondary">Comprador</p>
										<p className="font-heading font-600">{result.buyerName}</p>
									</div>
								</div>
								{result.groupSize && (
									<div className="p-3 bg-brand-soft rounded-xl">
										<p className="text-xs text-brand">Bilhete de Grupo</p>
										<p className="font-heading font-600 text-brand">
											{result.usedCount ?? 0}/{result.groupSize} usados ·{' '}
											{result.remaining} restantes
										</p>
									</div>
								)}
							</div>
						)}

						{result.status !== 'valid' && (
							<div className="p-4 bg-red-50 rounded-xl w-full max-w-sm">
								<p className="text-sm text-red-600">
									{result.status === 'expired'
										? 'Este bilhete já expirou.'
										: result.status === 'already_used'
											? 'Este bilhete já foi utilizado.'
											: 'Este bilhete não é válido.'}
								</p>
							</div>
						)}

						<Button variant="outline" className="mt-6" onClick={handleReset}>
							Validar Outro Bilhete
						</Button>
					</div>
				</Card>
			)}

			<Card className="p-4">
				<h4 className="font-heading font-600 text-sm mb-2">Como validar bilhetes</h4>
				<ol className="text-xs text-text-secondary space-y-1 list-decimal list-inside">
					<li>Escaneia o QR Code no bilhete do participante</li>
					<li>Ou insere manualmente o código alfanumérico do bilhete</li>
					<li>O sistema verifica se o bilhete é válido e autêntico</li>
					<li>
						Para bilhetes de grupo, a validação é iterativa — cada pessoa que entra é
						descontada
					</li>
				</ol>
			</Card>
		</div>
	)
}
