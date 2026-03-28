import { Routes, Route, Navigate} from "react-router";
import { NavBar, Footer } from "./components";
import { Home, Login, Register, Dashboard, Courses, Account } from "./pages";
import './css/App.css'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/account" element={<Account />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  )
}
