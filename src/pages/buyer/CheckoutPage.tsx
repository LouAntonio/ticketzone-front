import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useCartStore } from '../../stores/useCartStore'
import { useCreateOrder } from '../../api/hooks/useOrders'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatKwanza } from '../../lib/format'
import { PAYMENT_METHODS } from '../../lib/constants'
import type { PaymentInstructions, PaymentMethod } from '../../types/order'

/** Número angolano: 9 seguido de 8 dígitos. */
const PHONE_PATTERN = /^9\d{8}$/

function normalisePhone(value: string): string {
	return value.replace(/\s+/g, '')
}

const METHOD_ICONS: Record<string, string> = {
	phone: 'M6.6 10.8a15 15 0 006.6 0M12 18h.01M21 16.9v1.8a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 013 3.1 2 2 0 015 1h1.8a2 2 0 012 1.7c.1.9.4 1.8.7 2.6a2 2 0 01-.5 2.1L7.1 8.6a16 16 0 006 6l1.2-1.1a2 2 0 012.1-.5c.8.3 1.7.6 2.6.7a2 2 0 011.8 2.2z',
	bank: 'M3 21h18M5 21V10m14 11V10M3 10l9-6 9 6M9 21v-6h6v6',
}

function MethodIcon({ name }: { name: string }) {
	const d = METHOD_ICONS[name] ?? METHOD_ICONS.phone
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d={d} />
		</svg>
	)
}

function CopyButton({ value, label }: { value: string; label: string }) {
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Não foi possível copiar. Copia manualmente.')
		}
	}

	return (
		<button
			type="button"
			onClick={copy}
			className="ml-auto text-xs text-brand underline hover:text-brand-dark shrink-0"
		>
			{copied ? 'Copiado!' : label}
		</button>
	)
}

/** Ecrã mostrado depois de a encomenda ser criada e o pagamento arrancar. */
function PaymentPending({ orderId, payment }: { orderId: string; payment: PaymentInstructions }) {
	const navigate = useNavigate()
	const isReference = payment.method === 'MULTICAIXA_REFERENCE'
	const reference = payment.reference

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="max-w-md w-full p-8">
				<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-soft flex items-center justify-center">
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-brand"
					>
						<circle cx="12" cy="12" r="9" />
						<path d="M12 7v5l3 2" />
					</svg>
				</div>

				<h2 className="font-heading font-700 text-xl mb-2 text-center">
					Completa o pagamento
				</h2>
				<p className="text-text-secondary text-sm text-center mb-6">
					{isReference
						? 'Paga a referência abaixo numa ATM, no Multicaixa Express ou no Internet Banking. Os bilhetes são emitidos assim que confirmarmos o pagamento.'
						: 'Abre a aplicação Multicaixa Express no telemóvel e confirma a notificação de pagamento. Os bilhetes são emitidos automaticamente.'}
				</p>

				{reference && (
					<div className="bg-surface rounded-xl p-4 mb-6 space-y-3">
						{reference.entity && (
							<div className="flex items-center">
								<span className="text-sm text-text-secondary">Entidade</span>
								<span className="ml-auto font-heading font-700 text-lg">
									{reference.entity}
								</span>
								<CopyButton value={reference.entity} label="Copiar" />
							</div>
						)}
						<div className="flex items-center">
							<span className="text-sm text-text-secondary">Referência</span>
							<span className="ml-auto font-heading font-700 text-lg tracking-wider">
								{reference.referenceNumber}
							</span>
							<CopyButton value={reference.referenceNumber} label="Copiar" />
						</div>
						{reference.dueDate && (
							<div className="flex items-center text-sm">
								<span className="text-text-secondary">Vence em</span>
								<span className="ml-auto font-heading font-600">
									{new Date(reference.dueDate).toLocaleDateString('pt-AO')}
								</span>
							</div>
						)}
					</div>
				)}

				<Button className="w-full" onClick={() => navigate(`/account/orders/${orderId}`)}>
					Ver estado do pedido
				</Button>
				<p className="text-xs text-text-secondary text-center mt-4">
					Pagamento processado pela AppyPay. Os bilhetes só são emitidos depois do
					pagamento ser confirmado.
				</p>
			</Card>
		</div>
	)
}

export function CheckoutPage() {
	const { eventId } = useParams<{ eventId: string }>()
	const navigate = useNavigate()
	const cart = useCartStore()
	const createOrder = useCreateOrder()

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('multicaixa')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [submitted, setSubmitted] = useState<{
		orderId: string
		payment: PaymentInstructions
	} | null>(null)

	// Usa sempre o evento do carrinho: o da URL pode não coincidir depois de
	// o utilizador trocar de evento.
	const activeEventId = cart.eventId ?? eventId
	const isEmpty = cart.items.length === 0 && cart.addons.length === 0

	if (submitted) {
		return <PaymentPending orderId={submitted.orderId} payment={submitted.payment} />
	}

	if (!activeEventId || isEmpty) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="text-center p-8">
					<h2 className="font-heading font-700 text-lg mb-2">Carrinho vazio</h2>
					<p className="text-text-secondary text-sm mb-4">
						Seleciona bilhetes para um evento primeiro
					</p>
					<Button onClick={() => navigate('/events')}>Explorar Eventos</Button>
				</Card>
			</div>
		)
	}

	const requiresPhone = paymentMethod === 'multicaixa'
	const phoneValid = PHONE_PATTERN.test(normalisePhone(phoneNumber))

	const handleCheckout = async () => {
		if (requiresPhone && !phoneValid) {
			toast.error('Indica um número de telemóvel válido (9 seguido de 8 dígitos)')
			return
		}

		try {
			const result = await createOrder.mutateAsync({
				eventId: activeEventId,
				items: cart.items,
				addons: cart.addons.length > 0 ? cart.addons : undefined,
				paymentMethod,
				phoneNumber: requiresPhone ? normalisePhone(phoneNumber) : undefined,
			})

			setSubmitted({ orderId: result.order.id, payment: result.payment })
			cart.clear()
		} catch (err) {
			const message =
				(err as Error)?.message ?? 'Erro ao processar o pedido. Tenta novamente.'
			toast.error(message)
		}
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="font-heading font-700 text-2xl mb-1">Checkout</h1>
			<p className="text-text-secondary text-sm mb-8">{cart.eventTitle}</p>

			<div className="space-y-6">
				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Resumo do Pedido</h3>
					<div className="space-y-3">
						{cart.items.map((item) => (
							<div
								key={item.ticketTypeId}
								className="flex items-center justify-between pb-3 border-b border-border"
							>
								<div>
									<p className="text-sm font-heading font-600">
										{item.ticketTypeName}
									</p>
									<p className="text-xs text-text-secondary">
										{item.quantity}x · {item.peoplePerTicket} pessoa
										{item.peoplePerTicket > 1 ? 's' : ''} por bilhete
									</p>
								</div>
								<p className="text-sm font-heading font-600">
									{formatKwanza(item.unitPrice * item.quantity)}
								</p>
							</div>
						))}

						{cart.addons.map((addon) => (
							<div
								key={addon.addonId}
								className="flex items-center justify-between pb-3 border-b border-border"
							>
								<div>
									<p className="text-sm font-heading font-600">{addon.name}</p>
									<p className="text-xs text-text-secondary">
										{addon.quantity}x add-on
									</p>
								</div>
								<p className="text-sm font-heading font-600">
									{formatKwanza(addon.unitPrice * addon.quantity)}
								</p>
							</div>
						))}
					</div>

					<div className="mt-4 pt-4 border-t border-border">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm text-text-secondary">Total de pessoas</span>
							<span className="text-sm font-heading font-600">
								{cart.totalPeople()}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-base font-heading font-700">Total</span>
							<span className="font-heading font-700 text-xl text-brand">
								{formatKwanza(cart.total())}
							</span>
						</div>
					</div>
				</Card>

				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Método de Pagamento</h3>
					<div className="space-y-2">
						{PAYMENT_METHODS.map((method) => (
							<button
								key={method.value}
								type="button"
								onClick={() => setPaymentMethod(method.value)}
								className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
									paymentMethod === method.value
										? 'border-brand bg-brand-soft'
										: 'border-border hover:border-gray-300'
								}`}
							>
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
										paymentMethod === method.value
											? 'bg-brand text-white'
											: 'bg-gray-100 text-gray-500'
									}`}
								>
									<MethodIcon name={method.icon} />
								</div>
								<div>
									<p className="text-sm font-heading font-600">{method.label}</p>
									<p className="text-xs text-text-secondary">
										{method.description}
									</p>
								</div>
								{paymentMethod === method.value && (
									<div className="ml-auto shrink-0">
										<div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center">
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="white"
												strokeWidth="3"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										</div>
									</div>
								)}
							</button>
						))}
					</div>
				</Card>

				{requiresPhone && (
					<Card>
						<h3 className="font-heading font-600 text-base mb-1">
							Número de telemóvel
						</h3>
						<p className="text-text-secondary text-xs mb-4">
							É para este número que a Multicaixa Express envia a notificação de
							pagamento. Não é guardado no teu perfil.
						</p>
						<input
							type="tel"
							inputMode="numeric"
							autoComplete="tel"
							placeholder="923 111 111"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							className="input-field w-full"
							aria-label="Número de telemóvel"
						/>
						{phoneNumber.length > 0 && !phoneValid && (
							<p className="text-xs text-red-600 mt-2">
								Introduz um número angolano válido (9 seguido de 8 dígitos).
							</p>
						)}
					</Card>
				)}

				<Button
					className="w-full"
					size="lg"
					onClick={handleCheckout}
					loading={createOrder.isPending}
					disabled={requiresPhone && !phoneValid}
				>
					Confirmar e Pagar
				</Button>

				<p className="text-xs text-text-secondary text-center">
					Ao confirmares, aceitas os{' '}
					<a href="/termos" className="text-brand underline">
						Termos e Condições
					</a>
				</p>
			</div>
		</div>
	)
}
