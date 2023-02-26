import React, { useState } from "react";
import "../../styles/review.css";

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
