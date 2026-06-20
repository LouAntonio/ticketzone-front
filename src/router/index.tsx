import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RedirectIfAuthenticated } from './RedirectIfAuthenticated'
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
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage'

// Buyer
import { MyTickets } from '../pages/buyer/MyTickets'
import { AccountDashboard } from '../pages/account/Dashboard'
import { ProfilePage } from '../pages/account/Profile'
import { OrdersPage } from '../pages/account/Orders'
import { OrderDetailPage } from '../pages/account/OrderDetail'
import { TicketDetailPage } from '../pages/account/TicketDetail'
import { AddonDetailPage } from '../pages/account/AddonDetail'
import { BecomePromoterPage } from '../pages/account/BecomePromoter'
import { SecurityPage } from '../pages/account/Security'
import { CheckoutPage } from '../pages/buyer/CheckoutPage'

// Organizer
import { OrganizerDashboard } from '../pages/organizer/Dashboard'
import { EventList } from '../pages/organizer/EventList'
import { EventForm } from '../pages/organizer/EventForm'
import { SalesAnalytics } from '../pages/organizer/SalesAnalytics'
import { AttendeeList } from '../pages/organizer/AttendeeList'
import { OrgSettings } from '../pages/organizer/Settings'
import { StaffList } from '../pages/organizer/StaffList'

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
import { AdminCategories } from '../pages/admin/Categories'

// Rentals
import { CarCatalog } from '../pages/public/CarCatalog'
import { CarDetail } from '../pages/public/CarDetail'
import { MyRentalsPage } from '../pages/account/MyRentals'
import { RentalDetailPage } from '../pages/account/RentalDetail'

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
					{ path: '/rentals/:slug', element: <CarDetail /> },
					{ path: '/sobre', element: <Sobre /> },
					{ path: '/ajuda', element: <Ajuda /> },
					{ path: '/como-funciona', element: <ComoFunciona /> },
					{ path: '/termos', element: <Termos /> },
					{ path: '/privacidade', element: <Privacidade /> },
					{ path: '/contacto', element: <Contacto /> },
				],
			},

			// Auth routes (redirect if already logged in)
			{
				element: <RedirectIfAuthenticated />,
				children: [
					{ path: '/login', element: <LoginPage /> },
					{ path: '/register', element: <RegisterPage /> },
					{ path: '/forgot-password', element: <ForgotPasswordPage /> },
					{ path: '/resetar-senha', element: <ResetPasswordPage /> },
					{ path: '/verificar-email', element: <VerifyEmailPage /> },
				],
			},

			// Buyer routes
			{
				element: <ProtectedRoute />,
				children: [
					{
						element: <DashboardLayout />,
						children: [
							{ path: '/account', element: <AccountDashboard /> },
							{ path: '/account/tickets', element: <MyTickets /> },
							{ path: '/account/tickets/:id', element: <TicketDetailPage /> },
							{ path: '/account/addons/:id', element: <AddonDetailPage /> },
							{ path: '/account/orders', element: <OrdersPage /> },
							{ path: '/account/orders/:id', element: <OrderDetailPage /> },
							{ path: '/account/rentals', element: <MyRentalsPage /> },
							{ path: '/account/rentals/:id', element: <RentalDetailPage /> },
							{ path: '/account/profile', element: <ProfilePage /> },
							{ path: '/account/security', element: <SecurityPage /> },
							{ path: '/account/become-promoter', element: <BecomePromoterPage /> },
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
							{ path: '/organizer/events/:id/staff', element: <StaffList /> },
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
							{ path: '/admin/categories', element: <AdminCategories /> },
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
