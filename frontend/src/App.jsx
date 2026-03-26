import './css/App.css'
import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* insert routes here */}
          {/*<Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}

export default App
