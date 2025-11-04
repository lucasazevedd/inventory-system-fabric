import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "./App"
import Login from "./pages/Login"
import ProductsList from "./pages/ProductsList"
import ProductForm from "./pages/ProductForm"
import MovementForm from "./pages/MovementForm"

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ProductsList /> },
      { path: "produtos/novo", element: <ProductForm /> },
      { path: "produtos/:id/editar", element: <ProductForm /> },
      { path: "movimentar", element: <MovementForm /> },
      { path: "*", element: <Navigate to="/" /> }
    ]
  }
])