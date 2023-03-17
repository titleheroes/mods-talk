import React from "react";
import "./sidebar.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  return (
    <div className="sidebar">

      <div className="top">
        <img className="logo" src={require("../../images/logo2.png")} alt="" />
      </div>

      <div className="center">
        <ul>
          <li>
            <div className="sidetabs" id="side1">
                <span>
                <AccountBoxIcon className="userIcon me-2" />
                ผู้ใช้งาน
                </span>

            </div>
            
          </li>
          <li>
            <div className="sidetabs" id="side2">
                    <span>
                    <ReceiptIcon className="userIcon me-2" />
                    โพสต์
                    </span>

                </div>
          </li>
        </ul>
      </div>

      <div className="bottom">
        
        <img
            src={require("../../images/home/main.png")}
            alt="Review.png"
            className="img-fluid prof-pic rounded-circle shadow-4 me-2"
        />
        <div className="profile-detail">
            <span className="profile-name">กอร์ดอน แรมซีย์ <p className="profile-role ms-2">• แอดมิน</p> </span> 
            
        </div>

        <button className="logout-button p-2"><LogoutIcon className="me-2"  />ออกจากระบบ</button>
        
        
      </div>


    </div>
  );
};

export default Sidebar;
