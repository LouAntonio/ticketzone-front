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
		title: 'Aceita\u00E7\u00E3o dos Termos',
		content: [
			'Ao aceder e utilizar a plataforma TicketZone, o utilizador declara que leu, compreendeu e aceita integralmente os presentes Termos de Uso, bem como a Pol\u00EDtica de Privacidade, que faz parte integrante deste documento.',
			'Caso n\u00E3o concorde com qualquer disposi\u00E7\u00E3o destes Termos, o utilizador n\u00E3o dever\u00E1 utilizar os servi\u00E7os da TicketZone.',
			'A TicketZone reserva-se ao direito de alterar estes Termos a qualquer momento, mediante notifica\u00E7\u00E3o pr\u00E9via aos utilizadores registados.',
		],
	},
	{
		id: 'definicoes',
		number: '2',
		title: 'Defini\u00E7\u00F5es',
		content: [
			'Para efeitos destes Termos, entende-se por:',
			'\u201CPlataforma\u201D \u2014 o website e aplica\u00E7\u00E3o m\u00F3vel TicketZone, incluindo todas as suas funcionalidades e servi\u00E7os;',
			'\u201CUtilizador\u201D \u2014 qualquer pessoa singular que aceda ou utilize a Plataforma;',
			'\u201CComprador\u201D \u2014 utilizador que adquire bilhetes atrav\u00E9s da Plataforma;',
			'\u201COrganizador\u201D \u2014 utilizador que cria e vende bilhetes para eventos atrav\u00E9s da Plataforma;',
			'\u201CBilhete\u201D \u2014 t\u00EDtulo digital que confere ao portador o direito de acesso a um evento espec\u00EDfico;',
			'\u201CEvento\u201D \u2014 qualquer atividade cultural, desportiva, recreativa ou de entretenimento listada na Plataforma.',
		],
	},
	{
		id: 'cadastro',
		number: '3',
		title: 'Cadastro e Conta',
		content: [
			'Para utilizar determinadas funcionalidades da Plataforma, o utilizador dever\u00E1 criar uma conta fornecendo informa\u00E7\u00F5es verdadeiras, precisas e atualizadas.',
			'O utilizador \u00E9 respons\u00E1vel pela confidencialidade dos seus dados de acesso (email e senha) e por todas as atividades realizadas na sua conta.',
			'A TicketZone n\u00E3o se responsabiliza por perdas ou danos decorrentes do uso n\u00E3o autorizado da conta do utilizador.',
			'O utilizador compromete-se a notificar imediatamente a TicketZone sobre qualquer uso n\u00E3o autorizado da sua conta.',
		],
	},
	{
		id: 'compras',
		number: '4',
		title: 'Compra de Bilhetes',
		content: [
			'Ao efetuar uma compra na Plataforma, o comprador declara que tem capacidade legal para celebrar contratos de compra e venda.',
			'O pre\u00E7o dos bilhetes \u00E9 expresso em Kwanzas (AOA) e inclui todos os impostos aplic\u00E1veis, salvo indica\u00E7\u00E3o em contr\u00E1rio.',
			'Ap\u00F3s a confirma\u00E7\u00E3o do pagamento, o comprador receber\u00E1 os bilhetes digitais por email e/ou WhatsApp.',
			'Os bilhetes s\u00E3o pessoais e intransmiss\u00EDveis, podendo o organizador solicitar a apresenta\u00E7\u00E3o de documento de identifica\u00E7\u00E3o no acesso ao evento.',
			'\u00C9 proibida a revenda de bilhetes fora da Plataforma sem autoriza\u00E7\u00E3o expressa do organizador.',
		],
	},
	{
		id: 'pagamentos',
		number: '5',
		title: 'Pagamentos e Reembolsos',
		content: [
			'A TicketZone disponibiliza os seguintes m\u00E9todos de pagamento: Multicaixa Express, PayPay e Refer\u00EAncias Multicaixa.',
			'O processamento dos pagamentos \u00E9 realizado atrav\u00E9s de entidades financeiras parceiras, estando sujeito \u00E0s condi\u00E7\u00F5es e termos dessas entidades.',
			'As pol\u00EDticas de cancelamento e reembolso s\u00E3o definidas pelo organizador de cada evento e devem ser consultadas antes da compra.',
			'Em caso de cancelamento do evento pelo organizador, o comprador ter\u00E1 direito ao reembolso integral do valor pago.',
			'O reembolso ser\u00E1 processado atrav\u00E9s do mesmo m\u00E9todo de pagamento utilizado na compra, no prazo de at\u00E9 10 dias \u00FAteis.',
		],
	},
	{
		id: 'organizadores',
		number: '6',
		title: 'Responsabilidades do Organizador',
		content: [
			'O organizador \u00E9 o \u00FAnico respons\u00E1vel pela veracidade das informa\u00E7\u00F5es do evento, incluindo data, local, hor\u00E1rio e condi\u00E7\u00F5es de acesso.',
			'O organizador compromete-se a realizar o evento conforme descrito na Plataforma, sob pena de reembolso integral aos compradores em caso de cancelamento ou altera\u00E7\u00E3o substancial.',
			'O organizador autoriza a TicketZone a cobrar e processar os pagamentos dos bilhetes em seu nome, mediante o pagamento de uma comiss\u00E3o acordada.',
			'O organizador \u00E9 respons\u00E1vel pela valida\u00E7\u00E3o dos bilhetes na entrada do evento, utilizando exclusivamente o sistema de valida\u00E7\u00E3o da TicketZone.',
		],
	},
	{
		id: 'propriedade-intelectual',
		number: '7',
		title: 'Propriedade Intelectual',
		content: [
			'Todos os direitos de propriedade intelectual sobre a Plataforma, incluindo design, software, log\u00F3tipos e conte\u00FAdo original, pertencem \u00E0 TicketZone ou foram licenciados a esta.',
			'O utilizador n\u00E3o poder\u00E1 reproduzir, distribuir, modificar ou criar obras derivadas da Plataforma sem autoriza\u00E7\u00E3o pr\u00E9via por escrito.',
			'Os organizadores mant\u00EAm todos os direitos sobre o conte\u00FAdo dos seus eventos, concedendo \u00E0 TicketZone uma licen\u00E7a para exibi\u00E7\u00E3o na Plataforma.',
		],
	},
	{
		id: 'limitacao-responsabilidade',
		number: '8',
		title: 'Limita\u00E7\u00E3o de Responsabilidade',
		content: [
			'A TicketZone atua como intermedi\u00E1ria entre compradores e organizadores, n\u00E3o sendo respons\u00E1vel pela execu\u00E7\u00E3o dos eventos ou pela conduta dos organizadores.',
			'Em nenhuma circunst\u00E2ncia a TicketZone ser\u00E1 respons\u00E1vel por danos indiretos, incidentais ou consequenciais decorrentes do uso da Plataforma.',
			'A responsabilidade m\u00E1xima da TicketZone em rela\u00E7\u00E3o a qualquer transa\u00E7\u00E3o est\u00E1 limitada ao valor dos bilhetes adquiridos nessa transa\u00E7\u00E3o.',
		],
	},
	{
		id: 'disposicoes-gerais',
		number: '9',
		title: 'Disposi\u00E7\u00F5es Gerais',
		content: [
			'Estes Termos s\u00E3o regidos pelas leis da Rep\u00FAblica de Angola.',
			'Qualquer lit\u00EDgio decorrente destes Termos ser\u00E1 resolvido nos tribunais da Comarca de Luanda, com expressa ren\u00FAncia a qualquer outro foro.',
			'Caso qualquer disposi\u00E7\u00E3o destes Termos seja considerada inv\u00E1lida ou inexequ\u00EDvel, as demais disposi\u00E7\u00F5es permanecer\u00E3o em pleno vigor e efeito.',
			'A TicketZone poder\u00E1 ceder os seus direitos e obriga\u00E7\u00F5es decorrentes destes Termos a terceiros, mediante notifica\u00E7\u00E3o aos utilizadores.',
		],
	},
]

export function Termos() {
	usePageTitle('Termos de Uso | TicketZone')

	return (
		<div>
			<section className="bg-surface-card border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
					<div className="max-w-4xl">
						<span className="text-sm font-heading font-700 text-brand uppercase tracking-wider slide-up">
							Legal
						</span>
						<h1
							className="font-display text-4xl sm:text-5xl lg:text-6xl mt-2 mb-4 slide-up"
							style={{ animationDelay: '80ms' }}
						>
							Termos de Uso
						</h1>
						<p
							className="text-text-secondary text-lg slide-up"
							style={{ animationDelay: '160ms' }}
						>
							\u00DAltima atualiza\u00E7\u00E3o: 1 de Janeiro de 2026
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<div className="max-w-4xl">
					{sections.map((section, i) => (
						<div
							key={section.id}
							id={section.id}
							className="mb-12 slide-up"
							style={{ animationDelay: `${i * 60}ms` }}
						>
							<div className="flex items-start gap-4 mb-4">
								<span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center font-heading font-700 text-sm shrink-0">
									{section.number}
								</span>
								<h2 className="font-heading font-700 text-xl pt-1">
									{section.title}
								</h2>
							</div>
							<div className="pl-13 space-y-3">
								{Array.isArray(section.content) ? (
									section.content.map((text, ti) => (
										<p
											key={ti}
											className="text-text-secondary text-sm leading-relaxed"
										>
											{text}
										</p>
									))
								) : (
									<p className="text-text-secondary text-sm leading-relaxed">
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
