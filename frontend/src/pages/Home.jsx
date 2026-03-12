import NavBar from "../components/NavBar";
import "../css/Home.css";

function Home() {
    return (
        <>
            <NavBar page="Home" />
            <div classname="hero">
                <h1>Don't Study Hard, Study Smart!</h1>
                <p>Maximize your learning efficiency with our smart study platform that helps you stay organized.
                    All the tools you need for a comfortable and productive study experience, all in one place !</p>
            </div>
        </>
    )
}


export default Home;