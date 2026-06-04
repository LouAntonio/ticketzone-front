export const EVENT_CATEGORIES = [
	{ value: 'conference', label: 'Conferências & Workshops' },
	{ value: 'workshop', label: 'Workshops' },
	{ value: 'theatre', label: 'Artes & Teatro' },
	{ value: 'festival', label: 'Festivais' },
	{ value: 'family', label: 'Família' },
	{ value: 'party', label: 'Festas' },
] as const

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

export const PAYMENT_METHODS = [
	{ value: 'multicaixa', label: 'Multicaixa Express', icon: '📱' },
	{ value: 'paypay', label: 'PayPay (QR Code)', icon: '📷' },
	{ value: 'reference', label: 'Referência Multicaixa', icon: '🏦' },
] as const
