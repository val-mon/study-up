import "../css/Login_Register.css";

export default function Register() {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1><span style={{ color: "#3400ff" }}>R</span>egister</h1>
                <form>
                    <label htmlFor="name" id="name-label">
                        Enter your name
                    </label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="email" id="email-label">
                        Enter your email
                    </label>
                    <input type="email" id="email" name="email" required/>
                    <button onClick={() => alert("TODO: Verify code")}>Send Mail</button>
                </form>
            </div>
        </div>
    )
}
