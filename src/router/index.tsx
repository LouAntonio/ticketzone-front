import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { OrganizerRoute } from './OrganizerRoute'
import { RootLayout } from './RootLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'

// Public
import { LandingPage } from '../pages/public/LandingPage'
import { EventCatalog } from '../pages/public/EventCatalog'
import { EventDetail } from '../pages/public/EventDetail'

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

			// Validation
			{
				element: <ProtectedRoute />,
				children: [{ path: '/validate', element: <ValidationPortal /> }],
			},

			{ path: '*', element: <Navigate to="/" replace /> },
		],
	},
])
