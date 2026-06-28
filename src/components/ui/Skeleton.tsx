interface SkeletonProps {
	className?: string
	variant?: 'light' | 'dark'
}

interface SkeletonTextProps {
	lines?: number
	className?: string
	variant?: 'light' | 'dark'
}

interface SkeletonTableProps {
	rows?: number
	cols?: number
	className?: string
	variant?: 'light' | 'dark'
}

interface SkeletonCardProps {
	className?: string
	variant?: 'light' | 'dark'
}

const baseLight = 'bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200'
const baseDark = 'bg-gradient-to-r from-[#2a2a2a] via-[#353535] to-[#2a2a2a]'

const shimmer = 'bg-[length:200%_100%] animate-[skeleton_1.5s_ease-in-out_infinite]'

export function Skeleton({ className = '', variant = 'light' }: SkeletonProps) {
	return (
		<div
			className={`rounded-lg ${variant === 'dark' ? baseDark : baseLight} ${shimmer} ${className}`}
		/>
	)
}

export function SkeletonText({ lines = 2, className = '', variant = 'light' }: SkeletonTextProps) {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					variant={variant}
					className={`h-3 ${i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full'}`}
				/>
			))}
		</div>
	)
}

export function SkeletonTable({
	rows = 5,
	cols = 4,
	className = '',
	variant = 'light',
}: SkeletonTableProps) {
	return (
		<div className={`flex flex-col gap-3 ${className}`}>
			{Array.from({ length: rows }).map((_, r) => (
				<div key={r} className="flex items-center gap-4">
					{Array.from({ length: cols }).map((_, c) => (
						<Skeleton
							key={c}
							variant={variant}
							className={`h-4 ${c === 0 ? 'flex-1' : c === cols - 1 ? 'w-20' : 'w-28'}`}
						/>
					))}
				</div>
			))}
		</div>
	)
}

export function SkeletonCard({ className = '', variant = 'light' }: SkeletonCardProps) {
	return (
		<div
			className={`card overflow-hidden ${className}`}
		>
			<Skeleton variant={variant} className="aspect-[16/10] w-full rounded-none" />
			<div className="p-4 space-y-3">
				<Skeleton variant={variant} className="h-4 w-3/4" />
				<Skeleton variant={variant} className="h-3 w-1/2" />
				<Skeleton variant={variant} className="h-3 w-full" />
				<div className="pt-3 flex items-center justify-between">
					<Skeleton variant={variant} className="h-6 w-24 rounded-md" />
					<Skeleton variant={variant} className="h-9 w-24 rounded-lg" />
				</div>
			</div>
		</div>
	)
}
