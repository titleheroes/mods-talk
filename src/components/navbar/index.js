import { logDOM } from "@testing-library/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavBtn0,
  NavBtnLink0,
} from "./NavbarElement";

const Navbar = () => {
  const location = useLocation();

  const hideNavbar = [
    "/signup",
    "/login",
    "/authenticate",
    "/datauser",
  ].includes(location.pathname);

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
            {/* <h1>Logo</h1> */}
          </NavLink>
          <Bars />
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

          {/* <NavBtn0>
          <NavBtnLink0 to="/signup">เข้าสู่ระบบ</NavBtnLink0>
        </NavBtn0> */}

          <NavBtn>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <NavBtnLink>สมัครสมาชิก</NavBtnLink>
            </Link>
          </NavBtn>
        </Nav>
      </div>
    )
  );
};

export default Navbar;
