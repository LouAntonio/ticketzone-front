import { Link } from 'react-router-dom'
import type { Event } from '../../types/event'
import { formatDate, formatKwanza, getCategoryLabel } from '../../lib/format'
import { Badge } from '../ui/Badge'

interface EventCardProps {
	event: Event
}

const categoryColors: Record<string, string> = {
	conference: 'blue',
	workshop: 'purple',
	theatre: 'pink',
	festival: 'brand',
	family: 'emerald',
	party: 'amber',
}

export function EventCard({ event }: EventCardProps) {
	const minPrice = Math.min(...event.ticketTypes.map((t) => t.price))

	return (
		<Link
			to={`/events/${event.slug}`}
			className="group card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 fade-in"
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
					<Badge
						variant={
							categoryColors[event.category] as
								| 'brand'
								| 'emerald'
								| 'amber'
								| 'red'
								| 'blue'
								| 'gray'
								| 'purple'
								| 'pink'
						}
					>
						{getCategoryLabel(event.category)}
					</Badge>
				</div>
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
						{formatDate(event.date)}
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
						{event.ticketTypes.reduce((s, t) => s + t.available, 0)} lugares
					</span>
				</div>
			</div>
		</Link>
	)
}
