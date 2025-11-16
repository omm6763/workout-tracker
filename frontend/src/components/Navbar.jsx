import { Link, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  const onLoginPage = location.pathname === "/login";
  const onSignupPage = location.pathname === "/signup";

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>
            Workout Buddy <span className="logo-smile">:)</span>
          </h1>
        </Link>
        <nav>
          {user && (
            <div className="user-actions">
              <span className="user-email">{user.email}</span>
              <button className="nav-button" onClick={logout}>
                Log out
              </button>
            </div>
          )}
          {!user && (
            <div className="auth-links">
              {onLoginPage && (
                <Link className="nav-button" to="/signup">
                  Signup
                </Link>
              )}
              {onSignupPage && (
                <Link className="nav-button" to="/login">
                  Login
                </Link>
              )}
              {(!onLoginPage && !onSignupPage) && (
                <>
                  <Link className="nav-button" to="/login">
                    Login
                  </Link>
                  <Link className="nav-button" to="/signup">
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
