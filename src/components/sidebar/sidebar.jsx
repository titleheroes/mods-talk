import React from "react";
import { useLocation, Link } from "react-router-dom";
import './sidebar.css'



import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from '@mui/icons-material/Logout';



const Sidebar = () => {
const { pathname } = useLocation();
  return (
    <div className="sidebar">

      <div className="top">
        <img className="logo" src={require("../../images/logo2.png")} alt="" />
      </div>

      <div className="center">
        <ul>
          <li>

            <a href='/admin/user' className="tab-link">
            <div className="sidetabs" id="side1" style={
                {backgroundColor: pathname === "/admin/user" ? "#f04e22" : "transparent",
                color: pathname === "/admin/user" ? "#FFFFFF" : "#666666"}
            }>
                <span>
                <AccountBoxIcon className="userIcon me-2" />
                ผู้ใช้งาน
                </span>

            </div>
            </a>
          </li>
          <li>
            <a href='/admin/post' className="tab-link">
                <div className="sidetabs" id="side2" style={
                    {backgroundColor: pathname === "/admin/post" ? "#f04e22" : "transparent",
                    color: pathname === "/admin/post" ? "#FFFFFF" : "#666666"}}>
                    <span>
                    <ReceiptIcon className="userIcon me-2" />
                    โพสต์
                    </span>

                </div>
            </a>
          </li>
        </ul>
      </div>

      <div className="bottom">
        
        <img
            src={require("../../images/home/main.png")}
            alt="Review.png"
            className="img-fluid prof-pic rounded-circle shadow-4 me-2"
        />
        <div className="profile-detail pt-2">
            <span className="profile-name" id="profile-name">กอร์ดอน แรมซีย์<p className="profile-role ms-2">• แอดมิน</p> </span> 
            
        </div>

        <button className="logout-button p-2"><LogoutIcon className="me-2"  />ออกจากระบบ</button>
        
        
      </div>


    </div>
  );
};

export default Sidebar;
