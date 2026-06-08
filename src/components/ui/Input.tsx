import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label className="text-sm font-heading font-600 text-text-secondary">{label}</label>
			)}
			<input
				className={`input-field ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
				{...props}
			/>
			{error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
		</div>
	)
}
