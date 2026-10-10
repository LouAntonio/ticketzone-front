import { usePageTitle } from '../../hooks/usePageTitle'

interface Section {
	id: string
	number: string
	title: string
	content: string | string[]
}

const sections: Section[] = [
	{
		id: 'aceitacao',
		number: '1',
		title: 'Aceitação dos Termos',
		content: [
			'Ao aceder e utilizar a plataforma TicketZone, o utilizador declara que leu, compreendeu e aceita integralmente os presentes Termos de Uso, bem como a Política de Privacidade, que faz parte integrante deste documento.',
			'Caso não concorde com qualquer disposição destes Termos, o utilizador não deverá utilizar os serviços da TicketZone.',
			'A TicketZone reserva-se ao direito de alterar estes Termos a qualquer momento, mediante notificação prévia aos utilizadores registados.',
		],
	},
	{
		id: 'definicoes',
		number: '2',
		title: 'Definições',
		content: [
			'Para efeitos destes Termos, entende-se por:',
			'“Plataforma” — o website e aplicação móvel TicketZone, incluindo todas as suas funcionalidades e serviços;',
			'“Utilizador” — qualquer pessoa singular que aceda ou utilize a Plataforma;',
			'“Comprador” — utilizador que adquire bilhetes através da Plataforma;',
			'“Organizador” — utilizador que cria e vende bilhetes para eventos através da Plataforma;',
			'“Bilhete” — título digital que confere ao portador o direito de acesso a um evento específico;',
			'“Evento” — qualquer atividade cultural, desportiva, recreativa ou de entretenimento listada na Plataforma.',
		],
	},
	{
		id: 'cadastro',
		number: '3',
		title: 'Cadastro e Conta',
		content: [
			'Para utilizar determinadas funcionalidades da Plataforma, o utilizador deverá criar uma conta fornecendo informações verdadeiras, precisas e atualizadas.',
			'O utilizador é responsável pela confidencialidade dos seus dados de acesso (email e senha) e por todas as atividades realizadas na sua conta.',
			'A TicketZone não se responsabiliza por perdas ou danos decorrentes do uso não autorizado da conta do utilizador.',
			'O utilizador compromete-se a notificar imediatamente a TicketZone sobre qualquer uso não autorizado da sua conta.',
		],
	},
	{
		id: 'compras',
		number: '4',
		title: 'Compra de Bilhetes',
		content: [
			'Ao efetuar uma compra na Plataforma, o comprador declara que tem capacidade legal para celebrar contratos de compra e venda.',
			'O preço dos bilhetes é expresso em Kwanzas (AOA) e inclui todos os impostos aplicáveis, salvo indicação em contrário.',
			'Após a confirmação do pagamento, os bilhetes digitais ficam disponíveis na conta do comprador na Plataforma para apresentação na entrada do evento.',
			'Os bilhetes são pessoais e intransmissíveis, podendo o organizador solicitar a apresentação de documento de identificação no acesso ao evento.',
			'É proibida a revenda de bilhetes fora da Plataforma sem autorização expressa do organizador.',
		],
	},
	{
		id: 'pagamentos',
		number: '5',
		title: 'Pagamentos e Reembolsos',
		content: [
			'A TicketZone disponibiliza os seguintes métodos de pagamento: Multicaixa Express, PayPay e Referências Multicaixa.',
			'O processamento dos pagamentos é realizado através de entidades financeiras parceiras, estando sujeito às condições e termos dessas entidades.',
			'As políticas de cancelamento e reembolso são definidas pelo organizador de cada evento e devem ser consultadas antes da compra.',
			'Em caso de cancelamento do evento pelo organizador, o comprador terá direito ao reembolso integral do valor pago.',
			'O reembolso será processado através do mesmo método de pagamento utilizado na compra, no prazo de até 10 dias úteis.',
		],
	},
	{
		id: 'organizadores',
		number: '6',
		title: 'Responsabilidades do Organizador',
		content: [
			'O organizador é o único responsável pela veracidade das informações do evento, incluindo data, local, horário e condições de acesso.',
			'O organizador compromete-se a realizar o evento conforme descrito na Plataforma, sob pena de reembolso integral aos compradores em caso de cancelamento ou alteração substancial.',
			'O organizador autoriza a TicketZone a cobrar e processar os pagamentos dos bilhetes em seu nome, mediante o pagamento de uma comissão acordada.',
			'O organizador é responsável pela validação dos bilhetes na entrada do evento, utilizando exclusivamente o sistema de validação da TicketZone.',
		],
	},
	{
		id: 'propriedade-intelectual',
		number: '7',
		title: 'Propriedade Intelectual',
		content: [
			'Todos os direitos de propriedade intelectual sobre a Plataforma, incluindo design, software, logótipos e conteúdo original, pertencem à TicketZone ou foram licenciados a esta.',
			'O utilizador não poderá reproduzir, distribuir, modificar ou criar obras derivadas da Plataforma sem autorização prévia por escrito.',
			'Os organizadores mantêm todos os direitos sobre o conteúdo dos seus eventos, concedendo à TicketZone uma licença para exibição na Plataforma.',
		],
	},
	{
		id: 'limitacao-responsabilidade',
		number: '8',
		title: 'Limitação de Responsabilidade',
		content: [
			'A TicketZone atua como intermediária entre compradores e organizadores, não sendo responsável pela execução dos eventos ou pela conduta dos organizadores.',
			'Em nenhuma circunstância a TicketZone será responsável por danos indiretos, incidentais ou consequenciais decorrentes do uso da Plataforma.',
			'A responsabilidade máxima da TicketZone em relação a qualquer transação está limitada ao valor dos bilhetes adquiridos nessa transação.',
		],
	},
	{
		id: 'disposicoes-gerais',
		number: '9',
		title: 'Disposições Gerais',
		content: [
			'Estes Termos são regidos pelas leis da República de Angola.',
			'Qualquer litígio decorrente destes Termos será resolvido nos tribunais da Comarca de Luanda, com expressa renúncia a qualquer outro foro.',
			'Caso qualquer disposição destes Termos seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.',
			'A TicketZone poderá ceder os seus direitos e obrigações decorrentes destes Termos a terceiros, mediante notificação aos utilizadores.',
		],
	},
]

export function Termos() {
	usePageTitle('Termos de Uso | TicketZone')

	const handleTocClick = (id: string) => {
		const el = document.getElementById(id)
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	return (
		<div>
			<section className="bg-surface border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
					<div className="max-w-4xl">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-[0.15em] slide-up">
							Legal
						</span>
						<h1
							className="font-display text-5xl sm:text-7xl lg:text-8xl text-text mt-3 leading-none slide-up"
							style={{ animationDelay: '80ms' }}
						>
							Termos
							<br />
							de Uso
						</h1>
						<div
							className="w-20 h-1 bg-brand rounded-full mt-6 mb-4 slide-up"
							style={{ animationDelay: '120ms' }}
						/>
						<p
							className="text-text-secondary slide-up"
							style={{ animationDelay: '160ms' }}
						>
							Última atualização: 1 de Janeiro de 2026
						</p>
					</div>
				</div>
			</section>

			<div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto scrollbar-hide">
					<div className="flex gap-2">
						{sections.map((s) => (
							<button
								key={s.id}
								onClick={() => handleTocClick(s.id)}
								className="whitespace-nowrap px-4 py-1.5 rounded-full border border-border text-xs sm:text-sm font-heading font-500 text-text-secondary hover:text-brand hover:border-brand transition-colors shrink-0"
							>
								{s.number}. {s.title}
							</button>
						))}
					</div>
				</div>
			</div>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="max-w-4xl">
					{sections.map((section, i) => (
						<div
							key={section.id}
							id={section.id}
							className="mb-20 slide-up"
							style={{ animationDelay: `${i * 60}ms` }}
						>
							<div className="flex items-start gap-6 mb-6">
								<span className="font-display text-5xl sm:text-6xl text-brand leading-none shrink-0 -mt-1">
									{section.number.padStart(2, '0')}
								</span>
								<div className="pt-2">
									<h2 className="font-heading font-700 text-xl sm:text-2xl text-text">
										{section.title}
									</h2>
									<div className="w-12 h-0.5 bg-brand rounded-full mt-3" />
								</div>
							</div>
							<div className="space-y-3 ml-0 sm:ml-[4.5rem]">
								{Array.isArray(section.content) ? (
									section.content.map((text, ti) => (
										<p
											key={ti}
											className="text-text-secondary text-sm sm:text-base leading-relaxed"
										>
											{text}
										</p>
									))
								) : (
									<p className="text-text-secondary text-sm sm:text-base leading-relaxed">
										{section.content}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
