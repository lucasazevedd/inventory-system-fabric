import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { registerSW } from "virtual:pwa-register"
import { router } from "./router"
import "./styles/global.css"

registerSW({
  immediate: true,
  onRegistered(reg){
    // eslint-disable-next-line no-console
    console.log("Service Worker registrado", reg)
  },
  onRegisterError(error){
    console.error("Falha ao registrar o Service Worker:", error)
  }
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
