import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./sidebar.css";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = ({ userData }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { pathname } = useLocation();

  const handleSignOut = () => {
    alert("ออกจากระบบสำเร็จ");
    signOut(auth);
    window.location.href = "/";
  };

  // ดึงข้อมูลแอดมิน
  useEffect(() => {
    try {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;
      const docRef = doc(db, "admin", currentUserId);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const level = docSnap.data().level;
          if (level === "superadmin") {
            setIsSuperAdmin(true);
          }
        } else {
          window.location.href = "/";
        }
      });
    } catch (e) {
      console.error(e);
      window.location.href = "/";
    }
  }, []);
  // ดึงข้อมูลแอดมิน

  return (
    <div className="sidebar">
      <div className="top">
        <img className="logo" src={require("../../images/logo2.png")} alt="" />
      </div>

      <div className="center">
        <ul>
          <li>
            <Link to="/admin/user" className="tab-link">
              <div
                className="sidetabs"
                id="side1"
                style={{
                  backgroundColor:
                    pathname === "/admin/user" ? "#f04e22" : "transparent",
                  color: pathname === "/admin/user" ? "#FFFFFF" : "#666666",
                }}
              >
                <span>
                  <AccountBoxIcon className="userIcon me-2" />
                  ผู้ใช้งาน
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/admin/post" className="tab-link">
              <div
                className="sidetabs"
                id="side2"
                style={{
                  backgroundColor:
                    pathname === "/admin/post" ? "#f04e22" : "transparent",
                  color: pathname === "/admin/post" ? "#FFFFFF" : "#666666",
                }}
              >
                <span>
                  <ReceiptIcon className="userIcon me-2" />
                  โพสต์
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>

      <div className="bottom">
        <img
          src={userData.profile}
          alt="Review.png"
          className="img-fluid prof-pic rounded-circle shadow-4 me-2"
        />
        <div className="profile-detail pt-2">
          <span className="profile-name" id="profile-name">
            {userData ? (
              <span>
                {userData.fname} {userData.lname}
              </span>
            ) : (
              "Loading"
            )}
            <p className="profile-role ms-2">
              • {isSuperAdmin ? "ซูเปอร์แอดมิน" : "แอดมิน"}
            </p>{" "}
          </span>
        </div>

        <button className="logout-button p-2" onClick={handleSignOut}>
          <LogoutIcon className="me-2" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
