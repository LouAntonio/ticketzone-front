import type { CategoryInfo } from '../../types/event'

interface CategoryNavProps {
	active: string
	onChange: (category: string) => void
	categories: CategoryInfo[]
}

export function CategoryNav({ active, onChange, categories }: CategoryNavProps) {
	return (
		<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
			<button
				onClick={() => onChange('')}
				className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-heading font-500 whitespace-nowrap transition-all shrink-0 ${
					active === ''
						? 'bg-brand text-white shadow-lg shadow-brand/30'
						: 'bg-surface-card text-text-secondary hover:bg-gray-100 border border-border'
				}`}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
				Todos
			</button>
			{categories.map((cat) => (
				<button
					key={cat.slug}
					onClick={() => onChange(cat.slug)}
					className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-heading font-500 whitespace-nowrap transition-all shrink-0 ${
						active === cat.slug
							? 'bg-brand text-white shadow-lg shadow-brand/30'
							: 'bg-surface-card text-text-secondary hover:bg-gray-100 border border-border'
					}`}
				>
					{cat.image ? (
						<img
							src={cat.image}
							alt={cat.name}
							className="w-5 h-5 rounded object-cover"
						/>
					) : (
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
						</svg>
					)}
					{cat.name}
				</button>
			))}
		</div>
	)
}
