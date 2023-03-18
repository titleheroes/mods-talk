import React, { useState } from "react";
import "../styles/profile.css";
import "../styles/notification.css";
import { Tabs, Tab, Dropdown, ListGroup, Modal, Form } from "react-bootstrap";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { IconButton, useMediaQuery } from "@mui/material";
import { Typography } from "@mui/material";
import { ListItemText } from "@mui/material";
import Button from "@mui/material/Button";

function EditProfile() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <button onClick={handleShow} type="button" class="btn ask-button">
        เริ่มต้นถามคำถาม
      </button> */}
      {/* <button
        type="button"
        className="button"
        onClick={handleShow}
        style={{ width: "100%" }}
      >
        เริ่มต้นการเขียนโพสต์
      </button> */}

      <button
        type="button"
        className="btn bbprofile"
        onClick={handleShow}
        variant="outlined"
      >
        แก้ไขโปรไฟล์
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="question-modal"
      >
        <div className="modal-header question-modal-header pt-4">
          <h1
            className="modal-title question-modal-title fs-5 ps-2 "
            id="exampleModalLabel"
          >
            สร้างโพสต์รีวิว
          </h1>
          <button
            type="button"
            className="btn-close ps-5"
            id="modal-close"
            onClick={handleClose}
            aria-label="Close"
          ></button>
        </div>

        <div className="modal-body question-modal-body px-4 pt-2">
          <text className="modal-topic ">เนื้อหาโพสต์</text>
          <input
            type="text"
            className="form-control mt-2 mb-3"
            id="modal-input-box"
            placeholder="เขียนหัวข้อเรื่อง เพื่อให้โพสต์น่าสนใจมากขึ้น..."
          />

          <textarea
            class="form-control mt-2 mb-3 question-modal-input"
            id="modal-input-box"
            placeholder="เขียนคำบรรยายเพิ่มเติม..."
            rows="6"
          />

          <text className="modal-topic">
            รูปภาพประกอบ : ใส่ได้ไม่เกิน 3 รูป
          </text>
          <input
            type="text"
            className="form-control mt-2 mb-3"
            id="modal-input-box"
            placeholder="ไฟล์รูปภาพสกุล JPG, PNG"
          />

          <text className="modal-topic">แฮชแท็ก</text>
          <input
            type="text"
            className="form-control mt-2 mb-3"
            id="modal-input-box"
            placeholder="#แฮชแท็ก"
          />
        </div>

        <div className="modal-footer question-modal-footer flex-center pt-1 pb-4">
          <button
            type="button"
            className="btn post-question-btn mx-auto mt-0 "
            onClick={handleClose}
          >
            เริ่มต้นการเขียนโพสต์
          </button>
        </div>
      </Modal>
    </>
  );
}

const Profile = () => {
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

  //LikeButton
  // const [liked, setLiked] = useState(false);

  // const handleLikeClick = () => {
  //   setLiked(!liked);
  // };

  const matches = useMediaQuery("(min-width:1024px)");

  let orderOne, orderTwo;
  if (matches) {
    orderOne = "1";
    orderTwo = "2";
  } else {
    orderOne = "2";
    orderTwo = "1";
  }

  return (
    <div className="page">
      <div className="row">
        <div className="col-md vertLine" style={{ order: orderOne }}>
          <div className="left-content">
            <span className="qTitle">วรรณดา แม็กซิมอฟ</span>
            <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
              <Tab className="pt-4" eventKey="all" title="โพสต์ของคุณทั้งหมด">
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
                            src={require("../images/profile/userinkmutt.png")}
                            alt="main page png"
                            className="img-fluid"
                          />
                        </div>
                      </div>
                      <div className="boxblock">
                        <span className="postname">วรรณดา แม็กซิมอฟ</span>

                        <span className="postdate">4 วันที่ผ่านมา</span>
                      </div>

                      {/* <div style={{ paddingLeft: "1rem" }}></div> */}
                    </div>
                    <div>
                      <div className="homeHeader2">
                        วิชานี้ GEN231 ดีมั้ยครับ อยากฟังรีวิวจากพี่ๆ ครับ
                      </div>
                      <div className="text-limit posttext">
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
                                    require("../images/icon/chat.svg").default
                                  }
                                  alt="chat svg"
                                />
                              </span>
                              <span
                                className="numcom"
                                style={{ paddingRight: "1rem" }}
                              >
                                12
                              </span>
                              <span style={{ paddingRight: "0.5rem" }}>
                                <img
                                  src={
                                    require("../images/icon/like.svg").default
                                  }
                                  alt="like svg"
                                />
                                {/* <IconButton onClick={handleLikeClick}>
                                  <FavoriteBorderOutlinedIcon color={liked? 'error': 'inherit'} sx={{ fontSize: 30 }}></FavoriteBorderOutlinedIcon>
                                </IconButton> */}
                              </span>
                              <span
                                className="numcom"
                                style={{ paddingRight: "1rem" }}
                              >
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
                                <Dropdown.Item href="#">Option 1</Dropdown.Item>
                                <Dropdown.Item href="#">Option 2</Dropdown.Item>
                                <Dropdown.Item href="#">Option 3</Dropdown.Item>
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
            </Tabs>
          </div>
        </div>

        <div className="col-md-4" style={{ order: orderTwo }}>
          <div className="d-grid mx-auto right-content ">
            <button
              type="button"
              class="btn ask-button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              เริ่มต้นถามคำถาม
            </button>

            <EditProfile />
            {/* <button
              type="button"
              class="btn bbprofile"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              variant="outlined"
            >
              แก้ไขโปรไฟล์
            </button> */}

            <div className="box-profile-image-data">
              <div className="profile-image-data">
                <img
                  src={require("../images/profile/userinkmutt.png")}
                  alt="main page png"
                  className="img-fluid"
                />
              </div>
            </div>

            <Typography
              className="profileName"
              component="span"
              variant="body2"
            >
              วรรณดา แม็กซิมอฟ
            </Typography>

            <Typography className="profilestatus" variant="body2">
              นักศึกษา
            </Typography>

            <ListItemText
              primary={
                <Typography className="profiledata" variant="body2">
                  รหัสนักศึกษา :
                </Typography>
              }
              secondary={
                <Typography className="profileans">
                  {" "}
                  &nbsp; 62090500556
                </Typography>
              }
            />

            <ListItemText
              primary={
                <Typography className="profiledata1" variant="body2">
                  คณะ :
                </Typography>
              }
              secondary={
                <Typography className="profileans">
                  {" "}
                  &nbsp; คณะวิทยาศาสตร์
                </Typography>
              }
            />

            <ListItemText
              primary={
                <Typography className="profiledata1" variant="body2">
                  สาขาวิชา :
                </Typography>
              }
              secondary={
                <Typography className="profileans">
                  {" "}
                  &nbsp; วิทยาการคอมพิวเตอร์ประยุกต์
                </Typography>
              }
            />

            {/* <Button className="bbprofile" variant="outlined">แก้ไขโปรไฟล์</Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
