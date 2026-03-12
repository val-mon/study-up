import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home() {
    };

function NavBar(props) {
    const {page} = props
    const navigate = useNavigate()

    return (
        <>
            <Link to="/">
                <img src="./src/assets/log.svg" classname="logo"/>
            </Link>
            {(page === "Home") && <Home />}
        </>
    )
}

export default NavBar;