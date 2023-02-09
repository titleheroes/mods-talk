import React from "react";
import { useState } from "react";
import "../styles/home.css";

const Home = () => {
  const visitor = 600;
  const member = 250;
  const no_posts = 100;

  const [active, setActive] = useState({});

  const toggleActive = (id) => {
    setActive({
      ...active,
      [id]: !active[id],
    });
  };

  const [visibility, setVisibility] = useState({});

  const handleToggleVisibility = (id) => {
    setVisibility({
      ...visibility,
      [id]: !visibility[id],
    });
  };

  return (
    <div className="pagePadding">
      <div className="container">
        <div className="row">
          <div className="col-md">
            <div className="homeHeader">
              ชีวิตติดเทรนด์<br></br>
              เล่น <span style={{ color: "#f04e22" }}>“มดส์-ทอล์ค”</span>
            </div>
            <div className="body" style={{ paddingTop: "1.6rem" }}>
              คอมมิวนิตี้สำหรับนักศึกษา หรือ
              ผู้ที่สนใจในมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี<br></br>
              ที่จะมา
              <span style={{ color: "#f04e22" }}>
                รีวิวแลกเปลี่ยนความรู้ ความคิดเห็น
              </span>
              และ<span style={{ color: "#f04e22" }}>แนะนำเทรนด์ต่างๆ</span>{" "}
              ที่น่าสนใจ ไม่ว่าจะเป็น<br></br>
              วิชาเรียน ประสบการณ์ฝึกงาน ร้านอาหาร และอื่นๆ อีกมากมาย
              ให้เพลิดเพลินไปกับ <br></br>
              การใช้ชีวิตในรั้วมหาวิทยาลัย
            </div>

            <div style={{ paddingTop: "2.4rem" }}>
              <button
                type="button"
                className="button"
                variant="contained"
                onClick=""
              >
                เริ่มต้นการรีวิวตอนนี้เลย
              </button>
            </div>

            <div
              className="row"
              style={{ paddingTop: "4rem", paddingBottom: "3rem" }}
            >
              <div class="col">
                <div className="count">{visitor}+</div>
                <div>จำนวนผู้เข้าชมเว็บไซต์ของเรา</div>
              </div>
              <div class="col">
                <div className="count">{member}+</div>
                <div>จำนวนสมาชิก</div>
              </div>
              <div class="col">
                <div className="count">{no_posts}+</div>
                <div>จำนวนโพสต์รีวิว</div>
              </div>
            </div>
          </div>

          <div className="col-md">
            <img
              src={require("../images/home/main.png")}
              alt="main page png"
              className="img-fluid"
            />
          </div>
        </div>
      </div>

      <div className="layerPadding">
        <hr />
        <div className="container" style={{ paddingTop: "2%" }}>
          <div className="row">
            <div className="col-md count">
              “มดส์-ทอล์ค”{" "}
              <span style={{ color: "black" }}> ทำอะไรได้บ้าง</span>
            </div>
            <div className="col-md">
              เป็นเว็บไซต์สำหรับตอบปัญหาของนักศึกษา
              ไม่ว่าจะเป็นเรื่องเรียนหรือเรื่องเที่ยว<br></br>
              โดยการรีวิวจะจัดเป็นหมวดหมู่แบบเป็นระเบียบ
              และเป็นระบบปิดสงวนให้นักศึกษาอ่านได้เท่านั้น<br></br>
              และอีกส่วนหนึ่งคือการตอบปัญหาจากผู้ปกครอง
              เพื่อให้ผู้ที่ต้องการศึกษาต่อ<br></br>
              สามารถถามคำถามจากนักศึกษาจริง ที่มีการยืนยันตัวตนได้จริง
            </div>
          </div>
        </div>
      </div>

      <div className="layerPadding">
        <div className="container" style={{ paddingTop: "3%" }}>
          <div className="row">
            <div className="col-md">
              <img
                src={require("../images/home/Review.png")}
                alt="Review.png"
                className="img-fluid"
              />
              <div style={{ paddingBottom: "3%" }}>
                <span className="homeHeader2">เขียนรีวิว</span>
                <br></br>
                เป็นพื้นที่สำหรับให้นักศึกษาที่สนใจในการรีวิวแลกเปลี่ยนความรู้ความคิดเห็น
                <br></br>
                หรือแนะนำเทรนด์ต่างๆ เกี่ยวกับทางมหาวิทยาลัย
              </div>
            </div>

            <div className="col-md">
              <img
                src={require("../images/home/QandA.png")}
                alt="QandA.png"
                className="img-fluid"
              />
              <div style={{ paddingBottom: "3%" }}>
                <span className="homeHeader2">ถาม-ตอบ</span>
                <br></br>
                เป็นส่วนของคนที่อยากรู้จักมหาวิทยาลัย หรือต้องการเข้ามาศึกษาต่อ
                สามารถเข้ามาเพื่อถามคำถาม<br></br>
                และได้คำตอบจากนักศึกษาจริงๆ
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layerPadding">
        <hr />
        <div className="container" style={{ paddingTop: "2%" }}>
          <div className="count" style={{ paddingBottom: "3%" }}>
            <span style={{ color: "black" }}>คำถามยอดนิยมจาก</span> “มดส์-ทอล์ค”
          </div>

          {/* คำถามบ่อยที่ 1 */}
          <div className="row">
            <div className="homeHeader3 col">
              สมัครอีเมลสกุล @mail.kmutt.ac.th หรือ @kmutt.ac.th ได้จากไหน ?
            </div>
            <div className="col">
              <button
                type="button"
                className="float-end"
                onClick={() =>
                  handleToggleVisibility("element1") & toggleActive("element1")
                }
              >
                {active.element1 ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div style={{ paddingTop: "1%", paddingBottom: "0.75%" }}>
            {visibility.element1 && (
              <div className="row" style={{ paddingBottom: "1%" }}>
                <div className="col-sm-1">คำตอบ : </div>
                <div className="col">
                  เนื่องจากเป็นอีเมลที่ใช้ภายในมหาวิทยาลัย
                  ทำให้ไม่สามารถที่จะให้ผู้ใช้ภายนอกมหาวิทยาลัย
                  สามารถสมัครใช้งานได้แต่ถ้าเป็นกรณีที่เป็นนักศึกษาใหม่
                  จะมีการเปิดให้ลงทะเบียนตามช่วงเวลา
                  ซึ่งจะเปิดให้ลงทะเบียนหลังจากที่นักศึกษาได้รับบัตรนักศึกษา
                  และมีบัญชีบนเว็บไซต์ newAcis เรียบร้อยแล้ว
                </div>
              </div>
            )}
          </div>
          <hr />

          {/* คำถามบ่อยที่ 2 */}
          <div className="row">
            <div className="homeHeader3 col">
              ในส่วนของรีวิวมีหมวดหมู่อะไรบ้าง ?
            </div>
            <div className="col">
              <button
                type="button"
                className="float-end"
                onClick={() =>
                  handleToggleVisibility("element2") & toggleActive("element2")
                }
              >
                {active.element2 ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div style={{ paddingTop: "1%", paddingBottom: "0.75%" }}>
            {visibility.element2 && (
              <div className="row" style={{ paddingBottom: "1%" }}>
                <div className="col-sm-1">คำตอบ : </div>
                <div className="col">
                  เนื่องจากเป็นอีเมลที่ใช้ภายในมหาวิทยาลัย
                  ทำให้ไม่สามารถที่จะให้ผู้ใช้ภายนอกมหาวิทยาลัย
                  สามารถสมัครใช้งานได้แต่ถ้าเป็นกรณีที่เป็นนักศึกษาใหม่
                  จะมีการเปิดให้ลงทะเบียนตามช่วงเวลา
                  ซึ่งจะเปิดให้ลงทะเบียนหลังจากที่นักศึกษาได้รับบัตรนักศึกษา
                  และมีบัญชีบนเว็บไซต์ newAcis เรียบร้อยแล้ว
                </div>
              </div>
            )}
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Home;
