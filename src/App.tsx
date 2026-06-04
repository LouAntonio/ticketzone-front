import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from './api/queryClient'
import { router } from './router'

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster
				position="top-right"
				toastOptions={{
					style: {
						borderRadius: '12px',
						fontFamily: 'Nunito, sans-serif',
						fontSize: '14px',
					},
				}}
			/>
		</QueryClientProvider>
	)
}
