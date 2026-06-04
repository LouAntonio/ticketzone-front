import type { ReactNode } from 'react'

interface BadgeProps {
	children: ReactNode
	variant?: 'brand' | 'emerald' | 'amber' | 'red' | 'blue' | 'gray' | 'purple' | 'pink'
	className?: string
}

const variants: Record<string, string> = {
	brand: 'bg-brand-soft text-brand',
	emerald: 'bg-emerald-50 text-emerald-700',
	amber: 'bg-amber-50 text-amber-700',
	red: 'bg-red-50 text-red-700',
	blue: 'bg-blue-50 text-blue-700',
	gray: 'bg-gray-100 text-gray-600',
	purple: 'bg-purple-50 text-purple-700',
	pink: 'bg-pink-50 text-pink-700',
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center px-3 py-1 text-xs font-heading font-600 rounded-full ${variants[variant]} ${className}`}
		>
			{children}
		</span>
	)
}
