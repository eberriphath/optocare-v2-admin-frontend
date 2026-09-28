import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

import AdminLayout from "./components/layout/AdminLayout"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import ApplicationDetails from "./pages/ApplicationDetails"
import Partners from "./pages/Partners"
import PartnerDetails from "./pages/PartnerDetails"
import Services from "./pages/Services"
import ServiceDetails from "./pages/ServiceDetails"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Reviews from "./pages/Reviews"
import ReviewDetails from "./pages/ReviewDetails"
import ChangePassword from "./pages/ChangePassword"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Clients from "./pages/Clients"
import ClientDetails from "./pages/ClientDetails"
import Prescriptions from "./pages/Prescriptions"
import PrescriptionDetails from "./pages/PrescriptionDetails"
import Orders from "./pages/Orders"
import OrderDetails from "./pages/OrderDetails"

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route element={<ProtectedRoute />}>

            <Route element={<AdminLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/applications"
                element={<Applications />}
              />

              <Route
                path="/applications/:id"
                element={<ApplicationDetails />}
              />

              <Route
                path="/partners"
                element={<Partners />}
              />

              <Route 
                path="/partners/:id"
                element={<PartnerDetails />}
              />

              <Route
                path="/services"
                element={<Services />}
              />

              <Route
                path="/services/:id"
                element={<ServiceDetails />}
              />

              <Route
                path="/products"
                element={<Products />}
              />

              <Route
                path="/products/:id"
                element={<ProductDetails />}
              />

              <Route
                path="/clients"
                element={<Clients />}
              />

              <Route
                path="/clients/:id"
                element={<ClientDetails />}
              />

              <Route
                path="/prescriptions"
                element={<Prescriptions />}
              />

              <Route
                path="/prescriptions/:id"
                element={<PrescriptionDetails />}
              />

              <Route
                path="/orders"
                element={<Orders />}
              />

              <Route
                path="/orders/:id"
                element={<OrderDetails />}
              />

              <Route
                path="/reviews"
                element={<Reviews />}
              />
         
              <Route
                path="/reviews/:id"
                element={<ReviewDetails />}
              />

              <Route
                path="/change-password"
                element={<ChangePassword />}
              />

            </Route>

          </Route>

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  )
}

export default App