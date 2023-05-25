import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "../../styles/question.css";
import { api_address, db } from "../../config";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Qmodal() {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

  function handleClose(event) {
    setShow(false);
    setButtonStatus(true);
    setSwitchOn(false);
  }

  const finishClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const [buttonStatus, setButtonStatus] = useState(true);
  const [switchOn, setSwitchOn] = useState(false);

  // Text Sentiment
  const [loadingPost, setLoadingPost] = useState(false);

  async function SendDataToFlask(data) {
    setLoadingPost(true);
    try {
      const responseName = await axios.post(api_address, {
        text: name,
      });

      const responseContent = await axios.post(api_address, {
        text: content,
      });

      console.log("name => " + responseName.data.result);
      console.log("content => " + responseContent.data.result);

      if (
        responseName.data.result === "NEG" ||
        responseContent.data.result === "NEG"
      ) {
        data = { ...data, status: 0 };
      }

      // Hard Code
      // ทำไม : เพื่อกันไม่ให้มีอย่างปลอดภัยแน่นอน
      const badWords = [
        "ควย",
        "เหี้ย",
        "เย็ด",
        "สัส",
        "ไอสัตว์",
        "หี",
        "หำ",
        "มึง",
        "มุง",
        "กู",
        "กุ",
      ];

      const concatenatedBadWordRegex = new RegExp(
        `(${badWords.join("|")})`,
        "i"
      );

      // Check for bad words in the content
      if (concatenatedBadWordRegex.test(content)) {
        data = { ...data, status: 0 };
      }
      // End of Hard Code
    } catch (error) {
      console.error(error);
    } finally {
      createData(data);
      setLoadingPost(false);
      if (data.status === undefined) {
        alert("สร้างโพสต์สำเร็จ");
      } else {
        alert("โพสต์ของคุณต้องได้รับการตรวจสอบ");
      }
    }
  }
  // End of Text Sentiment

  function checkInfo() {
    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    const hasValidLength = trimmedName.length > 0 && trimmedContent.length >= 4;

    if (hasValidLength && switchOn === true) {
      setButtonStatus(false);
    } else {
      setButtonStatus(!hasValidLength);
    }
  }

  function handleSwitchChange() {
    setSwitchOn(!switchOn);
  }

  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "question"), postData);
      console.log("This Post has been created", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setName("");
      setContent("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (switchOn === true) {
      let data = {
        report: 0,
        comment: 0,
        name: "สมาชิกที่ไม่ระบุตัวตน",
        content: content.replace(/\n/g, "<br>"),
        date: formattedDate,
        time: formattedTime,
      };
      SendDataToFlask(data);
    } else {
      let data = {
        report: 0,
        comment: 0,
        name: name,
        content: content.replace(/\n/g, "<br>"),
        date: formattedDate,
        time: formattedTime,
      };
      SendDataToFlask(data);
    }
  }

  return (
    <>
      {loadingPost ? (
        <button
          disabled
          type="button"
          className="button"
          onClick={handleShow}
          style={{ width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="px-3">กำลังโพสต์</span>
            <div
              className="spinner-border"
              style={{ width: "1rem", height: "1rem" }}
            />
          </div>
        </button>
      ) : (
        <button type="button" className="postButton" onClick={handleShow}>
          เริ่มต้นถามคำถาม
        </button>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="question-modal"
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-header question-modal-header pt-4">
            <h1
              className="modal-title question-modal-title fs-5 ps-2 "
              id="exampleModalLabel"
            >
              สร้างโพสต์คำถาม
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
            <text className="modal-topic ">
              ชื่อ-นามสกุล{" "}
              <span style={{ color: "red", fontSize: "12px" }}> *</span>
            </text>
            <input
              type="text"
              disabled={switchOn}
              className="form-control mt-2 mb-3"
              id="modal-input-box"
              placeholder="ระบุชื่อและนามสกุลของท่าน"
              onChange={(e) => {
                setName(e.target.value);
                checkInfo();
              }}
            />

            <text className="modal-topic ">
              คำถามที่ต้องการจะถาม{" "}
              <span style={{ color: "red", fontSize: "12px" }}>
                {" "}
                * ขั้นต่ำ 4 ตัวอักษร
              </span>
            </text>
            <textarea
              class="form-control mt-2 question-modal-input"
              id="modal-input-box"
              placeholder="เขียนคำถามที่ต้องการถาม"
              rows="6"
              onChange={(e) => {
                setContent(e.target.value);
                checkInfo();
              }}
            />

            <div className="anon-tick mt-3 py-2  flex-container">
              <div>
                <text className="ps-3">โพสต์โดยไม่ระบุตัวตน</text>
              </div>

              <div className="me-2">
                <Form>
                  <Form.Check
                    type="switch"
                    onChange={handleSwitchChange}
                    id="question-anon-tick"
                  />
                </Form>
              </div>
            </div>
          </div>

          <div className="modal-footer question-modal-footer flex-center pt-1 pb-4">
            <button
              type="submit"
              disabled={buttonStatus}
              className="btn post-question-btn mx-auto mt-0 "
              onClick={finishClose}
            >
              โพสต์
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

const Question = () => {
  const navigate = useNavigate();

  const [all, setAll] = useState([]);
  const [noAns, setNoAns] = useState([]);

  const [active, setActive] = useState(true);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  function closeItem() {
    setActive(false);
  }

  //Search Bar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTextShow, setSearchTextShow] = useState(true);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setSearchTextShow(true);
    } else {
      setSearchTextShow(false);
    }
  };

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (searchTextShow === false) {
      const trimmedSearchQuery = searchQuery.trim();
      if (trimmedSearchQuery === "") {
        alert("กรุณากรอกข้อความก่อนค้นหา");
      } else {
        setSearchQuery("");
        window.location.href = "/question/search/" + searchQuery;
      }
    }
  }
  //-----------

  useEffect(() => {
    const itemsCollection = collection(db, "question");

    let sortedCollection = query(
      itemsCollection,
      orderBy("date", "desc"),
      orderBy("time", "desc")
    );

    try {
      const unsubscribe = onSnapshot(sortedCollection, (querySnapshot) => {
        const itemsList = [];
        const noAns_array = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
          if (item.comment === 0) {
            noAns_array.push(item);
          }
          console.log("Succesfully Loading Post");
        });
        setAll(itemsList);
        setNoAns(noAns_array);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="left-content">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">มดส์-ทอล์ค</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      ถาม-ตอบ
                    </li>
                  </ol>
                </nav>

                <span className="qTitle">ถาม-ตอบ</span>
                <div className="pt-3">
                  <span>คำอธิบาย : </span>
                  เป็นส่วนของคนที่อยากรู้จักมหาวิทยาลัย
                  หรือต้องการเข้ามาศึกษาต่อ สามารถเข้ามาเพื่อถามคำถาม
                  และได้คำตอบจากนักศึกษาจริงๆ
                </div>

                <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
                  <Tab className="pt-4 " eventKey="all" title="ทั้งหมด">
                    <div>
                      {all ? (
                        <div>
                          {all.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div className="post-border">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <p className="poster-name pb-3">
                                      {item.name}
                                    </p>
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        variant="link"
                                        id="question-dropdown"
                                      >
                                        <img
                                          className="menu-dropdown"
                                          src={
                                            require("../../images/question/three_dots.svg")
                                              .default
                                          }
                                          alt=""
                                        />
                                      </Dropdown.Toggle>

                                      <Rep_Click
                                        postID={item.id}
                                        rep_count={item.report}
                                      />
                                    </Dropdown>
                                  </div>

                                  <p
                                    className="pb-2 text"
                                    dangerouslySetInnerHTML={{
                                      __html: item.content,
                                    }}
                                  ></p>

                                  <div className="flex-container comment">
                                    <div className="flex-1-comment">
                                      <span className="post-date">
                                        {formattedDate === item.date
                                          ? item.time
                                          : item.date}
                                      </span>
                                    </div>

                                    <div className="flex-2-comment pb-3">
                                      <Link
                                        to={"/question/post/" + item.id}
                                        style={{ paddingRight: "0.5rem" }}
                                      >
                                        <img
                                          src={
                                            require("../../images/icon/chat.svg")
                                              .default
                                          }
                                          alt="chat svg"
                                        />
                                      </Link>
                                      <span style={{ paddingRight: "1rem" }}>
                                        {item.comment}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>data not available</div>
                      )}
                    </div>
                  </Tab>

                  <Tab
                    className="pt-4"
                    eventKey="no-ans"
                    title={`คำถามที่ไม่มีคำตอบ (${noAns.length})`}
                  >
                    <div>
                      {noAns ? (
                        <div>
                          {noAns.map((item) => (
                            <div key={item.id}>
                              <div className="post-border">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <p className="poster-name pb-3">
                                    {item.name}
                                  </p>
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      variant="link"
                                      id="question-dropdown"
                                    >
                                      <img
                                        className="menu-dropdown"
                                        src={
                                          require("../../images/question/three_dots.svg")
                                            .default
                                        }
                                        alt=""
                                      />
                                    </Dropdown.Toggle>

                                    <Rep_Click
                                      postID={item.id}
                                      rep_count={item.report}
                                    />
                                  </Dropdown>
                                </div>
                                <p
                                  className="pb-2 text"
                                  dangerouslySetInnerHTML={{
                                    __html: item.content,
                                  }}
                                ></p>

                                <div className="flex-container comment">
                                  <div className="flex-1-comment">
                                    <span className="post-date">
                                      {formattedDate === item.date
                                        ? item.time
                                        : item.date}
                                    </span>
                                  </div>

                                  <div className="flex-2-comment pb-3">
                                    <Link
                                      to={"/question/post/" + item.id}
                                      style={{ paddingRight: "0.5rem" }}
                                    >
                                      <img
                                        src={
                                          require("../../images/icon/chat.svg")
                                            .default
                                        }
                                        alt="chat svg"
                                      />
                                    </Link>
                                    <span style={{ paddingRight: "1rem" }}>
                                      {item.comment}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>data not available</div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
            <div className="col-md-1">
              <div className="vertical-line"></div>
            </div>
            <div className="col-md-3">
              <Qmodal />

              <div className={active ? "open tips" : "close tips"}>
                <div class="row tipsTitle">
                  <div class="col ">เคล็ดลับเครื่องมือ</div>

                  <div class="col-2 close-button">
                    <img
                      className="close-icon"
                      src={require("../../images/question/cross.svg").default}
                      alt=""
                      onClick={closeItem}
                    />
                  </div>
                </div>

                <p className="tipsContent">
                  คุณสามารถเริ่มถามคำถามจากปุ่มด้านบนนี้
                  เพื่อถามสิ่งที่สงสัยได้เกี่ยวกับมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
                </p>
              </div>
              <div className="searchBar pt-3">
                <div className="search-container">
                  <form>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="form-control"
                      style={{ paddingLeft: "2.5rem" }}
                    />
                  </form>
                  <div className="search-inside">
                    <div>
                      <span>
                        <img
                          src={require("../../images/icon/search.svg").default}
                          alt="search svg"
                        />
                      </span>
                      {searchTextShow ? (
                        <span style={{ paddingLeft: "1rem", fontSize: "14px" }}>
                          Search Mod's Talk
                        </span>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="search-tips">
                <text className="search-tips" id="s1">
                  คลิก
                </text>
                <img
                  className="search-icon"
                  id="2"
                  src={require("../../images/question/search.svg").default}
                  alt=""
                />

                <text className="search-tips" id="s2">
                  และพิมพ์เกี่ยวกับสิ่งที่คุณอยากรู้เพื่อค้นหาคำถาม
                  ที่ใกล้เคียงหรือหาคำตอบไปด้วยกัน
                </text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Rep_Click({ postID, rep_count }) {
  const handleReportClick = () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะรายงานโพสต์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "question", postID);
      updateDoc(docRef, {
        report: rep_count + 1,
      })
        .then(() => {
          console.log("You Report the post!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      alert("ขอบคุณที่แจ้งรายงาน ทางแอดมินจะพยายามตรวจสอบให้เร็วที่สุด");
    }
  };

  return (
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleReportClick}>รายงานโพสต์</Dropdown.Item>
    </Dropdown.Menu>
  );
}

export default Question;
