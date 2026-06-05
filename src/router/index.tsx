import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { OrganizerRoute } from './OrganizerRoute'
import { AdminRoute } from './AdminRoute'
import { RootLayout } from './RootLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { AdminLayout } from '../components/layout/AdminLayout'

// Public
import { LandingPage } from '../pages/public/LandingPage'
import { EventCatalog } from '../pages/public/EventCatalog'
import { EventDetail } from '../pages/public/EventDetail'
import { Sobre } from '../pages/public/Sobre'
import { Ajuda } from '../pages/public/Ajuda'
import { ComoFunciona } from '../pages/public/ComoFunciona'
import { Termos } from '../pages/public/Termos'
import { Privacidade } from '../pages/public/Privacidade'
import { Contacto } from '../pages/public/Contacto'

// Auth
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'

// Buyer
import { BuyerDashboard } from '../pages/buyer/Dashboard'
import { MyTickets } from '../pages/buyer/MyTickets'
import { CheckoutPage } from '../pages/buyer/CheckoutPage'

// Organizer
import { OrganizerDashboard } from '../pages/organizer/Dashboard'
import { EventList } from '../pages/organizer/EventList'
import { EventForm } from '../pages/organizer/EventForm'
import { SalesAnalytics } from '../pages/organizer/SalesAnalytics'
import { AttendeeList } from '../pages/organizer/AttendeeList'
import { OrgSettings } from '../pages/organizer/Settings'

// Validation
import { ValidationPortal } from '../pages/validation/ValidationPortal'

// Admin
import { AdminDashboard } from '../pages/admin/Dashboard'
import { AdminUsers } from '../pages/admin/Users'
import { AdminEvents } from '../pages/admin/Events'
import { AdminOrders } from '../pages/admin/Orders'
import { AdminOrganizers } from '../pages/admin/Organizers'
import { AdminFinancial } from '../pages/admin/Financial'
import { AdminFleet } from '../pages/admin/Fleet'

// Rentals
import { CarCatalog } from '../pages/public/CarCatalog'

export const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{
				element: <PublicLayout />,
				children: [
					{ path: '/', element: <LandingPage /> },
					{ path: '/events', element: <EventCatalog /> },
					{ path: '/events/:slug', element: <EventDetail /> },
					{ path: '/rentals', element: <CarCatalog /> },
					{ path: '/sobre', element: <Sobre /> },
					{ path: '/ajuda', element: <Ajuda /> },
					{ path: '/como-funciona', element: <ComoFunciona /> },
					{ path: '/termos', element: <Termos /> },
					{ path: '/privacidade', element: <Privacidade /> },
					{ path: '/contacto', element: <Contacto /> },
				],
			},

			// Auth routes (no layout)
			{ path: '/login', element: <LoginPage /> },
			{ path: '/register', element: <RegisterPage /> },

			// Buyer routes
			{
				element: <ProtectedRoute />,
				children: [
					{
						element: <DashboardLayout />,
						children: [
							{ path: '/account', element: <BuyerDashboard /> },
							{ path: '/account/tickets', element: <MyTickets /> },
						],
					},
				],
			},

			// Checkout (minimal layout)
			{
				element: <ProtectedRoute />,
				children: [{ path: '/checkout/:eventId', element: <CheckoutPage /> }],
			},

			// Organizer routes
			{
				element: <OrganizerRoute />,
				children: [
					{
						element: <DashboardLayout />,
						children: [
							{ path: '/organizer', element: <OrganizerDashboard /> },
							{ path: '/organizer/events', element: <EventList /> },
							{ path: '/organizer/events/new', element: <EventForm /> },
							{ path: '/organizer/events/:id', element: <EventForm /> },
							{ path: '/organizer/events/:id/sales', element: <SalesAnalytics /> },
							{ path: '/organizer/attendees', element: <AttendeeList /> },
							{ path: '/organizer/settings', element: <OrgSettings /> },
						],
					},
				],
			},

			// Admin routes
			{
				element: <AdminRoute />,
				children: [
					{
						element: <AdminLayout />,
						children: [
							{ path: '/admin', element: <AdminDashboard /> },
							{ path: '/admin/users', element: <AdminUsers /> },
							{ path: '/admin/events', element: <AdminEvents /> },
							{ path: '/admin/orders', element: <AdminOrders /> },
							{ path: '/admin/organizers', element: <AdminOrganizers /> },
							{ path: '/admin/financial', element: <AdminFinancial /> },
							{ path: '/admin/fleet', element: <AdminFleet /> },
						],
					},
				],
			},

			// Validation
			{
				element: <ProtectedRoute />,
				children: [{ path: '/validate', element: <ValidationPortal /> }],
			},

			{ path: '*', element: <Navigate to="/" replace /> },
		],
	},
])
