export const PROVINCES = [
	'Bengo',
	'Benguela',
	'Bié',
	'Cabinda',
	'Cuando Cubango',
	'Cuanza Norte',
	'Cuanza Sul',
	'Cunene',
	'Huambo',
	'Huíla',
	'Luanda',
	'Lunda Norte',
	'Lunda Sul',
	'Malanje',
	'Moxico',
	'Namibe',
	'Uíge',
	'Zaire',
] as const

export const PERIODS = [
	{ value: 'morning', label: 'Manhã' },
	{ value: 'afternoon', label: 'Tarde' },
	{ value: 'night', label: 'Noite' },
] as const

/** Formato de realização de um evento. */
export const EVENT_FORMATS = [
	{ value: 'IN_PERSON', label: 'Presencial' },
	{ value: 'ONLINE', label: 'Online' },
	{ value: 'HYBRID', label: 'Híbrido' },
] as const

/**
 * Classificação etária mínima.
 *
 * O valor '' significa "sem restrição" e é guardado como `minAge: null`.
 * A lista é orientada — o valor enviado ao backend é sempre um número.
 */
export const AGE_RESTRICTIONS = [
	{ value: '', label: 'Sem restrição' },
	{ value: '6', label: '6+ anos' },
	{ value: '12', label: '12+ anos' },
	{ value: '16', label: '16+ anos' },
	{ value: '18', label: '18+ anos' },
] as const

/**
 * Idiomas principais de um evento (códigos BCP 47).
 *
 * Angola é multilingue — o valor por defeito é Português.
 */
export const EVENT_LANGUAGES = [
	{ value: 'pt', label: 'Português' },
	{ value: 'um', label: 'Kimbundu' },
	{ value: 'lnk', label: 'Kikongo' },
	{ value: 'lnb', label: 'Kwanhama' },
	{ value: 'en', label: 'Inglês' },
	{ value: 'fr', label: 'Francês' },
] as const

/** Rótulos legíveis para os códigos de idioma. */
export const EVENT_LANGUAGE_LABELS: Record<string, string> = Object.fromEntries(
	EVENT_LANGUAGES.map((lang) => [lang.value, lang.label]),
)

/** Rótulos legíveis para os formatos de evento. */
export const EVENT_FORMAT_LABELS: Record<string, string> = Object.fromEntries(
	EVENT_FORMATS.map((format) => [format.value, format.label]),
)

/**
 * Métodos de pagamento suportados.
 *
 * Ambos são processados pela AppyPay:
 *  - `multicaixa` → Multicaixa Express (GPO), via push notification ao telemóvel
 *  - `reference`  → Referência Multicaixa, paga em ATM ou Internet Banking
 */
export const PAYMENT_METHODS = [
	{
		value: 'multicaixa',
		label: 'Multicaixa Express',
		description: 'Recebes uma notificação no telemóvel e confirmas o pagamento',
		icon: 'phone',
	},
	{
		value: 'reference',
		label: 'Referência Multicaixa',
		description: 'Pagas numa ATM, Multicaixa Express ou Internet Banking',
		icon: 'bank',
	},
] as const
