export function formatKwanza(value: number): string {
	return new Intl.NumberFormat('pt-AO', {
		style: 'currency',
		currency: 'AOA',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value)
}

export function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('pt-AO', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

export function formatDateShort(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('pt-AO', {
		day: 'numeric',
		month: 'short',
	})
}

export function formatTime(time: string): string {
	const [hours, minutes] = time.split(':')
	return `${hours}:${minutes}`
}

export function getCategoryLabel(category: string): string {
	const labels: Record<string, string> = {
		conference: 'Conferências & Workshops',
		workshop: 'Workshops',
		theatre: 'Artes & Teatro',
		festival: 'Festivais',
		family: 'Família',
		party: 'Festas',
	}
	return labels[category] ?? category
}

export function getPeriodLabel(period: string): string {
	const labels: Record<string, string> = {
		morning: 'Manhã',
		afternoon: 'Tarde',
		night: 'Noite',
	}
	return labels[period] ?? period
}

export function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		confirmed: 'bg-emerald-500',
		pending: 'bg-amber-500',
		cancelled: 'bg-red-500',
		active: 'bg-emerald-500',
		used: 'bg-gray-500',
		draft: 'bg-gray-400',
		published: 'bg-brand',
		completed: 'bg-blue-500',
	}
	return colors[status] ?? 'bg-gray-400'
}
