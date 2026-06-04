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
		title: 'Introdução',
		content: [
			'A TicketZone valoriza a privacidade dos seus utilizadores e está comprometida com a proteção dos dados pessoais que lhe são confiados.',
			'A presente Política de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos as informações dos utilizadores da nossa plataforma.',
			'Ao utilizar a TicketZone, o utilizador consente com as práticas descritas nesta política.',
		],
	},
	{
		id: 'dados-recolhidos',
		number: '2',
		title: 'Dados que Recolhemos',
		content: [
			'Podemos recolher os seguintes tipos de dados pessoais:',
			'Dados de identificação: nome completo, data de nascimento, número de documento de identificação;',
			'Dados de contacto: endereço de email, número de telefone, morada;',
			'Dados de conta: nome de utilizador, senha (armazenada de forma encriptada), preferências;',
			'Dados de transação: histórico de compras, métodos de pagamento, valores transacionados;',
			'Dados de navegação: endereço IP, tipo de dispositivo, navegador, páginas visitadas, tempo de sessão.',
		],
	},
	{
		id: 'finalidade',
		number: '3',
		title: 'Finalidade do Tratamento de Dados',
		content: [
			'Os dados recolhidos são utilizados para as seguintes finalidades:',
			'Processar e gerir as transações realizadas na Plataforma;',
			'Enviar bilhetes e confirmações por email e WhatsApp;',
			'Garantir a segurança da conta e prevenir fraudes;',
			'Personalizar a experiência do utilizador e recomendar eventos relevantes;',
			'Cumprir obrigações legais e regulatórias aplicáveis;',
			'Melhorar os nossos serviços e desenvolver novas funcionalidades;',
			'Comunicar alterações aos Termos de Uso ou a esta Política.',
		],
	},
	{
		id: 'base-legal',
		number: '4',
		title: 'Base Legal para o Tratamento',
		content: [
			'O tratamento dos dados pessoais é realizado com base nas seguintes justificativas legais:',
			'Consentimento do titular dos dados para finalidades específicas;',
			'Execução de contrato no qual o titular é parte (utilização da Plataforma);',
			'Cumprimento de obrigações legais às quais a TicketZone está sujeita;',
			'Interesse legítimo da TicketZone em melhorar os seus serviços e garantir a segurança da Plataforma.',
		],
	},
	{
		id: 'partilha',
		number: '5',
		title: 'Partilha de Dados com Terceiros',
		content: [
			'A TicketZone poderá partilhar dados pessoais com:',
			'Organizadores de eventos: informações estritamente necessárias para a validação dos bilhetes e gestão do evento;',
			'Entidades de pagamento: processadores de pagamento e instituições financeiras para a realização das transações;',
			'Prestadores de serviços: empresas de alojamento web, envio de emails, análises e suporte ao cliente;',
			'Autoridades legais: quando exigido por lei ou ordem judicial.',
			'A TicketZone não vende dados pessoais a terceiros para fins de marketing.',
		],
	},
	{
		id: 'armazenamento',
		number: '6',
		title: 'Armazenamento e Segurança dos Dados',
		content: [
			'Os dados pessoais são armazenados em servidores seguros, com medidas técnicas e organizacionais adequadas para proteger contra acesso não autorizado, alteração, divulgação ou destruição.',
			'Implementamos as seguintes medidas de segurança:',
			'Encriptação SSL/TLS para transmissão de dados;',
			'Encriptação de senhas utilizando algoritmos de hash seguros (bcrypt);',
			'Acesso restrito aos dados com base no princípio do menor privilégio;',
			'Monitorização contínua de atividades suspeitas.',
		],
	},
	{
		id: 'prazos',
		number: '7',
		title: 'Prazo de Conservação dos Dados',
		content: [
			'Os dados pessoais são conservados pelo período necessário para cumprir as finalidades para as quais foram recolhidos, incluindo obrigações legais, contabilísticas e de prestação de contas.',
			'Dados de transações: 5 anos após a conclusão da transação (prazo fiscal);',
			'Dados de conta: até que o utilizador solicite a eliminação da sua conta;',
			'Dados de navegação: 12 meses após a recolha.',
			'Após o término do período de conservação, os dados são eliminados de forma segura.',
		],
	},
	{
		id: 'direitos',
		number: '8',
		title: 'Direitos do Titular dos Dados',
		content: [
			'O titular dos dados pessoais tem os seguintes direitos:',
			'Direito de acesso: solicitar informação sobre os dados pessoais tratados;',
			'Direito de retificação: solicitar a correção de dados inexatos ou incompletos;',
			'Direito de eliminação: solicitar a eliminação dos seus dados pessoais (direito ao esquecimento);',
			'Direito de limitação: solicitar a restrição do tratamento dos seus dados;',
			'Direito de oposição: opor-se ao tratamento dos dados para determinadas finalidades;',
			'Direito de portabilidade: solicitar a transferência dos dados para outro prestador de serviços.',
			'Para exercer qualquer um destes direitos, o utilizador deve contactar-nos através do email dpo@ticketzone.co.ao.',
		],
	},
	{
		id: 'cookies',
		number: '9',
		title: 'Cookies e Tecnologias Semelhantes',
		content: [
			'A TicketZone utiliza cookies e tecnologias semelhantes para melhorar a experiência de navegação, analisar o tráfego e personalizar conteúdo.',
			'Tipos de cookies utilizados:',
			'Cookies essenciais: necessários para o funcionamento básico da Plataforma;',
			'Cookies de funcionalidade: para recordar preferências do utilizador;',
			'Cookies analíticos: para compreender como os utilizadores interagem com a Plataforma;',
			'Cookies de marketing: para apresentar conteúdo relevante (após consentimento explícito).',
			'O utilizador pode gerir as suas preferências de cookies através das definições do seu navegador.',
		],
	},
	{
		id: 'contacto',
		number: '10',
		title: 'Contacto do Encarregado de Proteção de Dados',
		content: [
			'Para questões relacionadas com a proteção de dados pessoais, o utilizador pode contactar o nosso Encarregado de Proteção de Dados (DPO):',
			'Email: dpo@ticketzone.co.ao',
			'Morada: Luanda, Angola',
			'A TicketZone compromete-se a responder a todas as solicitações no prazo máximo de 30 dias.',
		],
	},
	{
		id: 'alteracoes',
		number: '11',
		title: 'Alterações a esta Política',
		content: [
			'A presente Política de Privacidade pode ser atualizada periodicamente para refletir alterações nas nossas práticas ou na legislação aplicável.',
			'Os utilizadores serão notificados sobre alterações significativas através do email de registo ou através de um aviso na Plataforma.',
			'Recomendamos a consulta regular desta página para se manter informado sobre como protegemos os seus dados.',
		],
	},
]

export function Privacidade() {
	usePageTitle('Política de Privacidade | TicketZone')

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
							Política
							<br />
							de Privacidade
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
							style={{ animationDelay: `${i * 50}ms` }}
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
