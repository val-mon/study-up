import { Link, useLocation } from "react-router";
import logo from '../assets/logo.svg';
import '../css/NavBar.css';

export default function NavBar() {
    const { pathname } = useLocation()
    const isLogged = ["/", "/login", "/register"].includes(pathname)

    return (
        <header>
            <Link to="/dashboard">
                <img src={logo} className="logo" />
            </Link>

            {isLogged ? (
                <div className="header-right">
                    <button>Login</button>
                    <button>Sign Up</button>
                </div>
            ) : (
                <>
                    <nav>
                        <Link to="/dashboard" className={pathname === "/dashboard" ? "nav-active" : ""}>Dashboard</Link>
                        <Link to="/courses" className={pathname === "/courses" ? "nav-active" : ""}>Courses</Link>
                        <Link to="/account" className={pathname === "/account" ? "nav-active" : ""}>Account</Link>
                    </nav>
                    <div className="header-right">
                        <p>Valentin Monod</p>
                        <button>Logout</button>
                    </div>
                </>
            )}
        </header>
    )
}
