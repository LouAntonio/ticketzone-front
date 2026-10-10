import { Link } from 'react-router-dom'
import type { Event } from '../../types/event'
import { formatDate, formatKwanza } from '../../lib/format'
import { Badge } from '../ui/Badge'

interface EventCardProps {
	event: Event
}

const badgeVariants = ['brand', 'blue', 'purple', 'pink', 'emerald', 'amber'] as const

function badgeVariant(slug: string): (typeof badgeVariants)[number] {
	let hash = 0
	for (let i = 0; i < slug.length; i++) {
		hash = slug.charCodeAt(i) + ((hash << 5) - hash)
	}
	return badgeVariants[Math.abs(hash) % badgeVariants.length]
}

export function EventCard({ event }: EventCardProps) {
	const tickets = event.ticketTypes ?? []
	const minPrice = tickets.length > 0 ? Math.min(...tickets.map((t) => t.price)) : 0
	const firstCat = event.eventCategories?.[0]?.category
	const catSlug = firstCat?.slug ?? ''
	const catName = firstCat?.name ?? ''

	return (
		<Link
			to={`/events/${event.slug}`}
			className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 fade-in"
		>
			<div className="relative aspect-[16/10] overflow-hidden">
				<img
					src={event.coverImage}
					alt={event.title}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
				<div className="absolute top-3 left-3">
					<Badge variant={badgeVariant(catSlug)}>{catName}</Badge>
				</div>
				{event.featured && (
					<div className="absolute top-3 right-3">
						<div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-[11px] font-700 text-amber-950 uppercase tracking-wider shadow-md rotate-2">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="currentColor"
								stroke="none"
							>
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
							Destaque
						</div>
					</div>
				)}
			</div>

			<div className="p-5">
				<h3 className="font-heading font-700 text-lg mb-2 line-clamp-1 group-hover:text-brand transition-colors">
					{event.title}
				</h3>

				<div className="flex flex-col gap-1.5 text-sm text-text-secondary mb-4">
					<div className="flex items-center gap-2">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
						{formatDate(event.date ?? '')}
					</div>
					<div className="flex items-center gap-2">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
						{event.venue}, {event.province}
					</div>
				</div>

				<div className="flex items-center justify-between pt-4 border-t border-border">
					<div>
						<span className="text-xs text-text-secondary">A partir de</span>
						<p className="font-heading font-700 text-lg text-brand">
							{formatKwanza(minPrice)}
						</p>
					</div>
					<span className="text-xs text-text-secondary">
						{tickets.reduce((s, t) => s + t.available, 0)} lugares
					</span>
				</div>
			</div>
		</Link>
	)
}
