import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route element={<PrivateRoute />}>
				<Route path="/" element={<HomePage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
