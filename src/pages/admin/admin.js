import React from 'react'
import "../../styles/admin.css";
import Sidebar from "../../../src/components/sidebar/sidebar";

const admin = () => {
  return (
    <div className='adminpage'>
        <Sidebar/>
        <div className="adminhome">container</div>


    </div>
    
  )
}

export default admin