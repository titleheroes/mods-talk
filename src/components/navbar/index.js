import "./Navbar.css";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LoginIcon from "@mui/icons-material/Login";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../../config.js";
import { Nav, NavLink, Bars, Times, NavBtn, NavBtnLink } from "./NavbarElement";

const Navbar = ({ userData }) => {
  const location = useLocation();

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  const [currentUser, setCurrentUser] = useState(null);

  const hideNavbar = [
    
    "/signup",
    "/login",
    "/authenticate",
    "/datauser",
    "/forgetpassword",
    "/forgetpassword/sent",
    "/admin/login",
    "/admin/forgetpassword",
    "/admin/forgetpasswordsent",
    "/admin/user",
    "/admin/post",
  ].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(userData);
    if (currentUser) {
      if (location.pathname !== "/datauser") {
        if (userData === "Login But no Data") {
          window.location.href = "/datauser";
        }
      }
    }
  }, [location.pathname, userData]);

  return (
    !hideNavbar && (
      <div>
        <Nav>
          <NavLink to={currentUser ? "/review" : "/"} onClick={closeMobileMenu}>
            <img
              className="logo"
              src={require("../../images/logo2.png")}
              alt=""
            />
          </NavLink>

          <div className="menu-icon" onClick={handleClick}>
            {click ? <Times /> : <Bars />}
          </div>
          {currentUser ? (
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item-mobile">
                <NavLink
                  to="/review"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  <HomeIcon className="mobile-size navbar-icon" />
                  หน้าหลัก
                </NavLink>
              </li>
              <li className="nav-item-mobile">
                <NavLink
                  to="/question"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  <ArticleIcon className="mobile-size navbar-icon" />
                  ถาม-ตอบ
                </NavLink>
              </li>
              <li className="nav-item-mobile ">
                <NavLink
                  to="/notification"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  <QuestionAnswerIcon className="mobile-size navbar-icon" />
                  <div className="pe-5">แจ้งเตือน</div>
                </NavLink>
              </li>

              {currentUser ? null : (
                <li className="nav-item-mobile">
                  <div className="login-text">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        "nav-links  " + (isActive ? " activated" : " ")
                      }
                      onClick={closeMobileMenu}
                    >
                      <LoginIcon className="mobile-size navbar-icon" />
                      <div className="login-button">เข้าสู่ระบบ</div>
                    </NavLink>
                  </div>
                </li>
              )}

              {/* Mobile User Profile */}
              <li>
                {currentUser ? (
                  <Dropdown
                    className="mobile-size"
                    drop="down"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "70px",
                    }}
                  >
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-basic"
                      style={{
                        border: "none",
                        boxShadow: "none",
                        color: "transparent",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className=""
                    >
                      {userData ? (
                        <div className="mx-3" style={{ color: "black" }}>
                          {userData.fname}
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}

                      <div className="profile-image">
                        <img
                          src={userData.profile}
                          alt="main page png"
                          className="img-fluid"
                        />
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="mt-1"
                        as={Link}
                        to={`/profile/${userData.id}`}
                        onClick={closeMobileMenu}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        <span>
                          <img
                            src={require("../../images/icon/user.svg").default}
                            alt="user svg"
                            style={{ width: "20px" }}
                          />
                        </span>
                        &nbsp;&nbsp; โปรไฟล์
                      </Dropdown.Item>

                      <hr />

                      <Dropdown.Item
                        className="mb-2"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                        onClick={() => {
                          signOut(auth);
                          window.location.href = "/";
                        }}
                      >
                        <span>
                          <img
                            src={require("../../images/icon/exit.svg").default}
                            alt="exit svg"
                            style={{ width: "20px" }}
                          />
                        </span>
                        &nbsp;&nbsp; ออกจากระบบ
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <NavBtn className="mobile-size">
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <NavBtnLink>เข้าสู่ระบบ</NavBtnLink>
                    </Link>
                  </NavBtn>
                )}
              </li>
              {/* End of Mobile User Profile */}
            </ul>
          ) : (
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item-mobile">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  <HomeIcon className="mobile-size navbar-icon" />
                  หน้าหลัก
                </NavLink>
              </li>
              <li className="nav-item-mobile">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  <ArticleIcon className="mobile-size navbar-icon" />
                  เกี่ยวกับ
                </NavLink>
              </li>
              <li className="nav-item-mobile ">
                <NavLink
                  to="/question"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  <QuestionAnswerIcon className="mobile-size navbar-icon" />
                  <div className="pe-5">ถาม-ตอบ</div>
                </NavLink>
              </li>

              {currentUser ? null : (
                <li className="nav-item-mobile">
                  <div className="login-text">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        "nav-links  " + (isActive ? " activated" : " ")
                      }
                      onClick={closeMobileMenu}
                    >
                      <LoginIcon className="mobile-size navbar-icon" />
                      <div className="login-button">เข้าสู่ระบบ</div>
                    </NavLink>
                  </div>
                </li>
              )}
              <li></li>
            </ul>
          )}

          {currentUser ? (
            <Dropdown
              className="mobile-size2"
              drop="down"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                style={{
                  border: "none",
                  boxShadow: "none",
                  color: "transparent",
                  display: "flex",
                  alignItems: "center",
                }}
                className=""
              >
                {userData ? (
                  <div className="mx-3" style={{ color: "black" }}>
                    {userData.fname}
                  </div>
                ) : (
                  <p>Loading...</p>
                )}

                <div className="profile-image">
                  <img
                    src={userData.profile}
                    alt="main page png"
                    className="img-fluid"
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className="mt-1"
                  as={Link}
                  to={`/profile/${userData.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  <span>
                    <img
                      src={require("../../images/icon/user.svg").default}
                      alt="user svg"
                      style={{ width: "20px" }}
                    />
                  </span>
                  &nbsp;&nbsp; โปรไฟล์
                </Dropdown.Item>

                <hr />

                <Dropdown.Item
                  className="mb-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                  onClick={() => {
                    signOut(auth);
                    window.location.href = "/";
                  }}
                >
                  <span>
                    <img
                      src={require("../../images/icon/exit.svg").default}
                      alt="exit svg"
                      style={{ width: "20px" }}
                    />
                  </span>
                  &nbsp;&nbsp; ออกจากระบบ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <NavBtn>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <NavBtnLink>เข้าสู่ระบบ</NavBtnLink>
              </Link>
            </NavBtn>
          )}
        </Nav>
      </div>
    )
  );
};

export default Navbar;
