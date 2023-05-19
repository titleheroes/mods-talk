import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../../styles/question.css";
import { api_address, auth, db } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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

    const hasValidLength = trimmedName.length > 0 && trimmedContent.length >= 8;

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
            <text className="modal-topic ">ชื่อ-นามสกุล</text>
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

            <text className="modal-topic ">คำถามที่ต้องการจะถาม</text>
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
              className="btn post-question-btn mx-auto mt-0"
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

const Answer = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

  const [active, setActive] = useState(true);

  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [comment, setComment] = useState([]);

  const [visibility, setVisibility] = useState({});
  const [buttonStatus, setButtonStatus] = useState(true);

  function checkInfo() {
    const trimmedContent = content.trim(); // remove leading/trailing spaces
    const hasValidLength = trimmedContent.length >= 8; // check length and newline
    setButtonStatus(!hasValidLength);
  }

  const handleToggleVisibility = (id) => {
    setVisibility({
      ...visibility,
      [id]: !visibility[id],
    });
  };

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

  // Text Sentiment
  const [loadingPost, setLoadingPost] = useState(false);

  async function SendDataToFlask(data) {
    setLoadingPost(true);

    try {
      const responseContent = await axios.post(api_address, {
        text: content,
      });

      console.log("content => " + responseContent.data.result);

      if (responseContent.data.result === "NEG") {
        data = { ...data, status: 0 };
      }
    } catch (error) {
      console.error(error);
    } finally {
      createData(data);
      setContent("");
      setLoadingPost(false);
      if (data.status === undefined) {
        alert("สร้างคอมเมนท์สำเร็จ");
      } else {
        alert("คอมเมนท์ของคุณต้องได้รับการตรวจสอบ");
      }
    }
  }
  // End of Text Sentiment

  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "cmnt_question"), postData);
      if (postData.status === undefined) {
        const docRef2 = doc(db, "question", id);
        updateDoc(docRef2, {
          comment: post.comment + 1,
        });
      }
      console.log("This Comment has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  // ดันข้อมูลคอมเมนท์
  const commentSubmit = (event) => {
    const currentUserId = currentUser.uid;
    if (buttonStatus) {
    } else {
      event.preventDefault();
      let data = {
        post_id: id,
        report: 0,
        reply: 0,
        content: content.replace(/\n/g, "<br>"),
        member_id: currentUserId,
        date: formattedDate,
        time: formattedTime,
      };
      SendDataToFlask(data);
    }
  };

  // ดึงข้อมูลโพสต์
  useEffect(() => {
    const questionRef = collection(db, "question");
    const docRef = doc(questionRef, id);

    try {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setPost(doc.data());
        } else {
          console.log("No such document!");
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  // ดึง cmnt_review
  useEffect(() => {
    const q = query(
      collection(db, "cmnt_question"),
      where("post_id", "==", id)
    );

    try {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const comments = [];
        querySnapshot.forEach((doc) => {
          comments.push({ id: doc.id, ...doc.data() });
        });
        setComment(comments);
        console.log("Comment has been pulled");
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Sorting
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sortedData = [...comment].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA > dateB) {
        return -1; // sort dateA before dateB
      } else if (dateA < dateB) {
        return 1; // sort dateA after dateB
      } else {
        const timeA = new Date(`1970-01-01T${a.time}`);
        const timeB = new Date(`1970-01-01T${b.time}`);

        if (timeA > timeB) {
          return -1; // sort timeA before timeB
        } else if (timeA < timeB) {
          return 1; // sort timeA after timeB
        } else {
          return 0; // same date and time
        }
      }
    });

    // Group data by date
    const groupedData = {};
    sortedData.forEach((item) => {
      const date = item.date;
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    });

    // Sort each group by time ascending
    for (const date in groupedData) {
      groupedData[date] = groupedData[date].sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time}`);
        const timeB = new Date(`1970-01-01T${b.time}`);
        return timeA - timeB; // sort timeA before timeB for ascending order
      });
    }

    // Merge and flatten the groups
    const mergedData = Object.values(groupedData).flat();

    const reversedData = mergedData.reverse();

    setSortedData(reversedData);
  }, [comment]);
  // End of Sorting

  useEffect(() => {
    checkInfo();
  }, [content]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="left-content">
                <div className="post-border">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className="homeHeader2 pb-3">{post.name}</p>
                    <Dropdown>
                      <Dropdown.Toggle variant="link" id="question-dropdown">
                        <img
                          className="menu-dropdown"
                          src={
                            require("../../images/question/three_dots.svg")
                              .default
                          }
                          alt=""
                        />
                      </Dropdown.Toggle>

                      <Rep_Click postID={post.id} rep_count={post.report} />
                    </Dropdown>
                  </div>

                  <p
                    className="pb-2 text"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></p>

                  <div className="flex-container comment">
                    <div className="flex-1-comment">
                      <span className="post-date">
                        {formattedDate === post.date ? post.time : post.date}
                      </span>
                    </div>

                    <div className="flex-2-comment">
                      <img
                        src={require("../../images/icon/chat.svg").default}
                        alt="chat svg"
                      />

                      <span
                        style={{ paddingLeft: "0.3rem", paddingRight: "1rem" }}
                      >
                        {post.comment}
                      </span>
                    </div>
                  </div>
                </div>

                {/* เขียนคอมเมนท์                           */}
                {currentUser ? (
                  <form className="post-border" onSubmit={commentSubmit}>
                    <div className="flex-container comment" id="comment-2">
                      <div
                        className="box-reply-profile-image"
                        style={{ marginRight: "1rem" }}
                      >
                        <div className="reply-profile-image">
                          <img src={userData.profile} className="img-fluid" />
                        </div>
                      </div>

                      <textarea
                        disabled={loadingPost}
                        className="form-control"
                        id="content"
                        placeholder="เขียนความคิดเห็น..."
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          checkInfo();
                        }}
                        rows={1}
                      />

                      <div className="flex-1-right">
                        {loadingPost ? (
                          <div className="px-4">
                            <div
                              className="spinner-border"
                              style={{ width: "1.8rem", height: "1.8rem" }}
                            />
                          </div>
                        ) : (
                          <button
                            className="sent-comment px-3"
                            disabled={buttonStatus}
                            type="submit"
                          >
                            <img
                              className="menu-pic pe-3"
                              src={
                                require("../../images/question/sent_1.svg")
                                  .default
                              }
                              alt=""
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                ) : (
                  <div></div>
                )}
                {/* เขียนคอมเมนท์                           */}

                <div>
                  {sortedData ? (
                    <div>
                      {sortedData.map((item) => (
                        <div key={item.id}>
                          {item.status === undefined ? (
                            <div className="post-border pb-3">
                              <div className="flex-container comment pt-3">
                                <MemberInfo memberID={item.member_id} />

                                <div className="flex-1-right">
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

                                    <Rep_Del_Comment_Click
                                      postID={id}
                                      cmnt_count={post.comment}
                                      cmnt_id={item.id}
                                      rep_count={item.report}
                                      member_id={item.member_id}
                                    />
                                  </Dropdown>
                                </div>
                              </div>

                              <div
                                className="pt-4"
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />

                              <div
                                className="flex-container comment pt-2"
                                id="comment-reply"
                              >
                                <div className="pe-4">
                                  <span className="post-date">
                                    {formattedDate === item.date
                                      ? item.time
                                      : item.date}
                                  </span>
                                </div>

                                <div>
                                  <Button
                                    className="reply-button"
                                    onClick={() =>
                                      handleToggleVisibility(item.id)
                                    }
                                  >
                                    <text id="reply-text">
                                      ตอบกลับ
                                      <span>
                                        {" ("}
                                        {item.reply}
                                        {")"}
                                      </span>
                                    </text>
                                  </Button>
                                </div>
                              </div>

                              {visibility[item.id] && (
                                <div className="container">
                                  <ReplyLoad
                                    userData={userData}
                                    postID={id}
                                    cmntID={item.id}
                                    replyCount={item.reply}
                                  />
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>data not available</div>
                  )}
                </div>
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

function MemberInfo({ memberID }) {
  const [memberData, setMemberData] = useState(null);

  // pull userData
  useEffect(() => {
    try {
      const memberDocRef = doc(db, "member", memberID);
      getDoc(memberDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Successfully Load userData");
          const data = docSnap.data();
          setMemberData(data);
        } else {
          console.error("Member document not found");
        }
      });
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  }, []);
  // pull userData

  return (
    <div>
      {memberData && (
        <div
          className="body"
          style={{
            display: "flex",
          }}
        >
          <div className="box">
            <div className="profile-image">
              <img
                src={memberData.profile}
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
            {memberData.fname} {memberData.lname}
          </div>

          <div style={{ paddingLeft: "1rem" }}></div>
        </div>
      )}
    </div>
  );
}

function ReplyLoad({ userData, postID, cmntID, replyCount }) {
  const [content, setContent] = useState("");
  const [reply, setReply] = useState([]);
  const [buttonStatus, setButtonStatus] = useState(true);

  const currentUser = auth.currentUser;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

  function checkInfo() {
    const trimmedContent = content.trim(); // remove leading/trailing spaces
    const hasValidLength = trimmedContent.length >= 8; // check length and newline
    setButtonStatus(!hasValidLength);
  }

  // Text Sentiment
  const [loadingPost, setLoadingPost] = useState(false);

  async function SendDataToFlask(data) {
    setLoadingPost(true);

    try {
      const responseContent = await axios.post(api_address, {
        text: content,
      });

      console.log("content => " + responseContent.data.result);

      if (responseContent.data.result === "NEG") {
        data = { ...data, status: 0 };
      }
    } catch (error) {
      console.error(error);
    } finally {
      createData(data);
      setContent("");
      setLoadingPost(false);
      if (data.status === undefined) {
        alert("สร้างตอบกลับสำเร็จ");
      } else {
        alert("ตอบกลับของคุณต้องได้รับการตรวจสอบ");
      }
    }
  }
  // End of Text Sentiment

  // ดันข้อมูลคอมเมนท์
  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "reply_question"), postData);
      if (postData.status === undefined) {
        const docRef2 = doc(db, "cmnt_question", cmntID);
        updateDoc(docRef2, {
          reply: replyCount + 1,
        });
      }
      console.log("This Reply has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  const replySubmit = (event) => {
    const currentUserId = currentUser.uid;

    if (buttonStatus) {
    } else {
      event.preventDefault();
      const data = {
        post_id: postID,
        cmnt_id: cmntID,
        report: 0,
        content: content.replace(/\n/g, "<br>"),
        member_id: currentUserId,
        date: formattedDate,
        time: formattedTime,
      };
      SendDataToFlask(data);
    }
  };

  // ดึง reply_review
  useEffect(() => {
    const q = query(
      collection(db, "reply_question"),
      where("post_id", "==", postID) && where("cmnt_id", "==", cmntID)
    );

    try {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const replies = [];
        querySnapshot.forEach((doc) => {
          replies.push({ id: doc.id, ...doc.data() });
        });
        setReply(replies);
        console.log("Comment has been pulled");
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Sorting
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sortedData = [...reply].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA > dateB) {
        return -1; // sort dateA before dateB
      } else if (dateA < dateB) {
        return 1; // sort dateA after dateB
      } else {
        const timeA = new Date(`1970-01-01T${a.time}`);
        const timeB = new Date(`1970-01-01T${b.time}`);

        if (timeA > timeB) {
          return -1; // sort timeA before timeB
        } else if (timeA < timeB) {
          return 1; // sort timeA after timeB
        } else {
          return 0; // same date and time
        }
      }
    });

    // Group data by date
    const groupedData = {};
    sortedData.forEach((item) => {
      const date = item.date;
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    });

    // Sort each group by time ascending
    for (const date in groupedData) {
      groupedData[date] = groupedData[date].sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time}`);
        const timeB = new Date(`1970-01-01T${b.time}`);
        return timeA - timeB; // sort timeA before timeB for ascending order
      });
    }

    // Merge and flatten the groups
    const mergedData = Object.values(groupedData).flat();

    const reversedData = mergedData.reverse();

    setSortedData(reversedData);
  }, [reply]);
  // End of Sorting

  useEffect(() => {
    checkInfo();
  }, [content]);

  return (
    <div className="px-3">
      {sortedData ? (
        <div>
          {sortedData.map((item) => (
            <div key={item.id}>
              {item.status === undefined ? (
                <>
                  <hr />
                  <div className="flex-container comment pt-3">
                    <MemberInfo memberID={item.member_id} />

                    <div className="flex-1-right">
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
                            <img
                              className="menu-dropdown"
                              src={
                                require("../../images/question/three_dots.svg")
                                  .default
                              }
                              alt=""
                            />
                          </span>
                        </Dropdown.Toggle>
                        <Rep_Del_Reply_Click
                          cmnt_id={cmntID}
                          reply_count={replyCount}
                          reply_id={item.id}
                          rep_count={item.report}
                          member_id={item.member_id}
                        />
                      </Dropdown>
                    </div>
                  </div>

                  <div
                    className="pt-4"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />

                  <div
                    className="flex-container comment pt-2"
                    id="comment-reply"
                  >
                    <div className="pe-4">
                      <span className="post-date">
                        {formattedDate === item.date ? item.time : item.date}
                      </span>
                    </div>
                  </div>
                  <hr />
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div>data not available</div>
      )}
      {/* เขียนคอมเมนท์                           */}
      {currentUser ? (
        <form className="pt-3 pb-1" onSubmit={replySubmit}>
          <div className="flex-container comment" id="comment-2">
            <div
              className="box-reply-profile-image"
              style={{ marginRight: "1rem" }}
            >
              <div className="reply-profile-image">
                <img src={userData.profile} className="img-fluid" />
              </div>
            </div>

            <textarea
              className="form-control"
              id="content"
              placeholder="เขียนความคิดเห็น..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              rows={1}
            />

            <div className="flex-1-right">
              {loadingPost ? (
                <div className="px-4">
                  <div
                    className="spinner-border"
                    style={{ width: "1.8rem", height: "1.8rem" }}
                  />
                </div>
              ) : (
                <button
                  className="sent-comment px-3"
                  disabled={buttonStatus}
                  type="submit"
                >
                  <img
                    className="menu-pic pe-3"
                    src={require("../../images/question/sent_1.svg").default}
                    alt=""
                  />
                </button>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div></div>
      )}

      {/* เขียนคอมเมนท์                           */}
    </div>
  );
}

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

function Rep_Del_Comment_Click({
  postID,
  cmnt_count,
  cmnt_id,
  rep_count,
  member_id,
}) {
  const currentUser = auth.currentUser;

  const [authorCheck, setAuthorCheck] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      if (member_id === currentUserId) {
        setAuthorCheck(false);
      } else if (member_id !== currentUserId) {
        setAuthorCheck(true);
      }
    }
  }, []);

  const handleReportClick = () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะรายงานคอมเมนท์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "cmnt_question", cmnt_id);
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

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะลบคอมเมนท์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const postRef = doc(db, "question", postID);

      updateDoc(postRef, {
        comment: cmnt_count - 1,
      });

      const docRef = doc(db, "cmnt_question", cmnt_id);

      // Create a query to get all replies for the post
      const replyQuery = query(
        collection(db, "reply_question"),
        where("cmnt_id", "==", cmnt_id)
      );

      // Use Promise.all() to execute both queries in parallel
      const [replySnapshot] = await Promise.all([getDocs(replyQuery)]);

      // Delete the post document
      await deleteDoc(docRef);

      // Delete all reply documents
      replySnapshot.forEach(async (replyDoc) => {
        const replyDocRef = doc(db, "reply_review", replyDoc.id);
        await deleteDoc(replyDocRef);
      });

      console.log("Comments, and replies deleted successfully.");
      alert("ลบคอมเมนท์สำเร็จ");
    }
  };

  return (
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleReportClick}>รายงานคอมเมนท์</Dropdown.Item>
      {authorCheck ? (
        <div />
      ) : (
        <Dropdown.Item onClick={handleDeleteClick}>ลบคอมเมนท์</Dropdown.Item>
      )}
    </Dropdown.Menu>
  );
}

function Rep_Del_Reply_Click({
  cmnt_id,
  reply_count,
  reply_id,
  rep_count,
  member_id,
}) {
  const currentUser = auth.currentUser;

  const [authorCheck, setAuthorCheck] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const currentUserId = currentUser.uid;
      if (member_id === currentUserId) {
        setAuthorCheck(false);
      } else if (member_id !== currentUserId) {
        setAuthorCheck(true);
      }
    }
  }, []);

  const handleReportClick = () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะรายงานตอบกลับใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "reply_question", reply_id);
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

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะลบตอบกลับใช่หรือไม่ ?"
    );

    if (confirmed) {
      const cmntRef = doc(db, "cmnt_question", cmnt_id);

      updateDoc(cmntRef, {
        reply: reply_count - 1,
      });

      const docRef = doc(db, "reply_question", reply_id);

      // Delete the post document
      await deleteDoc(docRef);

      console.log("Replies deleted successfully.");
      alert("ลบตอบกลับสำเร็จ");
    }
  };

  return (
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleReportClick}>รายงานตอบกลับ</Dropdown.Item>
      {authorCheck ? (
        <div />
      ) : (
        <Dropdown.Item onClick={handleDeleteClick}>ลบตอบกลับ</Dropdown.Item>
      )}
    </Dropdown.Menu>
  );
}

export default Answer;
