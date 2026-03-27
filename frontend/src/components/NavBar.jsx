import { Link, useLocation } from "react-router";
import '../css/NavBar.css';

function NavBar() {
    const { pathname } = useLocation()
    const isHome = pathname === "/"

    return (
        <header>
            <Link to="/dashboard">
                <img src="/src/assets/logo.svg" className="logo" />
            </Link>

            {isHome ? (
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

export default NavBar;
