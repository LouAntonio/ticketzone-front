import { useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'

interface FAQItemProps {
	question: string
	answer: string
	defaultOpen?: boolean
}

function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
	const [open, setOpen] = useState(defaultOpen)

	return (
		<div className="border border-border rounded-xl overflow-hidden transition-all duration-200">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface/50"
			>
				<span className="font-heading font-600 text-sm sm:text-base text-text">
					{question}
				</span>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`shrink-0 text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>
			{open && (
				<div className="px-5 pb-5 animate-fadeIn">
					<p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
				</div>
			)}
		</div>
	)
}

interface FAQCategory {
	category: string
	items: { question: string; answer: string }[]
}

const faqData: FAQCategory[] = [
	{
		category: 'Comprar Bilhetes',
		items: [
			{
				question: 'Como comprar bilhetes na TicketZone?',
				answer: 'Navega até ao evento desejado, seleciona o tipo e quantidade de bilhetes, clica em "Comprar" e segue o processo de checkout. Escolhe o teu método de pagamento preferido e, após a confirmação, receberás os bilhetes no teu email e WhatsApp automaticamente.',
			},
			{
				question: 'Posso cancelar ou pedir reembolso de um bilhete?',
				answer: 'A política de cancelamento varia conforme o organizador do evento. Alguns eventos permitem cancelamento até 48 horas antes com reembolso parcial. Recomendamos verificar os termos específicos de cada evento antes de finalizar a compra. Para pedidos de reembolso, contacta o nosso suporte.',
			},
			{
				question: 'Os bilhetes são enviados para o meu email?',
				answer: 'Sim! Após a confirmação do pagamento, os teus bilhetes são enviados automaticamente para o email que usaste no registo. Também podes aceder aos teus bilhetes na secção "Os Meus Bilhetes" da tua conta.',
			},
			{
				question: 'Como recebo os meus bilhetes via WhatsApp?',
				answer: 'Durante o checkout, podes optar por receber os bilhetes também por WhatsApp. Basta fornecer o teu número de telefone com o código do país (+244 para Angola) e os bilhetes serão enviados automaticamente após a confirmação do pagamento.',
			},
		],
	},
	{
		category: 'Pagamentos',
		items: [
			{
				question: 'Quais são os métodos de pagamento disponíveis?',
				answer: 'Aceitamos Multicaixa Express (pagamento por push notification), PayPay (pagamento via QR Code) e Referências Multicaixa (pagamento em ATM, Internet Banking ou Balcão). Estamos constantemente a trabalhar para adicionar mais opções de pagamento.',
			},
			{
				question: 'Como funciona o pagamento por Multicaixa Express?',
				answer: 'Após selecionar Multicaixa Express como método de pagamento, receberás uma notificação push no teu telefone para autorizar a transação. Basta confirmares na app do teu banco e o pagamento será processado instantaneamente.',
			},
			{
				question: 'O que é o PayPay e como usar?',
				answer: 'PayPay é uma carteira digital angolana que permite fazer pagamentos através de QR Code. Durante o checkout, escolhe PayPay e usa a app PayPay para escaneares o QR Code gerado e confirmares o pagamento.',
			},
			{
				question: 'Como pagar por Referência Multicaixa?',
				answer: 'Ao escolher Referências Multicaixa, serão geradas referências de pagamento que podes usar em qualquer ATM Multicaixa, Internet Banking ou balcão comercial. Tens 24 horas para efetuar o pagamento após a geração das referências.',
			},
			{
				question: 'O pagamento é seguro?',
				answer: 'Sim! Utilizamos tecnologias de criptografia e segurança de ponta para proteger todas as transações. Os teus dados bancários nunca são armazenados nos nossos servidores. Todas as transações são processadas através de gateways de pagamento certificados.',
			},
		],
	},
	{
		category: 'Conta e Registo',
		items: [
			{
				question: 'Como criar uma conta na TicketZone?',
				answer: 'Clica em "Criar Conta" no canto superior direito. Podes registar-te com o teu email e senha, ou usar a tua conta do Google para um registo mais rápido. Preenche os teus dados pessoais e confirma o teu email para ativar a conta.',
			},
			{
				question: 'Esqueci-me da minha password, o que faço?',
				answer: 'Na página de login, clica em "Esqueci-me da Password". Insere o teu email e receberás um link para redefinir a tua senha. Se não encontrares o email, verifica a pasta de spam ou contacta o nosso suporte.',
			},
			{
				question: 'Posso alterar os meus dados pessoais?',
				answer: 'Sim! Após fazer login, vai à tua conta e clica em "Definições" ou "Editar Perfil". Lá podes alterar o teu nome, email, número de telefone e outros dados pessoais.',
			},
		],
	},
	{
		category: 'Eventos',
		items: [
			{
				question: 'Como encontrar eventos perto de mim?',
				answer: 'Na página de Eventos, podes usar os filtros de categoria e província para encontrar eventos na tua região. Também podes pesquisar por nome do evento ou organizador. Os eventos em destaque aparecem na página inicial.',
			},
			{
				question: 'Como sei se um evento é confiável?',
				answer: 'Todos os organizadores na TicketZone passam por um processo de verificação. Podes ver a classificação do organizador e comentários de outros compradores na página do evento. Eventos verificados têm um selo de confiança visível.',
			},
			{
				question: 'O que fazer se o evento for cancelado?',
				answer: 'Se um evento for cancelado pelo organizador, serás notificado automaticamente por email e WhatsApp. O reembolso será processado de acordo com a política do evento. Em caso de dúvidas, a nossa equipa de suporte está disponível para ajudar.',
			},
		],
	},
	{
		category: 'Rent-a-Car',
		items: [
			{
				question: 'Como alugar um carro na TicketZone?',
				answer: 'Na página Rent-a-Car, escolhe a viatura que pretendes, seleciona as datas de recolha e entrega, e segue o processo de reserva. Após confirmação do pagamento, receberás os detalhes para levantar a viatura.',
			},
			{
				question: 'Quais são os requisitos para alugar?',
				answer: 'É necessário ter pelo menos 23 anos, carta de condução válida há mais de 2 anos, e um documento de identificação (BI ou Passaporte). Algumas viaturas podem ter requisitos adicionais.',
			},
			{
				question: 'Posso cancelar uma reserva?',
				answer: 'Sim, podes cancelar a tua reserva com até 48 horas de antecedência para reembolso total. Cancelamentos com menos de 48 horas estão sujeitos a taxas. Consulta os termos específicos na página de cada viatura.',
			},
		],
	},
]

export function Ajuda() {
	usePageTitle('Ajuda | TicketZone')

	return (
		<div>
			<section className="bg-surface-card border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
					<div className="max-w-2xl">
						<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-4 slide-up">
							Ajuda
						</h1>
						<p
							className="text-text-secondary text-lg slide-up"
							style={{ animationDelay: '100ms' }}
						>
							Tudo o que precisas de saber sobre a TicketZone
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<div className="max-w-3xl mx-auto space-y-10">
					{faqData.map((category, ci) => (
						<div
							key={category.category}
							className="slide-up"
							style={{ animationDelay: `${ci * 80}ms` }}
						>
							<div className="flex items-center gap-3 mb-5">
								<div className="w-1 h-6 bg-brand rounded-full" />
								<h2 className="font-heading font-700 text-lg">
									{category.category}
								</h2>
							</div>
							<div className="space-y-3">
								{category.items.map((item) => (
									<FAQItem
										key={item.question}
										question={item.question}
										answer={item.answer}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="bg-gradient-to-br from-brand via-brand-dark to-brand-dark">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
					<div className="max-w-2xl mx-auto text-center">
						<h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
							Precisas de mais ajuda?
						</h2>
						<p className="text-white/70 mb-8">
							A nossa equipa de suporte está disponível para te ajudar com qualquer
							questão.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<a
								href="mailto:suporte@ticketzone.co.ao"
								className="btn bg-white text-brand hover:bg-gray-100 h-12 px-8 text-sm font-heading font-700 rounded-xl"
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
								suporte@ticketzone.co.ao
							</a>
							<a
								href="https://wa.me/244900000000"
								target="_blank"
								rel="noopener noreferrer"
								className="btn border-2 border-white/30 text-white hover:bg-white/10 h-12 px-8 text-sm font-heading font-700 rounded-xl"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
								</svg>
								Falar no WhatsApp
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
