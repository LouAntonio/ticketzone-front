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
