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
import Partners from "./pages/Partners"
import Services from "./pages/Services"
import Products from "./pages/Products"
import Reviews from "./pages/Reviews"

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
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
                path="/partners"
                element={<Partners />}
              />

              <Route
                path="/services"
                element={<Services />}
              />

              <Route
                path="/products"
                element={<Products />}
              />

              <Route
                path="/reviews"
                element={<Reviews />}
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