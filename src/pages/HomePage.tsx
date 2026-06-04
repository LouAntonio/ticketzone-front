import { useAuthStore } from '../stores/useAuthStore'

export function HomePage() {
	const { user, clear } = useAuthStore()

	return (
		<main className="min-h-screen p-8">
			<header className="mx-auto flex max-w-4xl items-center justify-between">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
					Ticketzone
				</h1>
				<div className="flex items-center gap-3">
					<span className="text-sm text-gray-600 dark:text-gray-300">{user?.name}</span>
					<button
						type="button"
						onClick={clear}
						className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
					>
						Sair
					</button>
				</div>
			</header>
			<section className="mx-auto mt-12 max-w-4xl">
				<p className="text-gray-600 dark:text-gray-300">Bem-vindo ao Ticketzone.</p>
			</section>
		</main>
	)
}
