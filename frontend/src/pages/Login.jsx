import "../css/Login_Register.css";
import { useState } from "react";

export default function Login() {
    const [emailSended, setEmailSended] = useState(false);

    function verifieEmail(e) {  
        e.preventDefault();
        alert("TODO: Send email");
        setEmailSended(true);  
    }

    if (emailSended) {          
        return (
            <div className="login-page">
                <div className="login-container">
                    <h1><span style={{ color: "#3400ff" }}>C</span>ode <span style={{ color: "#3400ff" }}>V</span>erification</h1>
                    <form className="login-form">
                        <label htmlFor="code">
                            Enter the code sent to your email
                        </label>
                        <input type="text" id="code" name="code" required />
                        <div className="button-container">
                            <button onClick={() => setEmailSended(false)}>Back</button>
                            <button onClick={() => alert("TODO: Verify code")}>Verify</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h1><span style={{ color: "#3400ff" }}>L</span>ogin</h1>
                <form className="login-form">
                    <label htmlFor="email">Enter your email</label>
                    <input type="email" id="email" name="email" required />
                    <button className="send-mail" onClick={verifieEmail}>
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
}