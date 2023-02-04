import React from "react";
import '../styles/home.css'; 

const Home = () => {
  return (
    <div className="pagePadding">
      <div className="container">
        <div className="row">

          <div className="col-md">
            <div className="homeHeader">
              ชีวิตติดเทรนด์<br></br>
              เล่น <span style={{color: "#f04e22"}}>"มดส์-ทอล์ค"</span>
            </div>
            <div className="body" style={{paddingTop: '24px'}}>
              คอมมิวนิตี้สำหรับนักศึกษา หรือ ผู้ที่สนใจในมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี<br></br>
              ที่จะมา<span style={{color: "#f04e22"}}>รีวิวแลกเปลี่ยนความรู้ ความคิดเห็น</span>และ<span style={{color: "#f04e22"}}>แนะนำเทรนด์ต่างๆ</span> ที่น่าสนใจ ไม่ว่าจะเป็น<br></br>
              วิชาเรียน ประสบการณ์ฝึกงาน ร้านอาหาร และอื่นๆ อีกมากมาย ให้เพลิดเพลินไปกับ <br></br>
              การใช้ชีวิตในรั้วมหาวิทยาลัย
            </div>

            <div style={{paddingTop: '24px'}}>
              <button type="button" class="btn btn-primary btn-lg" style={{backgroundColor: "#f04e22", outlineColor: "transparent"}}>Large button</button>
            </div>
          </div>

          <div className="col-md">
            <img src={require("../images/home/main.png")} className="img-fluid" />
          </div>
          
        </div>
      </div>
    </div>
    
  );
};

export default Home;