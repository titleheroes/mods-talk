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
  Times,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavBtn0,
  NavBtnLink0,
} from "./NavbarElement";


import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  

  const closeMobileMenu = () => setClick(false);

  const [userData, setUserData] = useState([]);

  const currentUser = auth.currentUser;

  

  const hideNavbar = [
    "/signup",
    "/login",
    "/authenticate",
    "/datauser",
    "/forgetpassword",
    "/forgetpassword/sent",
    "/admin/user",
    "/admin/post",
  ].includes(location.pathname);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserId = currentUser && currentUser.uid;
        const docRef = doc(db, "member", currentUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          console.log(userData);
        } else if (currentUser) {
          navigate("/datauser");
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    };

    fetchData();
  }, [location.pathname, currentUser]);

  

  return (
    !hideNavbar && (
      <div>
        <Nav>
          <NavLink to="/" onClick={closeMobileMenu}>
            <img
              className="logo"
              src={require("../../images/logo2.png")}
              alt=""
            />
           
          </NavLink>

          <div className="menu-icon" onClick={handleClick}>
              {click ? <Times /> : <Bars/>}
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item-mobile">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
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
                  <div className="pe-5">ถาม-ตอบ</div>
                </NavLink>
              </li>

              {currentUser ? (
                null
              ) : (

                <li className="nav-item-mobile">
                <div className="login-text">
                  <NavLink
                    
                    to="/login"
                    
                    className={({ isActive }) =>
                      "nav-links  " + (isActive ? " activated" : " ")
                    }
                    onClick={closeMobileMenu}
                  >
                    <div className="login-button">เข้าสู่ระบบ</div>             
                  </NavLink>
                </div> 
              </li>



              )}

              

              <li>


              {currentUser ? (
            <Dropdown
            className="mobile-size"
              drop="down"
              style={{
                display: "flex",
                alignItems: "center",
                height: "70px"
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
                    src={require("../../images/home/main.png")}
                    alt="main page png"
                    className="img-fluid"
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>

              
                <Dropdown.Item
                  className="mt-1"
                  as={Link}
                  to="/about"
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
                    navigate(0);
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



            </ul>

       

            
      
    
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
                    src={require("../../images/home/main.png")}
                    alt="main page png"
                    className="img-fluid"
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>

              
                <Dropdown.Item
                  className="mt-1"
                  as={Link}
                  to="/about"
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
                    navigate(0);
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
