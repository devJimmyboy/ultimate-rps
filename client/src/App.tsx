import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"
import Background from "./components/Background"
import DuelPage from "./components/DuelPage"
import HUD from "./components/HUD"

function App() {
  return (
    <div className="App">
      <Background />
      <DuelPage />
      <HUD />
    </div>
  )
}

export default App
