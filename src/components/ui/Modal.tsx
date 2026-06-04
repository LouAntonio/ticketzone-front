import type { ReactNode } from 'react'

interface ModalProps {
	open: boolean
	onClose: () => void
	title?: string
	children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
			<div
				className="relative w-full max-w-lg card p-6 fade-in max-h-[85vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-heading font-700">{title}</h2>
						<button
							onClick={onClose}
							className="text-text-secondary hover:text-text transition-colors"
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path
									d="M15 5L5 15M5 5l10 10"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
				)}
				{children}
			</div>
		</div>
	)
}
