import { Link, useLocation } from "react-router";

function NavBar() {
    const { pathname } = useLocation()

    return (
        <>
            <Link to="/">
                <img src="/src/assets/logo.svg" className="logo" />
            </Link>
            {pathname === "/" && <></>}
        </>
    )
}

export default NavBar;
