import React from "react";
import "./sidebar.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <img className="logo" src={require("../../images/logo2.png")} alt="" />
      </div>

      <div className="center">
        <ul>
          <li>
            <span>
              <AccountBoxIcon className="userIcon" />
              ผู้ใช้งาน
            </span>
          </li>
          <li>
            <span>
              <ReceiptIcon />
              โพสต์
            </span>
          </li>
        </ul>
      </div>

      <div className="bottom">option</div>
    </div>
  );
};

export default Sidebar;
