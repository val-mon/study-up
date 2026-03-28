import "../css/Login.css";

export default function Login() {

    function verifieEmail(e) {
        e.preventDefault();
        alert("TODO: Send email");
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h1><font color="#3400ff">L</font>ogin</h1>
                <form className="login-form">
                    <label htmlFor="email" id="label">
                        Enter your email
                    </label>
                    <input type="email" id="email" name="email" required />
                    <button className="send-mail" onClick={verifieEmail}>Check Email</button>
                </form>
            </div>
        </div>
    )
}
