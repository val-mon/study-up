import { Link, useLocation } from "react-router";
import '../css/NavBar.css';

function NavBar() {
    const { pathname } = useLocation()

    return (
        <header>
            <a href="/">
                <img src="/src/assets/logo.svg" className="logo" />
            </a>

            <nav>
                <Link to="/" className={pathname === "/" ? "nav-active" : ""}>Dashboard</Link>
                <Link to="/courses" className={pathname === "/courses" ? "nav-active" : ""}>Courses</Link>
                <Link to="/account" className={pathname === "/account" ? "nav-active" : ""}>Account</Link>
            </nav>

            <div className="header-right">
                <p>Valentin Monod</p>
                <button>Logout</button>
            </div>
        </header>
    )
}

export default NavBar;
