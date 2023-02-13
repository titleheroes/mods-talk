import { padding } from "@mui/system";
import React from "react";

import "../styles/about.css";

const About = () => {
  return (
    <div className="page">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">มดส์-ทอล์ค</a>
          </li>

          <li className="breadcrumb-item active" aria-current="page">
            เกี่ยวกับ
          </li>
        </ol>
      </nav>



      
        
          <div className="row">
            <div className="col-md">
              <span className="aboutTitle">เป้าหมายของเรา</span>
            </div>

            <div className="col-md">
              <div className="aboutContent" >
                เป้าหมายในการพัฒนาเว็บไซต์ของเรา คือ 
                การมุ่งเน้นเพื่อพัฒนาชุมชนภายในมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี 
                ให้มีการพูดคุย แบ่งปัน ข้อมูล ไม่ว่าจะเป็นทางด้านการเรียน หรือไลฟ์สไตล์ 
                โดยตั้งใจให้เป็นพื้นที่หรือแพลืทฟอร์มหลักที่นักศึกษาจะเลือกใช้เพื่อหาคำตอบต่างๆ                
              </div>
            </div>
          </div>
        
      

            <div className="row aboutImg">
              <div className="col-md" style={{paddingBottom: "10%"}}>
                <img
                  src={require("../images/about/about_group.png")}
                  alt="Review.png"
                  className="img-fluid"
                />
                
              </div>

              <div className="col-md" style={{ paddingTop: "2.7%",paddingLeft: '5%' }}>
                
                <div className="quoteBox" style={{ paddingLeft: "5%" }}>
                  <span className="aboutQuote">There is no happiness in having or in getting, <br />         
                    but in only giving.<br />  </span>
                  <p className="quoteName">- Henry Drummond</p>
                    
                  
                </div>

                <ul className="objectiveList">
                  <li>เพื่อเสริมสร้างให้นักศึกษามีการแชร์เรื่องราวแก่กันและกัน </li>
                  <li>เพื่อให้บุคคลภายนอกได้มีแพลทฟอร์มส่วนกลางในการถามคำถามจากนักศึกษาโดยตรง</li>
                  <li>เพื่อให้สังคมภายในมหาวิทยาลัยเป็นไปในทางที่ดีขึ้น หลังจากยุคโควิด ที่ทำให้คนเหินห่าง</li>
                </ul> 

              </div>
              
            </div>


      



     



    </div>
  );
};

export default About;
