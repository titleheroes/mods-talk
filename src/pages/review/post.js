import React, { useState } from "react";
import "../../styles/review.css";
import { Dropdown, Form, Button } from "react-bootstrap";

const Review = () => {
  //Search Bar
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  //-----------

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div
                className="body"
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="profile-image">
                    <img
                      src={require("../../images/home/main.png")}
                      alt="main page png"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div>
                  <div>วรรณดา แม็กซิมอฟ</div>

                  <div style={{ color: "#979797", fontSize: "14px" }}>
                    4 วันที่ผ่านมา
                  </div>
                </div>
              </div>
              <div>
                <div className="homeHeader2 mt-3">
                  มารีวิวร้านอาหารที่อร่อยมาก อยู่หลังมอเลยทุกคน!
                </div>
                <div className="rectangle-border">
                  <div className="rectangle-text">ร้านอาหารดังหลังมอ</div>
                </div>
                <div
                  className="mt-3"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={require("../../images/home/main.png")}
                    alt="main page png"
                    className="img-fluid"
                  />
                </div>
                <div className="mt-3">
                  <p>
                    ร้านที่นี่จะเน้นอาหารแนว twist จากแม็กซิกกันแท้ๆ
                    ที่ดัดแปลงให้เข้ากับวัตถุดิบและรสชาติของคน ไทย
                    ทุกเมนูคิดค้นโดยเชฟแม็กซิกันแท้ 100% บรรยากาศในร้านคือดีมากๆ
                    เรามารอบ dinner ก็จะเห็นวิวเมือง กรุงเทพแบบสุดลูกตา
                    สวยมากเป็นลม พนักงานที่นี่ก็ดีมาก เป็นกันเองสุดๆ
                    เซอร์วิสดีสุดๆ ทางร้านมี 2 โซน คือ indoor กับ outdoor
                    บรรยาศดีทั้งคู่เลยค่ะ
                  </p>
                </div>
                <div className="box" style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ paddingRight: "0.5rem" }}>
                        <img
                          src={require("../../images/icon/chat.svg").default}
                          alt="chat svg"
                        />
                      </span>
                      <span style={{ paddingRight: "1rem" }}>12</span>
                      <span style={{ paddingRight: "0.5rem" }}>
                        <img
                          src={require("../../images/icon/like.svg").default}
                          alt="like svg"
                        />
                      </span>
                      <span style={{ paddingRight: "1rem" }}>512</span>
                    </div>
                    <div className="float-end">
                      <Dropdown drop="down">
                        <Dropdown.Toggle
                          variant="link"
                          id="dropdown-basic"
                          style={{
                            border: "none",
                            boxShadow: "none",
                            color: "transparent",
                          }}
                        >
                          <span style={{ color: "black" }}>
                            &bull;&bull;&bull;
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#">Option 1</Dropdown.Item>
                          <Dropdown.Item href="#">Option 2</Dropdown.Item>
                          <Dropdown.Item href="#">Option 3</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <hr className="my-4"></hr>
                <div>
                  <div
                    className="body"
                    style={{
                      display: "flex",
                    }}
                  >
                    <div
                      className="box"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div className="profile-image">
                        <img
                          src={require("../../images/home/main.png")}
                          alt="main page png"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                    <Form style={{ width: "100%" }}>
                      <div className="row">
                        <div className="col-11">
                          <div className="form-size">
                            <Form.Control
                              type="text"
                              placeholder="เขียนความคิดเห็น..."
                            />
                          </div>
                        </div>
                        <div className="col-1">
                          <div className="float-end">
                            <Button
                              type="submit"
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            >
                              <img
                                src={
                                  require("../../images/icon/sent.svg").default
                                }
                                alt="sent svg"
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
                <hr className="my-4"></hr>
                <div
                  className="body"
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    className="box"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div className="profile-image">
                      <img
                        src={require("../../images/home/main.png")}
                        alt="main page png"
                        className="img-fluid"
                      />
                    </div>
                    <span className="mx-3">วรรณดา แม็กซิมอฟ</span>
                  </div>
                  <div className="float-end">
                    <Dropdown drop="down">
                      <Dropdown.Toggle
                        variant="link"
                        id="dropdown-basic"
                        style={{
                          border: "none",
                          boxShadow: "none",
                          color: "transparent",
                        }}
                      >
                        <span style={{ color: "black" }}>
                          &bull;&bull;&bull;
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#">Option 1</Dropdown.Item>
                        <Dropdown.Item href="#">Option 2</Dropdown.Item>
                        <Dropdown.Item href="#">Option 3</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="mt-3">
                  <p>
                    ร้านที่นี่จะเน้นอาหารแนว twist จากแม็กซิกกันแท้ๆ
                    ที่ดัดแปลงให้เข้ากับวัตถุดิบและรสชาติของคน ไทย
                    ทุกเมนูคิดค้นโดยเชฟแม็กซิกันแท้ 100% บรรยากาศในร้านคือดีมากๆ
                    เรามารอบ dinner ก็จะเห็นวิวเมือง กรุงเทพแบบสุดลูกตา
                    สวยมากเป็นลม พนักงานที่นี่ก็ดีมาก เป็นกันเองสุดๆ
                    เซอร์วิสดีสุดๆ ทางร้านมี 2 โซน คือ indoor กับ outdoor
                    บรรยาศดีทั้งคู่เลยค่ะ
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ paddingRight: "0.5rem" }}>
                      10 มกราคม 2565
                    </span>
                    <span style={{ paddingRight: "0.5rem" }}>·</span>
                    <span>ตอบกลับ</span>
                  </div>
                  <div className="float-end">
                    <span style={{ paddingRight: "0.5rem" }}>
                      <img
                        src={require("../../images/icon/like.svg").default}
                        alt="like svg"
                      />
                    </span>
                    <span>10</span>
                  </div>
                </div>
                <hr className="my-4"></hr>
              </div>
            </div>
            <div className="col-md-1">
              <div className="vertical-line"></div>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="button"
                onClick=""
                style={{ width: "100%" }}
              >
                เริ่มต้นการเขียนโพสต์
              </button>
              <div className="searchBar">
                <div className="search-container">
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    style={{
                      height: "2.5rem",
                      width: "100%",
                      borderColor: "#E6E6E6",
                    }}
                  />
                  <div className="search-inside">
                    <div>
                      <span>
                        <img
                          src={require("../../images/icon/search.svg").default}
                          alt="search svg"
                        />
                      </span>
                      <span style={{ paddingLeft: "1rem", fontSize: "14px" }}>
                        Search Mod's Talk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ paddingTop: "1rem", color: "#4F4F4F" }}>
                <span>คลิก</span>{" "}
                <span>
                  <img
                    src={require("../../images/icon/search.svg").default}
                    alt="search svg"
                    style={{ color: "#4F4F4F" }}
                  />
                </span>{" "}
                <span>
                  และพิมพ์เกี่ยวกับสิ่งที่คุณอยากรู้เพื่อค้นหาสิ่งที่คุณต้องการอ่าน
                  เริ่มต้นเพลิดเพลินไปกับการรีวิวด้านบน
                </span>
              </div>
              <div style={{ paddingTop: "1rem" }}>
                <hr />
              </div>
              <div
                className="body"
                style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
              >
                เป็นทิ่นิยมใน Mod's Talk
              </div>
              <div className="box">
                <div className="rectangle-border">
                  <div className="rectangle-text">Programming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
