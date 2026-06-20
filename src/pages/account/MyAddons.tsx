import { Link } from 'react-router-dom'
import { useMyAddons } from '../../api/hooks/useTickets'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { QRCodeSVG } from 'qrcode.react'
import type { AddonInstance } from '../../types/ticket'

const statusVariant: Record<string, 'emerald' | 'gray' | 'red'> = {
	active: 'emerald',
	used: 'gray',
	cancelled: 'red',
}

const statusLabel: Record<string, string> = {
	ACTIVE: 'Ativo',
	USED: 'Usado',
	CANCELLED: 'Cancelado',
	VOIDED: 'Anulado',
}

export function MyAddonsPage() {
	const { data, isLoading } = useMyAddons()

	const instances: AddonInstance[] = Array.isArray(data) ? data : (data?.data ?? [])

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-display-alt font-700 text-2xl text-warm-text mb-1">
						Os Meus Add-ons
					</h1>
					<p className="text-text-secondary text-sm">Gerir os add-ons adquiridos</p>
				</div>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-20 w-full rounded-xl" />
					))}
				</div>
			) : instances.length === 0 ? (
				<div className="card-account">
					<div className="p-12 text-center">
						<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-soft flex items-center justify-center">
							<svg
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								className="text-brand"
							>
								<path d="M20 12H4M12 4v16" />
							</svg>
						</div>
						<p className="font-heading font-600 text-warm-text mb-2">
							Nenhum add-on encontrado
						</p>
						<p className="text-sm text-text-secondary mb-6">
							Os add-ons que comprares aparecerão aqui.
						</p>
						<Link
							to="/events"
							className="btn-brand h-11 px-6 rounded-xl inline-flex items-center gap-2 text-sm font-heading font-600"
						>
							Explorar Eventos
						</Link>
					</div>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 gap-3">
					{instances.map((instance) => (
						<Link
							key={instance.id}
							to={`/account/addons/${instance.id}`}
							className="card-account hover:shadow-md hover:border-brand/20 transition-all group"
						>
							<div className="p-4 flex items-center gap-4">
								<div className="w-16 h-16 shrink-0 bg-white rounded-xl border-2 border-warm-border flex items-center justify-center overflow-hidden">
									<QRCodeSVG value={instance.qrSecret} size={56} level="M" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<p className="font-heading font-600 text-sm text-warm-text group-hover:text-brand transition-colors truncate">
											{instance.addonName}
										</p>
										<Badge
											variant={
												statusVariant[
													instance.status.toLowerCase() as keyof typeof statusVariant
												] ?? 'gray'
											}
											className="text-xs shrink-0"
										>
											{statusLabel[instance.status] ?? instance.status}
										</Badge>
									</div>
									<p className="text-xs text-text-secondary truncate">
										{instance.event?.title ?? 'Evento'}
									</p>
									<p className="text-xs text-text-secondary">
										{instance.entriesUsed}/{instance.entriesAllowed} entradas
										usadas
									</p>
								</div>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-text-secondary shrink-0 group-hover:text-brand transition-colors"
								>
									<path d="M9 18l6-6-6-6" />
								</svg>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
