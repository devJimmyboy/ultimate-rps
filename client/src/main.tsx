import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { io } from "socket.io-client"
import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"

if (import.meta.env.NODE_ENV === "development") {
  fetch("/login", { method: "POST", redirect: "follow" })
}

window.sock = io()

sock.on("connect", () => console.log("Connected to server"))
sock.on("disconnect", () => console.log("Disconnected from server"))
sock.on("connect_error", (err) => console.log("Connection error", err))

declare global {
  interface Window {
    sock: RPSClient
  }
  var sock: RPSClient
}

ReactDOM.render(
  <MantineProvider
    theme={{
      colorScheme: "dark",
      fontFamily: "Segoe UI, sans-serif",
      headings: { fontFamily: "'Lilita One', Roboto, sans-serif" },
    }}>
    <NotificationsProvider position="top-right" zIndex={2077}>
      <App />
    </NotificationsProvider>
  </MantineProvider>,
  document.getElementById("root")
)
