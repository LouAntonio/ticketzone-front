import { usePageTitle } from '../../hooks/usePageTitle'

interface Section {
	id: string
	number: string
	title: string
	content: string | string[]
}

const sections: Section[] = [
	{
		id: 'introducao',
		number: '1',
		title: 'Introdu\u00E7\u00E3o',
		content: [
			'A TicketZone valoriza a privacidade dos seus utilizadores e est\u00E1 comprometida com a prote\u00E7\u00E3o dos dados pessoais que lhe s\u00E3o confiados.',
			'A presente Pol\u00EDtica de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos as informa\u00E7\u00F5es dos utilizadores da nossa plataforma.',
			'Ao utilizar a TicketZone, o utilizador consente com as pr\u00E1ticas descritas nesta pol\u00EDtica.',
		],
	},
	{
		id: 'dados-recolhidos',
		number: '2',
		title: 'Dados que Recolhemos',
		content: [
			'Podemos recolher os seguintes tipos de dados pessoais:',
			'Dados de identifica\u00E7\u00E3o: nome completo, data de nascimento, n\u00FAmero de documento de identifica\u00E7\u00E3o;',
			'Dados de contacto: endere\u00E7o de email, n\u00FAmero de telefone, morada;',
			'Dados de conta: nome de utilizador, senha (armazenada de forma encriptada), prefer\u00EAncias;',
			'Dados de transa\u00E7\u00E3o: hist\u00F3rico de compras, m\u00E9todos de pagamento, valores transacionados;',
			'Dados de navega\u00E7\u00E3o: endere\u00E7o IP, tipo de dispositivo, navegador, p\u00E1ginas visitadas, tempo de sess\u00E3o.',
		],
	},
	{
		id: 'finalidade',
		number: '3',
		title: 'Finalidade do Tratamento de Dados',
		content: [
			'Os dados recolhidos s\u00E3o utilizados para as seguintes finalidades:',
			'Processar e gerir as transa\u00E7\u00F5es realizadas na Plataforma;',
			'Enviar bilhetes e confirma\u00E7\u00F5es por email e WhatsApp;',
			'Garantir a seguran\u00E7a da conta e prevenir fraudes;',
			'Personalizar a experi\u00EAncia do utilizador e recomendar eventos relevantes;',
			'Cumprir obriga\u00E7\u00F5es legais e regulat\u00F3rias aplic\u00E1veis;',
			'Melhorar os nossos servi\u00E7os e desenvolver novas funcionalidades;',
			'Comunicar altera\u00E7\u00F5es aos Termos de Uso ou a esta Pol\u00EDtica.',
		],
	},
	{
		id: 'base-legal',
		number: '4',
		title: 'Base Legal para o Tratamento',
		content: [
			'O tratamento dos dados pessoais \u00E9 realizado com base nas seguintes justificativas legais:',
			'Consentimento do titular dos dados para finalidades espec\u00EDficas;',
			'Execu\u00E7\u00E3o de contrato no qual o titular \u00E9 parte (utiliza\u00E7\u00E3o da Plataforma);',
			'Cumprimento de obriga\u00E7\u00F5es legais \u00E0s quais a TicketZone est\u00E1 sujeita;',
			'Interesse leg\u00EDtimo da TicketZone em melhorar os seus servi\u00E7os e garantir a seguran\u00E7a da Plataforma.',
		],
	},
	{
		id: 'partilha',
		number: '5',
		title: 'Partilha de Dados com Terceiros',
		content: [
			'A TicketZone poder\u00E1 partilhar dados pessoais com:',
			'Organizadores de eventos: informa\u00E7\u00F5es estritamente necess\u00E1rias para a valida\u00E7\u00E3o dos bilhetes e gest\u00E3o do evento;',
			'Entidades de pagamento: processadores de pagamento e institui\u00E7\u00F5es financeiras para a realiza\u00E7\u00E3o das transa\u00E7\u00F5es;',
			'Prestadores de servi\u00E7os: empresas de alojamento web, envio de emails, an\u00E1lises e suporte ao cliente;',
			'Autoridades legais: quando exigido por lei ou ordem judicial.',
			'A TicketZone n\u00E3o vende dados pessoais a terceiros para fins de marketing.',
		],
	},
	{
		id: 'armazenamento',
		number: '6',
		title: 'Armazenamento e Seguran\u00E7a dos Dados',
		content: [
			'Os dados pessoais s\u00E3o armazenados em servidores seguros, com medidas t\u00E9cnicas e organizacionais adequadas para proteger contra acesso n\u00E3o autorizado, altera\u00E7\u00E3o, divulga\u00E7\u00E3o ou destrui\u00E7\u00E3o.',
			'Implementamos as seguintes medidas de seguran\u00E7a:',
			'Encripta\u00E7\u00E3o SSL/TLS para transmiss\u00E3o de dados;',
			'Encripta\u00E7\u00E3o de senhas utilizando algoritmos de hash seguros (bcrypt);',
			'Acesso restrito aos dados com base no princ\u00EDpio do menor privil\u00E9gio;',
			'Monitoriza\u00E7\u00E3o cont\u00EDnua de atividades suspeitas.',
		],
	},
	{
		id: 'prazos',
		number: '7',
		title: 'Prazo de Conserva\u00E7\u00E3o dos Dados',
		content: [
			'Os dados pessoais s\u00E3o conservados pelo per\u00EDodo necess\u00E1rio para cumprir as finalidades para as quais foram recolhidos, incluindo obriga\u00E7\u00F5es legais, contabil\u00EDsticas e de presta\u00E7\u00E3o de contas.',
			'Dados de transa\u00E7\u00F5es: 5 anos ap\u00F3s a conclus\u00E3o da transa\u00E7\u00E3o (prazo fiscal);',
			'Dados de conta: at\u00E9 que o utilizador solicite a elimina\u00E7\u00E3o da sua conta;',
			'Dados de navega\u00E7\u00E3o: 12 meses ap\u00F3s a recolha.',
			'Ap\u00F3s o t\u00E9rmino do per\u00EDodo de conserva\u00E7\u00E3o, os dados s\u00E3o eliminados de forma segura.',
		],
	},
	{
		id: 'direitos',
		number: '8',
		title: 'Direitos do Titular dos Dados',
		content: [
			'O titular dos dados pessoais tem os seguintes direitos:',
			'Direito de acesso: solicitar informa\u00E7\u00E3o sobre os dados pessoais tratados;',
			'Direito de retifica\u00E7\u00E3o: solicitar a corre\u00E7\u00E3o de dados inexatos ou incompletos;',
			'Direito de elimina\u00E7\u00E3o: solicitar a elimina\u00E7\u00E3o dos seus dados pessoais (direito ao esquecimento);',
			'Direito de limita\u00E7\u00E3o: solicitar a restri\u00E7\u00E3o do tratamento dos seus dados;',
			'Direito de oposi\u00E7\u00E3o: opor-se ao tratamento dos dados para determinadas finalidades;',
			'Direito de portabilidade: solicitar a transfer\u00EAncia dos dados para outro prestador de servi\u00E7os.',
			'Para exercer qualquer um destes direitos, o utilizador deve contactar-nos atrav\u00E9s do email dpo@ticketzone.co.ao.',
		],
	},
	{
		id: 'cookies',
		number: '9',
		title: 'Cookies e Tecnologias Semelhantes',
		content: [
			'A TicketZone utiliza cookies e tecnologias semelhantes para melhorar a experi\u00EAncia de navega\u00E7\u00E3o, analisar o tr\u00E1fego e personalizar conte\u00FAdo.',
			'Tipos de cookies utilizados:',
			'Cookies essenciais: necess\u00E1rios para o funcionamento b\u00E1sico da Plataforma;',
			'Cookies de funcionalidade: para recordar prefer\u00EAncias do utilizador;',
			'Cookies anal\u00EDticos: para compreender como os utilizadores interagem com a Plataforma;',
			'Cookies de marketing: para apresentar conte\u00FAdo relevante (ap\u00F3s consentimento expl\u00EDcito).',
			'O utilizador pode gerir as suas prefer\u00EAncias de cookies atrav\u00E9s das defini\u00E7\u00F5es do seu navegador.',
		],
	},
	{
		id: 'contacto',
		number: '10',
		title: 'Contacto do Encarregado de Prote\u00E7\u00E3o de Dados',
		content: [
			'Para quest\u00F5es relacionadas com a prote\u00E7\u00E3o de dados pessoais, o utilizador pode contactar o nosso Encarregado de Prote\u00E7\u00E3o de Dados (DPO):',
			'Email: dpo@ticketzone.co.ao',
			'Morada: Luanda, Angola',
			'A TicketZone compromete-se a responder a todas as solicita\u00E7\u00F5es no prazo m\u00E1ximo de 30 dias.',
		],
	},
	{
		id: 'alteracoes',
		number: '11',
		title: 'Altera\u00E7\u00F5es a esta Pol\u00EDtica',
		content: [
			'A presente Pol\u00EDtica de Privacidade pode ser atualizada periodicamente para refletir altera\u00E7\u00F5es nas nossas pr\u00E1ticas ou na legisla\u00E7\u00E3o aplic\u00E1vel.',
			'Os utilizadores ser\u00E3o notificados sobre altera\u00E7\u00F5es significativas atrav\u00E9s do email de registo ou atrav\u00E9s de um aviso na Plataforma.',
			'Recomendamos a consulta regular desta p\u00E1gina para se manter informado sobre como protegemos os seus dados.',
		],
	},
]

export function Privacidade() {
	usePageTitle('Pol\u00EDtica de Privacidade | TicketZone')

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
							Pol\u00EDtica de Privacidade
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
							style={{ animationDelay: `${i * 50}ms` }}
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
