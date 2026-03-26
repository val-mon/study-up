import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import './css/App.css'
import Home from "./pages/Home";

function App() {
  return (
    <>
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
