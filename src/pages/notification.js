import React, { useState } from "react";
import "../styles/notification.css";
import { Tabs, Tab, Dropdown } from "react-bootstrap";

const Review = () => {
  //Search Bar
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  //-----------

  //Sorting
  const [selectedOption, setSelectedOption] = useState("ทั้งหมด");

  const handleOptionSelect = (optionName) => {
    setSelectedOption(optionName);
  };
  //-----------

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div style={{ position: "relative" }}>
                <Tabs style={{ width: "70%" }} defaultActiveKey="all">
                  <Tab
                    className="pt-4 tab-detail"
                    eventKey="all"
                    title="ทั้งหมด"
                  >
                    <div className="row">
                      <div className="col-9">
                        <div
                          className="body"
                          style={{
                            display: "flex",
                          }}
                        >
                          <div className="box">
                            <div className="profile-image">
                              <img
                                src={require("../images/home/main.png")}
                                alt="main page png"
                                className="img-fluid"
                              />
                            </div>
                          </div>
                          <div
                            className="box"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            วรรณดา แม็กซิมอฟ
                            <span style={{ paddingLeft: "1rem" }}>
                              4 วันที่ผ่านมา
                            </span>
                          </div>

                          <div style={{ paddingLeft: "1rem" }}></div>
                        </div>
                        <div>
                          <div className="homeHeader2">
                            วิชานี้ GEN231 ดีมั้ยครับ อยากฟังรีวิวจากพี่ๆ ครับ
                          </div>
                          <div className="text-limit body">
                            ผมเรียนอยู่ ปี 3 ภาควิชาคณิตศาสตร์ครับ
                            อยากทราบความเห็นของพี่ๆ ที่เรียนวิชานี้ปีที่แล้วครับ
                            ว่ามันดีไม่ดีอย่าง ไร มันดึงเกรดเยอะมั้ยครับ
                            พอดีไม่อยากให้เกรดตกครับผม
                          </div>
                          <div style={{ paddingTop: "1rem", width: "100%" }}>
                            <div className="box">
                              <div className="rectangle-container">
                                <div className="rectangle-border">
                                  <div className="rectangle-text">GEN231</div>
                                </div>
                              </div>
                            </div>
                            <div className="box float-end">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <span style={{ paddingRight: "0.5rem" }}>
                                    <img
                                      src={
                                        require("../images/icon/chat.svg")
                                          .default
                                      }
                                      alt="chat svg"
                                    />
                                  </span>
                                  <span style={{ paddingRight: "1rem" }}>
                                    12
                                  </span>
                                  <span style={{ paddingRight: "0.5rem" }}>
                                    <img
                                      src={
                                        require("../images/icon/like.svg")
                                          .default
                                      }
                                      alt="like svg"
                                    />
                                  </span>
                                  <span style={{ paddingRight: "1rem" }}>
                                    512
                                  </span>
                                </div>
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
                                    <Dropdown.Item href="#">
                                      Option 1
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#">
                                      Option 2
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#">
                                      Option 3
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-3">
                        <img
                          src={require("../images/example/1x1.png")}
                          alt="ex_1x1"
                          className="img-fluid float-end"
                        />
                      </div>
                      <div style={{ paddingTop: "1rem" }}>
                        <hr />
                      </div>
                    </div>
                  </Tab>

                  <Tab className="pt-5" eventKey="subject" title="วิชาเรียน">
                    ่าาาาาา
                  </Tab>
                  <Tab className="pt-5" eventKey="teacher" title="อาจารย์">
                    ่าาาาาา
                  </Tab>
                  <Tab className="pt-5" eventKey="restaurant" title="ร้านอาหาร">
                    ่าาาาาา
                  </Tab>
                  <Tab className="pt-5" eventKey="dorm" title="หอพัก">
                    ่าาาาาา
                  </Tab>
                  <Tab className="pt-5" eventKey="work" title="สถานที่ฝึกงาน">
                    ่าาาาาา
                  </Tab>
                </Tabs>
                <div style={{ position: "absolute", top: 0, right: 0 }}>
                  <Dropdown>
                    <Dropdown.Toggle
                      style={{
                        backgroundColor: "transparent",
                        color: "BLACK",
                        borderColor: "black",
                        width: "100px",
                      }}
                      id="dropdown-basic"
                    >
                      {selectedOption}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleOptionSelect("ทั้งหมด")}
                      >
                        ทั้งหมด
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleOptionSelect("ยอดนิยม")}
                      >
                        ยอดนิยม
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="box float-end">
                <div className="float-end"></div>
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
                          src={require("../images/icon/search.svg").default}
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
                    src={require("../images/icon/search.svg").default}
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
