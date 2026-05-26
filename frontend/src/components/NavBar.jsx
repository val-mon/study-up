import { Link, useLocation, useNavigate } from 'react-router';
import logo from '../assets/logo.svg';
import { useAuth } from '../contexts/AuthContext';
import '../css/NavBar.css';

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <Link to={isAuth ? '/dashboard' : '/'}>
        <img src={logo} className="logo" />
      </Link>

      {!isAuth ? (
        <div className="header-right">
          <Link to="/login"><button>Login</button></Link>
          <Link to="/register"><button>Sign Up</button></Link>
        </div>
      ) : (
        <>
          <nav>
            <Link to="/dashboard" className={pathname === '/dashboard' ? 'nav-active' : ''}>Dashboard</Link>
            <Link to="/courses" className={pathname.startsWith('/courses') ? 'nav-active' : ''}>Courses</Link>
            <Link to="/account" className={pathname === '/account' ? 'nav-active' : ''}>Account</Link>
          </nav>
          <div className="header-right">
            <p>{user?.name}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </header>
  );
}
