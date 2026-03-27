import './css/App.css'
import { Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <NavBar />
      <Dashboard />
      {/* <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main> */}
      <Footer />
    </>
  )
}

export default App
