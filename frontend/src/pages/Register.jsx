import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import '../css/Login_Register.css';

const SEND_OTP = gql`
  mutation SendOTP($email: String!, $name: String) {
    sendOTP(email: $email, name: $name)
  }
`;

const VERIFY_OTP = gql`
  mutation VerifyOTP($email: String!, $code: String!) {
    verifyOTP(email: $email, code: $code) {
      id
      name
      email
    }
  }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [sendOTP, { loading: sending }] = useMutation(SEND_OTP);
  const [verifyOTP, { loading: verifying }] = useMutation(VERIFY_OTP);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await sendOTP({ variables: { email, name } });
      setStep('code');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await verifyOTP({ variables: { email, code } });
      login(data.verifyOTP);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  if (step === 'code') {
    return (
      <div className="login-page">
        <div className="login-container">
          <h1><span style={{ color: '#3400ff' }}>C</span>ode <span style={{ color: '#3400ff' }}>V</span>erification</h1>
          <form className="login-form" onSubmit={handleVerify}>
            <label htmlFor="code">Enter the code sent to your email</label>
            <input type="text" id="code" value={code} onChange={e => setCode(e.target.value)} maxLength={6} required />
            {error && <p className="form-error">{error}</p>}
            <div className="button-container">
              <button type="button" onClick={() => setStep('form')}>Back</button>
              <button type="submit" disabled={verifying}>{verifying ? 'Verifying...' : 'Verify'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1><span style={{ color: '#3400ff' }}>R</span>egister</h1>
        <form className="login-form" onSubmit={handleSendOTP}>
          <label htmlFor="name">Enter your name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} maxLength={30} required />
          <label htmlFor="email">Enter your email</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
