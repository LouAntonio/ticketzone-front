import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
	value: string
	label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	options: SelectOption[]
	placeholder?: string
}

export function Select({ label, options, placeholder, className = '', ...props }: SelectProps) {
	return (
		<div className="flex flex-col gap-1.5">
			{label && (
				<label className="text-sm font-heading font-600 text-text-secondary">{label}</label>
			)}
			<select
				className={`input-field appearance-none bg-no-repeat ${className}`}
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2378716C' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
					backgroundPosition: 'right 1rem center',
					backgroundSize: '12px',
				}}
				{...props}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	)
}
