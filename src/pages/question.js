import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "../styles/question.css";
import { color, display, style } from "@mui/system";

function Qmodal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button onClick={handleShow} type="button" class="btn ask-button">
        เริ่มต้นถามคำถาม
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
          <text className="modal-topic ">ชื่อ-นามสกุล</text>
          <input
            type="text"
            className="form-control mt-2 mb-3"
            id="modal-input-box"
            placeholder="ระบุชื่อและนามสกุลของท่าน"
          ></input>

          <text className="modal-topic ">คำถามที่ต้องการจะถาม</text>
          <textarea
            class="form-control mt-2 question-modal-input"
            id="modal-input-box"
            placeholder="เขียนคำถามที่ต้องการถาม"
            rows="3"
          ></textarea>

          <div className="anon-tick mt-3 py-2  flex-container">
            <div>
              <text className="ps-3">โพสต์โดยไม่ระบุตัวตน</text>
            </div>

            <div className="me-2">
              <Form>
                <Form.Check type="switch" id="question-anon-tick" />
              </Form>
            </div>
          </div>
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

const Question = () => {
  const [active, setActive] = useState(true);

  function closeItem() {
    setActive(false);
  }
  function openItem() {
    setActive(true);
  }

  return (
    <div className="page">
      <div className="row">
        <div className="col-md vertLine">
          <div className="left-content">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">มดส์-ทอล์ค</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  ถาม-ตอบ
                </li>
              </ol>
            </nav>

            <span className="qTitle">ถาม-ตอบ</span>

            <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
              <Tab className="pt-4 " eventKey="all" title="ทั้งหมด">
                <div className="post-border">
                  <p className="poster-name pb-3">ผู้ไม่ประสงค์ออกนาม</p>
                  <p className="pb-2 text">
                    ผมสงสัยครับ รบกวนผู้รู้ตอบผมทีว่า วิทยคอมของคณะ IT
                    กับคณะวิทย์ต่างกันยังไงครับ รบกวนผู้รู้ตอบผมทีว่า
                    วิทยคอมของคณะ IT กับคณะวิทย์ต่างกันยังไงครับ
                  </p>

                  <div className="flex-container comment">
                    <div className="flex-1-comment">
                      <span className="post-date">10 มกราคม 2565</span>
                    </div>

                    <div className="flex-2-comment">
                      <a href="/answer" className="post-comment">
                        <img
                          className="menu-pic"
                          src={require("../images/question/chat_1.svg").default}
                          alt=""
                        />
                        <text id="comment-count">2</text>
                      </a>
                    </div>

                    <div className="flex-1-comment-right">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" id="question-dropdown">
                          <img
                            className="menu-dropdown"
                            src={
                              require("../images/question/three_dots.svg")
                                .default
                            }
                            alt=""
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">
                            Report Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-2">
                            Delete Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-3">
                            Something else
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>

                <div className="post-border">
                  <p className="poster-name pb-3">ผู้ไม่ประสงค์ออกนาม</p>
                  <p className="pb-2 text">
                    ผมสงสัยครับ รบกวนผู้รู้ตอบผมทีว่า วิทยคอมของคณะ IT
                    กับคณะวิทย์ต่างกันยังไงครับ
                  </p>
                  <div className="flex-container comment">
                    <div className="flex-1-comment">
                      <span className="post-date">10 มกราคม 2565</span>
                    </div>

                    <div className="flex-2-comment">
                      <a href="" className="post-comment">
                        <img
                          className="menu-pic"
                          src={require("../images/question/chat_1.svg").default}
                          alt=""
                        />
                        <text id="comment-count">10</text>
                      </a>
                    </div>

                    <div className="flex-1-comment-right">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" id="question-dropdown">
                          <img
                            className="menu-dropdown"
                            src={
                              require("../images/question/three_dots.svg")
                                .default
                            }
                            alt=""
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">
                            Report Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-2">
                            Delete Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-3">
                            Something else
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab
                className="pt-4"
                eventKey="no-ans"
                title="คำถามที่ไม่มีคำตอบ"
              >
                <div className="post-border">
                  <p className="poster-name pb-3">ผู้ไม่ประสงค์ออกนาม</p>
                  <p className="pb-2 text">
                    ผมสงสัยครับ รบกวนผู้รู้ตอบผมทีว่า วิทยคอมของคณะ IT
                    กับคณะวิทย์ต่างกันยังไงครับ ผมสงสัยครับ
                    รบกวนผู้รู้ตอบผมทีว่า วิทยคอมของคณะ IT
                    กับคณะวิทย์ต่างกันยังไงครับ
                  </p>

                  <div className="flex-container comment">
                    <div className="flex-1-comment">
                      <span className="post-date">10 มกราคม 2565</span>
                    </div>

                    <div className="flex-2-comment">
                      <a href="" className="post-comment">
                        <img
                          className="menu-pic"
                          src={require("../images/question/chat_1.svg").default}
                          alt=""
                        />
                        <text id="comment-count">10</text>
                      </a>
                    </div>

                    <div className="flex-1-comment-right">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" id="question-dropdown">
                          <img
                            className="menu-dropdown"
                            src={
                              require("../images/question/three_dots.svg")
                                .default
                            }
                            alt=""
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">
                            Report Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-2">
                            Delete Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-3">
                            Something else
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>

                <div className="post-border">
                  <p className="poster-name pb-3">ผู้ไม่ประสงค์ออกนาม</p>
                  <p className="pb-2 text">
                    ผมสงสัยครับ รบกวนผู้รู้ตอบผมทีว่า วิทยคอมของคณะ IT
                    กับคณะวิทย์ต่างกันยังไงครับ
                  </p>
                  <div className="flex-container comment">
                    <div className="flex-1-comment">
                      <span className="post-date">10 มกราคม 2565</span>
                    </div>

                    <div className="flex-2-comment">
                      <a href="" className="post-comment">
                        <img
                          className="menu-pic"
                          src={require("../images/question/chat_1.svg").default}
                          alt=""
                        />
                        <text id="comment-count">10</text>
                      </a>
                    </div>

                    <div className="flex-1-comment-right">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" id="question-dropdown">
                          <img
                            className="menu-dropdown"
                            src={
                              require("../images/question/three_dots.svg")
                                .default
                            }
                            alt=""
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">
                            Report Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-2">
                            Delete Post
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-3">
                            Something else
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className="col-md-4">
          <div className="d-grid mx-auto right-content ">
            <Qmodal />

            <div className={active ? "open tips" : "close tips"}>
              <div class="row tipsTitle">
                <div class="col ">เคล็ดลับเครื่องมือ</div>

                <div class="col-2 close-button">
                  <img
                    className="close-icon"
                    src={require("../images/question/cross.svg").default}
                    alt=""
                    onClick={closeItem}
                  />
                </div>
              </div>

              <p className="tipsContent">
                {" "}
                คุณสามารถเริ่มถามคำถามจากปุ่มด้านบนนี้ หรือ
                ถ้าสงสัยเกี่ยวกับรายวิชา หอพัก สิ่งต่างๆ
                สามารถค้นหาสิ่งที่คุณอยากรู้ได้ที่แถบด้านล่างนี้เลย
              </p>
            </div>

            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาคำถาม"
              ></input>
            </div>

            <div className="search-tips">
              <text className="search-tips" id="s1">
                คลิก
              </text>
              <img
                className="search-icon"
                id="2"
                src={require("../images/question/search.svg").default}
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
  );
};

export default Question;
