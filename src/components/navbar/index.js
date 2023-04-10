import { logDOM } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config.js";
import { doc, getDoc } from "firebase/firestore";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElement";

const Navbar = ({ userData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const hideNavbar = [
    "/signup",
    "/login",
    "/authenticate",
    "/datauser",
    "/forgetpassword",
    "/forgetpassword/sent",
  ].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, [location.pathname]);

  return (
    !hideNavbar && (
      <div>
        <Nav>
          <NavLink to="/">
            <img
              className="logo"
              src={require("../../images/logo2.png")}
              alt=""
            />
          </NavLink>
          {/* <h1>Logo</h1> */}
          <Bars />
          {currentUser ? (
            <NavMenu>
              <NavLink to="/" activeStyle>
                หน้าหลัก
              </NavLink>

              <NavLink to="/about" activeStyle>
                เกี่ยวกับ
              </NavLink>

              <NavLink to="/review" activeStyle>
                รีวิว
              </NavLink>

              <NavLink to="/question" activeStyle>
                ถาม-ตอบ
              </NavLink>
            </NavMenu>
          ) : (
            <NavMenu>
              <NavLink to="/" activeStyle>
                หน้าหลัก
              </NavLink>

              <NavLink to="/about" activeStyle>
                เกี่ยวกับ
              </NavLink>

              <NavLink to="/question" activeStyle>
                ถาม-ตอบ
              </NavLink>
            </NavMenu>
          )}

          {/* <NavBtn0>
          <NavBtnLink0 to="/signup">เข้าสู่ระบบ</NavBtnLink0>
        </NavBtn0> */}

          {currentUser ? (
            <Dropdown
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
              >
                {userData ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="mx-3" style={{ color: "black" }}>
                      {userData && userData.fname}
                    </div>
                    <div className="profile-image">
                      <img
                        src={userData && userData.profile}
                        alt="main page png"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className="mt-1"
                  href="/about"
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
                    signOut(auth).then(() => {
                      navigate("/");
                    });
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
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <NavBtnLink>สมัครสมาชิก</NavBtnLink>
              </Link>
            </NavBtn>
          )}
        </Nav>
      </div>
    )
  );
};

export default Navbar;
