import { Link } from "react-router-dom";
import "./navbar.css";
// import { backendUrl } from "../helper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Toast from "../toast/Toast";
import avatar from "./../../images/avatar.png";
import { backendUrl } from "../helper";
import { loginAction, logoutAction } from "../../store/userReducer";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.userReducer);

  const [userInfo, setUserInfo] = useState({});
  const [menuClicked, setMenuClicked] = useState(false);
  const [error, setError] = useState(Boolean);
  const [success, setSuccess] = useState(Boolean);
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();

  const menuClikedHandler = () => {
    setMenuClicked(!menuClicked);
  };

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`${backendUrl}/profile`);
      const data = await response.json();
      if (response.ok) {
        dispatch(loginAction(data));
      }
    };
    fetchHandler();
  }, [dispatch]);

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`${backendUrl}/user-details/${user?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      setUserInfo(data);
    };

    fetchHandler();
  }, [user?.id]);

  const logOutHandler = async () => {
    const response = await fetch(`${backendUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();

    if (response.ok) {
      dispatch(logoutAction());
    }

    if (response.ok) {
      setSuccess(true);
      setToastMessage(result.message);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    } else {
      setToastMessage(result.message);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };
  return (
    <>
      {error && (
        <Toast
          classes="error"
          iconClass="fa-solid fa-circle-xmark"
          message={toastMessage}
        />
      )}
      {success && (
        <Toast
          classes="success"
          iconClass="fa-solid fa-circle-check"
          message={toastMessage}
        />
      )}
      <nav className="navbar flex-row">
        <div className="logo">
          <Link className="logo-link opacity-hover" to={"/"}>
            Blogo
          </Link>
        </div>
        <div className="nav-user-info flex-row">
          {isAuthenticated ? (
            <Link
              className="link logout opacity-hover"
              onClick={logOutHandler}
              to={"/"}
            >
              Logout
            </Link>
          ) : (
            <Link className="link login opacity-hover" to={"/login"}>
              Login
            </Link>
          )}

          {isAuthenticated ? (
            <Link
              className="link create-post opacity-hover"
              to={"/create-post"}
            >
              Create Post
            </Link>
          ) : (
            <Link className="link register opacity-hover" to={"/register"}>
              Register
            </Link>
          )}
          {isAuthenticated && (
            <Link
              className="user-avatar flex-row"
              to={`/user-details/${user?.id}`}
            >
              <img src={userInfo?.cover || avatar} alt="avatar" />
              <p className="username opacity-hover">
                {userInfo?.username?.split(" ")[0]}
              </p>
            </Link>
          )}
          <div className="burger">
            {!menuClicked && (
              <MenuIcon
                className="menu-icon opacity-hover"
                onClick={menuClikedHandler}
              />
            )}
            {menuClicked && (
              <CloseIcon
                className="menu-icon opacity-hover"
                onClick={menuClikedHandler}
              />
            )}
          </div>
        </div>
        <div className={`menubar flex-row ${menuClicked ? "active" : ""}`}>
          {isAuthenticated ? (
            <Link
              className="link opacity-hover"
              onClick={logOutHandler}
              to={"/"}
            >
              Logout
            </Link>
          ) : (
            <Link className="link opacity-hover" to={"/login"}>
              Login
            </Link>
          )}

          {isAuthenticated ? (
            <Link className="link opacity-hover" to={"/create-post"}>
              Create Post
            </Link>
          ) : (
            <Link className="link opacity-hover" to={"/register"}>
              Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
