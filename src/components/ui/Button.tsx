import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'brand' | 'outline' | 'ghost'
	size?: 'sm' | 'md' | 'lg'
	loading?: boolean
	children: ReactNode
}

export function Button({
	variant = 'brand',
	size = 'md',
	loading,
	children,
	className = '',
	disabled,
	...props
}: ButtonProps) {
	const sizes: Record<string, string> = {
		sm: 'h-9 px-4 text-sm',
		md: 'h-11 px-6 text-sm',
		lg: 'h-13 px-8 text-base',
	}

	const base = `btn-${variant} ${sizes[size]}`
	const state = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''

	return (
		<button
			className={`${base} ${state} ${className}`}
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
			)}
			{children}
		</button>
	)
}
