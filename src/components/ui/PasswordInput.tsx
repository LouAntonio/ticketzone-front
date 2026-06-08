import { useState } from 'react'
import { Input } from './Input'
import type { InputHTMLAttributes } from 'react'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	label?: string
	error?: string
}

export function PasswordInput(props: PasswordInputProps) {
	const [show, setShow] = useState(false)

	return (
		<div className="relative">
			<Input {...props} type={show ? 'text' : 'password'} />
			<button
				type="button"
				onClick={() => setShow((s) => !s)}
				className="absolute right-3 top-1/2 translate-y-1 text-text-secondary hover:text-text transition-colors"
				tabIndex={-1}
				aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
			>
				{show ? (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
						<path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
						<line x1="1" y1="1" x2="23" y2="23" />
						<path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
					</svg>
				) : (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
						<circle cx="12" cy="12" r="3" />
					</svg>
				)}
			</button>
		</div>
	)
}
