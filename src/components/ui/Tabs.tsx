import type { ReactNode } from 'react'

interface Tab {
	id: string
	label: string
	badge?: string | number
}

interface TabsProps {
	tabs: Tab[]
	active: string
	onChange: (id: string) => void
	children?: ReactNode
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
	return (
		<div className="flex gap-1 border-b border-border pb-0.5">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => onChange(tab.id)}
					className={`px-5 py-3 text-sm font-heading font-600 transition-all relative ${
						active === tab.id ? 'text-brand' : 'text-text-secondary hover:text-text'
					}`}
				>
					{tab.label}
					{tab.badge && (
						<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-brand-soft text-brand">
							{tab.badge}
						</span>
					)}
					{active === tab.id && (
						<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
					)}
				</button>
			))}
		</div>
	)
}
