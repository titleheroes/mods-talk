import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/home.css";
import { auth, db } from "../config";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const Home = () => {
  const [visitorCount, setvisitorCount] = useState("Loading");
  const [memberCount, setMemberCount] = useState("Loading");
  const [reviewCount, setReviewCount] = useState("Loading");

  const visitor = visitorCount;
  const member = memberCount;
  const no_posts = reviewCount;

  const currentUser = auth.currentUser;
  const navigate = useNavigate();

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

  const handleReviewClick = (event) => {
    event.preventDefault();
    if (currentUser) {
      navigate("/review");
    } else {
      navigate("/login");
    }
  };

  const handleQuestionClick = (event) => {
    event.preventDefault();
    navigate("/question");
  };

  // Visitor Count
  useEffect(() => {
    const docRef = doc(db, "webCount", "Mod's Talk");
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const visitorCount = docSnap.data().visitor;
        updateDoc(docRef, {
          visitor: visitorCount + 1,
        })
          .then(() => {
            console.log("Document updated with new count value");
            setvisitorCount(visitorCount);
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      }
    });
  }, []);

  // Member Count
  useEffect(() => {
    const countDocs = async () => {
      const querySnapshot = await getDocs(collection(db, "member"));
      setMemberCount(querySnapshot.size); // set the state with the number of documents
    };
    countDocs();
  }, []);

  // Review Count
  useEffect(() => {
    const countDocs = async () => {
      const querySnapshot = await getDocs(collection(db, "review"));
      setReviewCount(querySnapshot.size); // set the state with the number of documents
    };
    countDocs();
  }, []);

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md">
              <div className="homeHeader">
                ชีวิตติดเทรนด์<br></br>
                เล่น <span style={{ color: "#f04e22" }}>“มดส์-ทอล์ค”</span>
              </div>
              <div
                className="body"
                style={{ paddingTop: "1.6rem", width: "100%" }}
              >
                คอมมิวนิตี้สำหรับนักศึกษา หรือ
                ผู้ที่สนใจในมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี ที่จะมา
                <span style={{ color: "#f04e22" }}>
                  รีวิวแลกเปลี่ยนความรู้ ความคิดเห็น
                </span>
                และ<span style={{ color: "#f04e22" }}>แนะนำเทรนด์ต่างๆ</span>{" "}
                ที่น่าสนใจ ไม่ว่าจะเป็น วิชาเรียน ประสบการณ์ฝึกงาน ร้านอาหาร
                และอื่นๆ อีกมากมาย ให้เพลิดเพลินไปกับ
                การใช้ชีวิตในรั้วมหาวิทยาลัย
              </div>

              <div style={{ paddingTop: "2rem" }}>
                <button
                  type="button"
                  className="button"
                  variant="contained"
                  onClick={handleReviewClick}
                  style={{
                    paddingTop: "1.25%",
                    paddingBottom: "1.25%",
                    paddingLeft: "2.25%",
                    paddingRight: "2.25%",
                  }}
                >
                  เริ่มต้นการรีวิวตอนนี้เลย
                </button>
              </div>

              <div
                className="row"
                style={{ paddingTop: "7%", paddingBottom: "3rem" }}
              >
                <div class="col-5">
                  <div className="count">{visitor}</div>
                  <div>จำนวนการเข้าใช้งานเว็บไซต์ของเรา</div>
                </div>
                <div class="col-3">
                  <div className="count">{member}</div>
                  <div>จำนวนสมาชิก</div>
                </div>
                <div class="col-3">
                  <div className="count">{no_posts}</div>
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
          <div className="layerFooter">
            <hr />
          </div>
        </div>

        {/* “มดส์-ทอล์ค” ทำอะไรได้บ้าง */}
        <div className="layerPadding">
          <div className="container" style={{ paddingTop: "2%" }}>
            <div className="row">
              <div className="col-md count" style={{ marginBottom: "3%" }}>
                “มดส์-ทอล์ค”{" "}
                <span style={{ color: "black" }}> ทำอะไรได้บ้าง</span>
              </div>
              <div className="col-md body">
                เป็นเว็บไซต์สำหรับตอบปัญหาของนักศึกษา
                ไม่ว่าจะเป็นเรื่องเรียนหรือเรื่องเที่ยว
                โดยการรีวิวจะจัดเป็นหมวดหมู่แบบเป็นระเบียบ
                และเป็นระบบปิดสงวนให้นักศึกษาอ่านได้เท่านั้น
                และอีกส่วนหนึ่งคือการตอบปัญหาจากผู้ปกครอง
                เพื่อให้ผู้ที่ต้องการศึกษาต่อ สามารถถามคำถามจากนักศึกษาจริง
                ที่มีการยืนยันตัวตนได้จริง
              </div>
            </div>
          </div>
        </div>

        {/* เขียนรีวิว และ ถาม-ตอบ */}
        <div className="layerPadding">
          <div className="container" style={{ paddingTop: "3%" }}>
            <div className="row">
              <div className="col-md">
                <img
                  src={require("../images/home/Review.png")}
                  alt="Review.png"
                  className="img-fluid"
                />
                <div className="body" style={{ paddingBottom: "3%" }}>
                  <span className="homeHeader2">เขียนรีวิว</span>
                  <br></br>
                  เป็นพื้นที่สำหรับให้นักศึกษาที่สนใจในการรีวิวแลกเปลี่ยนความรู้ความคิดเห็น
                  หรือแนะนำเทรนด์ต่างๆ เกี่ยวกับทางมหาวิทยาลัย
                </div>
              </div>

              <div className="col-md">
                <img
                  src={require("../images/home/QandA.png")}
                  alt="QandA.png"
                  className="img-fluid"
                />
                <div className="body" style={{ paddingBottom: "3%" }}>
                  <span className="homeHeader2">ถาม-ตอบ</span>
                  <br></br>
                  เป็นส่วนของคนที่อยากรู้จักมหาวิทยาลัย
                  หรือต้องการเข้ามาศึกษาต่อ สามารถเข้ามาเพื่อถามคำถาม
                  และได้คำตอบจากนักศึกษาจริงๆ
                </div>
              </div>
              <div className="layerFooter">
                <hr />
              </div>
            </div>
          </div>
        </div>

        <div className="layerPadding">
          <div className="container" style={{ paddingTop: "2%" }}>
            <div className="count" style={{ paddingBottom: "3%" }}>
              <span style={{ color: "black" }}>คำถามยอดนิยมจาก</span>{" "}
              “มดส์-ทอล์ค”
            </div>

            {/* คำถามบ่อยที่ 1 */}
            <div>
              <div className="row">
                <div
                  className="homeHeader3 col"
                  onClick={() =>
                    handleToggleVisibility("element1") &
                    toggleActive("element1")
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  สมัครอีเมลสกุล @mail.kmutt.ac.th หรือ @kmutt.ac.th ได้จากไหน ?
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="float-end iconButton"
                    onClick={() =>
                      handleToggleVisibility("element1") &
                      toggleActive("element1")
                    }
                  >
                    {active.element1 ? (
                      <img
                        src={require("../images/home/arrow-up.svg").default}
                        alt="arrow-up svg"
                      />
                    ) : (
                      <img
                        src={require("../images/home/arrow-down.svg").default}
                        alt="arrow-down svg"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div style={{ paddingBottom: "0.75%" }}>
                {visibility.element1 && (
                  <div
                    className="row body"
                    style={{ paddingTop: "1%", paddingBottom: "1%" }}
                  >
                    <div className="col-sm-1">คำตอบ : </div>
                    <div className="col-sm-10">
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

            {/* คำถามบ่อยที่ 2 */}
            <div style={{ marginTop: "2%" }}>
              <div className="row">
                <div
                  className="homeHeader3 col"
                  onClick={() =>
                    handleToggleVisibility("element2") &
                    toggleActive("element2")
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  ในส่วนของรีวิวมีหมวดหมู่อะไรบ้าง ?
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="float-end iconButton"
                    onClick={() =>
                      handleToggleVisibility("element2") &
                      toggleActive("element2")
                    }
                  >
                    {active.element2 ? (
                      <img
                        src={require("../images/home/arrow-up.svg").default}
                        alt="arrow-up svg"
                      />
                    ) : (
                      <img
                        src={require("../images/home/arrow-down.svg").default}
                        alt="arrow-down svg"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div style={{ paddingBottom: "0.75%" }}>
                {visibility.element2 && (
                  <div
                    className="row body"
                    style={{ paddingTop: "1%", paddingBottom: "1%" }}
                  >
                    <div className="col-sm-1">คำตอบ : </div>
                    <div className="col">
                      ในส่วนของการรีวิวสามารถแบ่งหมวดหมู่ออกมาได้ดังนี้
                      วิชาเรียน อาจารย์ หอพัก ร้านอาหาร ที่ฝึกงาน
                    </div>
                  </div>
                )}
              </div>
              <hr />
            </div>

            {/* คำถามบ่อยที่ 3 */}
            <div style={{ marginTop: "2%" }}>
              <div className="row">
                <div
                  className="homeHeader3 col"
                  onClick={() =>
                    handleToggleVisibility("element3") &
                    toggleActive("element3")
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  คนที่มาตอบคำถามนั้นเชื่อถือได้มากแค่ไหน ?
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="float-end iconButton"
                    onClick={() =>
                      handleToggleVisibility("element3") &
                      toggleActive("element3")
                    }
                  >
                    {active.element3 ? (
                      <img
                        src={require("../images/home/arrow-up.svg").default}
                        alt="arrow-up svg"
                      />
                    ) : (
                      <img
                        src={require("../images/home/arrow-down.svg").default}
                        alt="arrow-down svg"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div style={{ paddingBottom: "0.75%" }}>
                {visibility.element3 && (
                  <div
                    className="row body"
                    style={{ paddingTop: "1%", paddingBottom: "1%" }}
                  >
                    <div className="col-sm-1">คำตอบ : </div>
                    <div className="col">
                      เชื่อถือได้แน่นอน
                      เพราะคนที่สามารถตอบคำนั้นจะเป็นนักศึกษาภายในมหาวิทยาลัยและบุคลากรภายในเท่านั้น
                    </div>
                  </div>
                )}
              </div>
              <hr />
            </div>

            {/* คำถามบ่อยที่ 4 */}
            <div style={{ marginTop: "2%" }}>
              <div className="row">
                <div
                  className="homeHeader3 col"
                  onClick={() =>
                    handleToggleVisibility("element4") &
                    toggleActive("element4")
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  ถ้าอยากเข้าไปเขียนรีวิวในเว็บไซต์ต้องเริ่มอย่างไร ?
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="float-end iconButton"
                    onClick={() =>
                      handleToggleVisibility("element4") &
                      toggleActive("element4")
                    }
                  >
                    {active.element4 ? (
                      <img
                        src={require("../images/home/arrow-up.svg").default}
                        alt="arrow-up svg"
                      />
                    ) : (
                      <img
                        src={require("../images/home/arrow-down.svg").default}
                        alt="arrow-down svg"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div style={{ paddingBottom: "0.75%" }}>
                {visibility.element4 && (
                  <div
                    className="row body"
                    style={{ paddingTop: "1%", paddingBottom: "1%" }}
                  >
                    <div className="col-sm-1">คำตอบ : </div>
                    <div className="col">
                      แค่มีอีเมลสกุล @mail.kmutt.ac.th หรือ @kmutt.ac.th
                      และทำการสมัครสมาชิกเพื่อเข้าสู่ระบบ
                      คุณก็สามารถเข้าไปดูและเขียนรีวิวในเว็บไซต์ได้เลย
                    </div>
                  </div>
                )}
              </div>
              <hr />
            </div>

            {/* คำถามบ่อยที่ 5 */}
            <div style={{ marginTop: "2%", paddingBottom: "1.5%" }}>
              <div className="row">
                <div
                  className="homeHeader3 col"
                  onClick={() =>
                    handleToggleVisibility("element5") &
                    toggleActive("element5")
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  ถ้าเป็นนักศึกษาที่จบการศึกษาไปแล้ว
                  สามารถใช้งานเว็บไซต์ต่อไปได้หรือไม่
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="float-end iconButton"
                    onClick={() =>
                      handleToggleVisibility("element5") &
                      toggleActive("element5")
                    }
                  >
                    {active.element5 ? (
                      <img
                        src={require("../images/home/arrow-up.svg").default}
                        alt="arrow-up svg"
                      />
                    ) : (
                      <img
                        src={require("../images/home/arrow-down.svg").default}
                        alt="arrow-down svg"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div style={{ paddingBottom: "0.75%" }}>
                {visibility.element5 && (
                  <div
                    className="row body"
                    style={{ paddingTop: "1%", paddingBottom: "1%" }}
                  >
                    <div className="col-sm-1">คำตอบ : </div>
                    <div className="col">
                      สามารถใช้งานได้ ถ้าหากว่าคุณสามารถเข้าถึงอีเมลสกุล
                      @mail.kmutt.ac.th หรือ @kmutt.ac.th ได้
                    </div>
                  </div>
                )}
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <div className="layerPadding">
        <div
          style={{
            backgroundColor: "#F4F4F4",
            paddingTop: "2%",
            paddingBottom: "3%",
            paddingLeft: "2%",
            paddingRight: "2%",
          }}
        >
          <div className="count sendAnswer">
            <span style={{ color: "black" }}>ส่ง</span> “คำถามที่คาใจ”
            <span style={{ color: "black" }}>
              {" "}
              ของคุณ
              <br></br>
              เพื่อรับคำตอบที่นี้ได้เลย!
            </span>
          </div>
          <div className="body sendAnswer" style={{ color: "#B14839" }}>
            ทุกคำตอบล้วนมาจากบุคลากรและนักศึกษาของมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรีเท่านั้น
          </div>
          <div className="body sendAnswer">
            <button
              type="button"
              className="sendAnswerButton body"
              onClick={handleQuestionClick}
            >
              เริ่มต้นส่งคำถามที่นี่ →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
