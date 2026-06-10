import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useCartStore } from '../../stores/useCartStore'
import { useCreateOrder } from '../../api/hooks/useOrders'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatKwanza } from '../../lib/format'
import { PAYMENT_METHODS } from '../../lib/constants'
import type { PaymentMethod } from '../../types/order'

export function CheckoutPage() {
	const { eventId } = useParams<{ eventId: string }>()
	const navigate = useNavigate()
	const cart = useCartStore()
	const createOrder = useCreateOrder()
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('multicaixa')
	const [orderCreated, setOrderCreated] = useState(false)
	const [orderRef, setOrderRef] = useState('')

	if (!eventId || (cart.items.length === 0 && cart.addons.length === 0)) {
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

	const handleCheckout = async () => {
		try {
			const res = await createOrder.mutateAsync({
				eventId,
				items: cart.items,
				addons: cart.addons.length > 0 ? cart.addons : undefined,
				paymentMethod,
			})
			setOrderRef(res.order.paymentRef ?? '')
			setOrderCreated(true)
			cart.clear()
		} catch (err) {
			toast.error('Erro ao processar o pedido. Tenta novamente.')
			console.error(err)
		}
	}

	if (orderCreated) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="max-w-md w-full p-8 text-center">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-emerald-600"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
					<h2 className="font-heading font-700 text-xl mb-2">Pedido Confirmado!</h2>
					<p className="text-text-secondary text-sm mb-6">
						O teu pedido foi registado. Assim que o pagamento for confirmado, receberás
						os bilhetes por email.
					</p>

					{paymentMethod === 'reference' && orderRef && (
						<div className="p-4 bg-gray-50 rounded-xl mb-6">
							<p className="text-xs text-text-secondary mb-1">
								Referência Multicaixa
							</p>
							<p className="font-heading font-700 text-2xl tracking-widest">
								{orderRef}
							</p>
							<p className="text-xs text-text-secondary mt-2">
								Paga em qualquer ATM ou app de Internet Banking
							</p>
						</div>
					)}

					{paymentMethod === 'paypay' && (
						<div className="p-4 bg-gray-50 rounded-xl mb-6 flex flex-col items-center">
							<p className="text-xs text-text-secondary mb-3">
								Escaneia o QR Code com o PayPay
							</p>
							<div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center border-2 border-border">
								<svg
									width="120"
									height="120"
									viewBox="0 0 120 120"
									className="text-gray-800"
								>
									<rect
										x="20"
										y="20"
										width="30"
										height="30"
										fill="currentColor"
									/>
									<rect
										x="70"
										y="20"
										width="30"
										height="30"
										fill="currentColor"
									/>
									<rect
										x="20"
										y="70"
										width="30"
										height="30"
										fill="currentColor"
									/>
									<rect
										x="70"
										y="70"
										width="30"
										height="30"
										fill="currentColor"
									/>
								</svg>
							</div>
						</div>
					)}

					{paymentMethod === 'multicaixa' && (
						<div className="p-4 bg-gray-50 rounded-xl mb-6">
							<p className="text-xs text-text-secondary mb-1">
								Pagamento via Multicaixa Express
							</p>
							<p className="text-sm font-heading font-600">
								Receberás uma notificação push para confirmar o pagamento
							</p>
						</div>
					)}

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => navigate('/account/tickets')}
						>
							Ver Bilhetes
						</Button>
						<Button className="flex-1" onClick={() => navigate('/events')}>
							Explorar Mais
						</Button>
					</div>
				</Card>
			</div>
		)
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="font-heading font-700 text-2xl mb-1">Checkout</h1>
			<p className="text-text-secondary text-sm mb-8">{cart.eventTitle}</p>

			<div className="space-y-6">
				{/* Order summary */}
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

				{/* Payment method */}
				<Card>
					<h3 className="font-heading font-600 text-base mb-4">Método de Pagamento</h3>
					<div className="space-y-2">
						{PAYMENT_METHODS.map((method) => (
							<button
								key={method.value}
								onClick={() => setPaymentMethod(method.value as PaymentMethod)}
								className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
									paymentMethod === method.value
										? 'border-brand bg-brand-soft'
										: 'border-border hover:border-gray-300'
								}`}
							>
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center ${
										paymentMethod === method.value
											? 'bg-brand text-white'
											: 'bg-gray-100 text-gray-500'
									}`}
								>
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
										<path d="M12 4v16m-8-8h16" />
									</svg>
								</div>
								<div className="text-left">
									<p className="text-sm font-heading font-600">{method.label}</p>
									<p className="text-xs text-text-secondary">
										{method.value === 'multicaixa'
											? 'Pagamento via push notification'
											: method.value === 'paypay'
												? 'Pagamento via QR Code'
												: 'Pagamento em ATM ou Internet Banking'}
									</p>
								</div>
								{paymentMethod === method.value && (
									<div className="ml-auto">
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

				{/* CTA */}
				<Button
					className="w-full"
					size="lg"
					onClick={handleCheckout}
					loading={createOrder.isPending}
				>
					Confirmar e Pagar
				</Button>

				<p className="text-xs text-text-secondary text-center">
					Ao confirmares, aceitas os{' '}
					<a href="#" className="text-brand underline">
						Termos e Condições
					</a>
				</p>
			</div>
		</div>
	)
}
