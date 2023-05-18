import React, { useEffect, useState } from "react";
import "../../styles/review.css";
import { Tabs, Tab, Dropdown, Modal, Button } from "react-bootstrap";
import { api_address, auth, db, storage } from "../../config";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  orderBy,
  where,
  deleteDoc,
  getDocs,
  setDoc,
  limit,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Rmodal() {
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  const [currentUserId, setCurrentUserId] = useState(null);

  const timestamp = Date.now();

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
    setSelectedOption("เลือก");
    setFile(null);
  }

  const finishClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedOption, setSelectedOption] = useState("เลือก");

  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);

  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const [buttonStatus, setButtonStatus] = useState(true);

  useEffect(() => {
    try {
      setCurrentUserId(currentUser.uid);
    } catch (e) {
      navigate("/review");
    }
    checkInfo();
  }, [selectedOption]);

  // Text Sentiment
  const [loadingPost, setLoadingPost] = useState(false);

  async function SendDataToFlask(data, tag) {
    setLoadingPost(true);
    try {
      const responseHeader = await axios.post(api_address, {
        text: header,
      });

      const responseContent = await axios.post(api_address, {
        text: content,
      });

      console.log("name => " + responseHeader.data.result);
      console.log("content => " + responseContent.data.result);

      if (
        responseHeader.data.result === "NEG" ||
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
      await createData(data, tag);
      setLoadingPost(false);
      if (data.status === undefined) {
        alert("สร้างโพสต์สำเร็จ");
      } else {
        alert("โพสต์ของคุณต้องได้รับการตรวจสอบ");
      }
    }
  }
  // End of Text Sentiment

  async function createData(postData, tagName) {
    try {
      const docRef = await addDoc(collection(db, "review"), postData);
      const tagDocRef = doc(db, "tag_ranked", tagName);
      if (postData.status === undefined) {
        getDoc(tagDocRef).then((docSnap) => {
          if (docSnap.exists()) {
            const tagCount = docSnap.data().count;
            updateDoc(tagDocRef, {
              count: tagCount + 1,
            })
              .then(() => {
                console.log("Document updated with new count value");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          } else {
            const reviewsCollectionRef = collection(db, "tag_ranked");
            const newReviewDocRef = doc(reviewsCollectionRef, tagName);

            const newReview = {
              count: 1,
            };

            setDoc(newReviewDocRef, newReview)
              .then(() => {
                console.log("Document written with ID: ", newReviewDocRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          }
        });
      }

      console.log("This Post has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    } finally {
      setHeader("");
      setContent("");
      setTag("");
    }
  }

  function checkInfo() {
    const trimmedHeader = header.trim();
    const trimmedContent = content.trim();
    const trimmedTag = tag.trim();

    const hasValidLength =
      trimmedHeader.length >= 6 &&
      trimmedContent.length >= 8 &&
      trimmedTag.length > 0 &&
      selectedOption !== "เลือก";

    setButtonStatus(!hasValidLength);
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    setFile(file);
  }

  const handleSubmit = (event) => {
    if (selectedOption === "เลือก") {
    } else {
      event.preventDefault();
      if (file === null) {
        let data = {
          like: 0,
          report: 0,
          comment: 0,
          header: header,
          content: content.replace(/\n/g, "<br>"),
          tag: tag,
          type: selectedOption,
          member_id: currentUserId,
          date: formattedDate,
          time: formattedTime,
        };
        SendDataToFlask(data, tag);
      } else {
        const storageRef = ref(
          storage,
          currentUserId + "-" + timestamp + "-" + file.name
        );

        uploadBytes(storageRef, file).then(() => {
          console.log("File uploaded successfully");
          getDownloadURL(storageRef).then((url) => {
            console.log("Download URL:", url);
            let data = {
              like: 0,
              report: 0,
              comment: 0,
              header: header,
              content: content.replace(/\n/g, "<br>"),
              tag: tag,
              type: selectedOption,
              member_id: currentUserId,
              date: formattedDate,
              time: formattedTime,
              picture: url,
            };
            SendDataToFlask(data, tag);
          });
        });
      }
    }
    setSelectedOption("เลือก");
    setFile(null);
  };

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
          เริ่มต้นการเขียนโพสต์
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

          <div className="modal-body question-modal-body px-4">
            <text className="modal-topic ">
              หมวดหมู่ <span style={{ color: "red", fontSize: "12px" }}>*</span>
            </text>
            <div className="form-control mt-2 mb-3">
              <Dropdown>
                <Dropdown.Toggle
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    borderColor: "transparent",
                    width: "100%",
                  }}
                  id="dropdown-basic"
                >
                  {selectedOption}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%", textAlign: "center" }}>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedOption("วิชาเรียน");
                      checkInfo();
                    }}
                  >
                    วิชาเรียน
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedOption("อาจารย์");
                      checkInfo();
                    }}
                  >
                    อาจารย์
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedOption("ร้านอาหาร");
                      checkInfo();
                    }}
                  >
                    ร้านอาหาร
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedOption("หอพัก");
                      checkInfo();
                    }}
                  >
                    หอพัก
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedOption("สถานที่ฝึกงาน");
                      checkInfo();
                    }}
                  >
                    สถานที่ฝึกงาน
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <text className="modal-topic ">
              เนื้อหาโพสต์
              <span style={{ color: "red", fontSize: "12px" }}> *</span>
            </text>
            <input
              type="text"
              className="form-control mt-2 mb-3"
              id="header"
              placeholder="เขียนหัวข้อเรื่อง เพื่อให้โพสต์น่าสนใจมากขึ้น..."
              onChange={(e) => {
                setHeader(e.target.value);
                checkInfo();
              }}
            />

            <textarea
              class="form-control mt-2 mb-3 question-modal-input"
              id="content"
              placeholder="เขียนคำบรรยายเพิ่มเติม..."
              rows="6"
              onChange={(e) => {
                setContent(e.target.value);
                checkInfo();
              }}
            />

            <text className="modal-topic">รูปภาพประกอบ :</text>
            <input
              type="file"
              className="form-control mt-2 mb-3"
              id="picture"
              placeholder="ไฟล์รูปภาพสกุล JPG, PNG"
              onChange={handleUpload}
            />

            <text className="modal-topic">
              แฮชแท็ก<span style={{ color: "red", fontSize: "12px" }}> *</span>
            </text>
            <input
              type="text"
              className="form-control mt-2"
              id="tag"
              placeholder="#แฮชแท็ก"
              onChange={(e) => {
                setTag(e.target.value);
                checkInfo();
              }}
            />
          </div>

          <div className="modal-footer question-modal-footer flex-center pt-1 pb-4">
            <button
              type="submit"
              disabled={buttonStatus}
              className="btn post-question-btn mx-auto mt-0 "
              onClick={finishClose}
            >
              เริ่มต้นการเขียนโพสต์
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

const Review = () => {
  const navigate = useNavigate();

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
        window.location.href = "/review/search/" + searchQuery;
      }
    }
  }
  //-----------

  //Sorting
  const [selectedOption, setSelectedOption] = useState("ล่าสุด");

  const handleOptionSelect = (optionName) => {
    setSelectedOption(optionName);
  };
  //-----------

  // pull post
  const [all, setAll] = useState([]);
  const [subject, setSubject] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [dorm, setDorm] = useState([]);
  const [work, setWork] = useState([]);

  useEffect(() => {
    const itemsCollection = collection(db, "review");

    let sortedCollection = itemsCollection;

    if (selectedOption === "ยอดนิยม") {
      sortedCollection = query(itemsCollection, orderBy("like", "desc"));
    } else {
      sortedCollection = query(
        itemsCollection,
        orderBy("date", "desc"),
        orderBy("time", "desc")
      );
    }

    try {
      const unsubscribe = onSnapshot(sortedCollection, (querySnapshot) => {
        const itemsList = [];
        const subject_array = [];
        const teacher_array = [];
        const restaurant_array = [];
        const dorm_array = [];
        const work_array = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
          if (item.type === "วิชาเรียน") {
            subject_array.push(item);
          } else if (item.type === "อาจารย์") {
            teacher_array.push(item);
          } else if (item.type === "ร้านอาหาร") {
            restaurant_array.push(item);
          } else if (item.type === "หอพัก") {
            dorm_array.push(item);
          } else if (item.type === "สถานที่ฝึกงาน") {
            work_array.push(item);
          }
          console.log("Succesfully Loading Post");
        });
        setAll(itemsList);
        setSubject(subject_array);
        setTeacher(teacher_array);
        setRestaurant(restaurant_array);
        setDorm(dorm_array);
        setWork(work_array);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, [selectedOption]);
  // pull post

  const handlePropagation = (event) => {
    event.stopPropagation();
  };

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
                    title="ล่าสุด"
                  >
                    <div>
                      {all ? (
                        <div>
                          {all.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div
                                  onClick={() =>
                                    navigate("/review/post/" + item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  <div className="row flex-wrap">
                                    <div className="col-sm-9">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <MemberInfo
                                          memberID={item.member_id}
                                          time={item.time}
                                          date={item.date}
                                        />
                                        <Dropdown
                                          onClick={handlePropagation}
                                          drop="down"
                                        >
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
                                          <Rep_Del_Click
                                            postID={item.id}
                                            rep_users={item.rep_users}
                                            rep_count={item.report}
                                            tagName={item.tag}
                                            member_id={item.member_id}
                                          />
                                        </Dropdown>
                                      </div>
                                      <div>
                                        <div className="homeHeader2">
                                          {item.header}
                                        </div>
                                        <div
                                          className="text-limit body"
                                          dangerouslySetInnerHTML={{
                                            __html: item.content,
                                          }}
                                        ></div>
                                        <div
                                          className="row"
                                          style={{
                                            paddingTop: "1rem",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="col"
                                            onClick={handlePropagation}
                                          >
                                            <a href={`/review/tag/${item.tag}`}>
                                              <Button className="hit-tag">
                                                {item.tag}
                                              </Button>
                                            </a>
                                          </div>

                                          <div className="col">
                                            <div className="row float-end pt-2 cmnt-like">
                                              <div className="col">
                                                <Link
                                                  to={"/review/post/" + item.id}
                                                  style={{
                                                    paddingRight: "0.5rem",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      require("../../images/icon/chat.svg")
                                                        .default
                                                    }
                                                    alt="chat svg"
                                                  />
                                                </Link>
                                                <span>{item.comment}</span>
                                              </div>
                                              <div className="col">
                                                <LikeCheck
                                                  postID={item.id}
                                                  users={item.users}
                                                  like_count={item.like}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="col-sm-3 pt-3"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the image
                                        alignItems: "center", // Vertically center the image
                                      }}
                                    >
                                      {item.picture === undefined ? null : (
                                        <img
                                          src={item.picture}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div style={{ paddingTop: "1rem" }}>
                                      <hr />
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

                  <Tab className="pt-4" eventKey="subject" title="วิชาเรียน">
                    <div>
                      {subject ? (
                        <div>
                          {subject.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div
                                  onClick={() =>
                                    navigate("/review/post/" + item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  <div className="row flex-wrap">
                                    <div className="col-sm-9">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <MemberInfo
                                          memberID={item.member_id}
                                          time={item.time}
                                          date={item.date}
                                        />
                                        <Dropdown
                                          drop="down"
                                          onClick={handlePropagation}
                                        >
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
                                          <Rep_Del_Click
                                            postID={item.id}
                                            rep_users={item.rep_users}
                                            rep_count={item.report}
                                            tagName={item.tag}
                                            member_id={item.member_id}
                                          />
                                        </Dropdown>
                                      </div>
                                      <div>
                                        <div className="homeHeader2">
                                          {item.header}
                                        </div>
                                        <div
                                          className="text-limit body"
                                          dangerouslySetInnerHTML={{
                                            __html: item.content,
                                          }}
                                        ></div>
                                        <div
                                          className="row"
                                          style={{
                                            paddingTop: "1rem",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="col"
                                            onClick={handlePropagation}
                                          >
                                            <a href={`/review/tag/${item.tag}`}>
                                              <Button className="hit-tag">
                                                {item.tag}
                                              </Button>
                                            </a>
                                          </div>

                                          <div className="col">
                                            <div className="row float-end pt-2 cmnt-like">
                                              <div className="col">
                                                <Link
                                                  to={"/review/post/" + item.id}
                                                  style={{
                                                    paddingRight: "0.5rem",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      require("../../images/icon/chat.svg")
                                                        .default
                                                    }
                                                    alt="chat svg"
                                                  />
                                                </Link>
                                                <span>{item.comment}</span>
                                              </div>
                                              <div className="col">
                                                <LikeCheck
                                                  postID={item.id}
                                                  users={item.users}
                                                  like_count={item.like}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="col-sm-3 pt-3"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the image
                                        alignItems: "center", // Vertically center the image
                                      }}
                                    >
                                      {item.picture === undefined ? null : (
                                        <img
                                          src={item.picture}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div style={{ paddingTop: "1rem" }}>
                                      <hr />
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

                  <Tab className="pt-4" eventKey="teacher" title="อาจารย์">
                    <div>
                      {teacher ? (
                        <div>
                          {teacher.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div
                                  onClick={() =>
                                    navigate("/review/post/" + item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  <div className="row flex-wrap">
                                    <div className="col-sm-9">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <MemberInfo
                                          memberID={item.member_id}
                                          time={item.time}
                                          date={item.date}
                                        />
                                        <Dropdown
                                          drop="down"
                                          onClick={handlePropagation}
                                        >
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
                                          <Rep_Del_Click
                                            postID={item.id}
                                            rep_users={item.rep_users}
                                            rep_count={item.report}
                                            tagName={item.tag}
                                            member_id={item.member_id}
                                          />
                                        </Dropdown>
                                      </div>
                                      <div>
                                        <div className="homeHeader2">
                                          {item.header}
                                        </div>
                                        <div
                                          className="text-limit body"
                                          dangerouslySetInnerHTML={{
                                            __html: item.content,
                                          }}
                                        ></div>
                                        <div
                                          className="row"
                                          style={{
                                            paddingTop: "1rem",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="col"
                                            onClick={handlePropagation}
                                          >
                                            <a href={`/review/tag/${item.tag}`}>
                                              <Button className="hit-tag">
                                                {item.tag}
                                              </Button>
                                            </a>
                                          </div>

                                          <div className="col">
                                            <div className="row float-end pt-2 cmnt-like">
                                              <div className="col">
                                                <Link
                                                  to={"/review/post/" + item.id}
                                                  style={{
                                                    paddingRight: "0.5rem",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      require("../../images/icon/chat.svg")
                                                        .default
                                                    }
                                                    alt="chat svg"
                                                  />
                                                </Link>
                                                <span>{item.comment}</span>
                                              </div>
                                              <div className="col">
                                                <LikeCheck
                                                  postID={item.id}
                                                  users={item.users}
                                                  like_count={item.like}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="col-sm-3 pt-3"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the image
                                        alignItems: "center", // Vertically center the image
                                      }}
                                    >
                                      {item.picture === undefined ? null : (
                                        <img
                                          src={item.picture}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div style={{ paddingTop: "1rem" }}>
                                      <hr />
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

                  <Tab className="pt-4" eventKey="restaurant" title="ร้านอาหาร">
                    <div>
                      {restaurant ? (
                        <div>
                          {restaurant.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div
                                  onClick={() =>
                                    navigate("/review/post/" + item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  <div className="row flex-wrap">
                                    <div className="col-sm-9">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <MemberInfo
                                          memberID={item.member_id}
                                          time={item.time}
                                          date={item.date}
                                        />
                                        <Dropdown
                                          drop="down"
                                          onClick={handlePropagation}
                                        >
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
                                          <Rep_Del_Click
                                            postID={item.id}
                                            rep_users={item.rep_users}
                                            rep_count={item.report}
                                            tagName={item.tag}
                                            member_id={item.member_id}
                                          />
                                        </Dropdown>
                                      </div>
                                      <div>
                                        <div className="homeHeader2">
                                          {item.header}
                                        </div>
                                        <div
                                          className="text-limit body"
                                          dangerouslySetInnerHTML={{
                                            __html: item.content,
                                          }}
                                        ></div>
                                        <div
                                          className="row"
                                          style={{
                                            paddingTop: "1rem",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="col"
                                            onClick={handlePropagation}
                                          >
                                            <a href={`/review/tag/${item.tag}`}>
                                              <Button className="hit-tag">
                                                {item.tag}
                                              </Button>
                                            </a>
                                          </div>

                                          <div className="col">
                                            <div className="row float-end pt-2 cmnt-like">
                                              <div className="col">
                                                <Link
                                                  to={"/review/post/" + item.id}
                                                  style={{
                                                    paddingRight: "0.5rem",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      require("../../images/icon/chat.svg")
                                                        .default
                                                    }
                                                    alt="chat svg"
                                                  />
                                                </Link>
                                                <span>{item.comment}</span>
                                              </div>
                                              <div className="col">
                                                <LikeCheck
                                                  postID={item.id}
                                                  users={item.users}
                                                  like_count={item.like}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="col-sm-3 pt-3"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the image
                                        alignItems: "center", // Vertically center the image
                                      }}
                                    >
                                      {item.picture === undefined ? null : (
                                        <img
                                          src={item.picture}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div style={{ paddingTop: "1rem" }}>
                                      <hr />
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

                  <Tab className="pt-4" eventKey="dorm" title="หอพัก">
                    <div>
                      {dorm ? (
                        <div>
                          {dorm.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div
                                  onClick={() =>
                                    navigate("/review/post/" + item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  <div className="row flex-wrap">
                                    <div className="col-sm-9">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <MemberInfo
                                          memberID={item.member_id}
                                          time={item.time}
                                          date={item.date}
                                        />
                                        <Dropdown
                                          drop="down"
                                          onClick={handlePropagation}
                                        >
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
                                          <Rep_Del_Click
                                            postID={item.id}
                                            rep_users={item.rep_users}
                                            rep_count={item.report}
                                            tagName={item.tag}
                                            member_id={item.member_id}
                                          />
                                        </Dropdown>
                                      </div>
                                      <div>
                                        <div className="homeHeader2">
                                          {item.header}
                                        </div>
                                        <div
                                          className="text-limit body"
                                          dangerouslySetInnerHTML={{
                                            __html: item.content,
                                          }}
                                        ></div>
                                        <div
                                          className="row"
                                          style={{
                                            paddingTop: "1rem",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="col"
                                            onClick={handlePropagation}
                                          >
                                            <a href={`/review/tag/${item.tag}`}>
                                              <Button className="hit-tag">
                                                {item.tag}
                                              </Button>
                                            </a>
                                          </div>

                                          <div className="col">
                                            <div className="row float-end pt-2 cmnt-like">
                                              <div className="col">
                                                <Link
                                                  to={"/review/post/" + item.id}
                                                  style={{
                                                    paddingRight: "0.5rem",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      require("../../images/icon/chat.svg")
                                                        .default
                                                    }
                                                    alt="chat svg"
                                                  />
                                                </Link>
                                                <span>{item.comment}</span>
                                              </div>
                                              <div className="col">
                                                <LikeCheck
                                                  postID={item.id}
                                                  users={item.users}
                                                  like_count={item.like}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="col-sm-3 pt-3"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the image
                                        alignItems: "center", // Vertically center the image
                                      }}
                                    >
                                      {item.picture === undefined ? null : (
                                        <img
                                          src={item.picture}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div style={{ paddingTop: "1rem" }}>
                                      <hr />
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

                  <Tab className="pt-4" eventKey="work" title="สถานที่ฝึกงาน">
                    <div>
                      {work ? (
                        <div>
                          {work.map((item) => (
                            <div key={item.id}>
                              {item.status === undefined ? (
                                <div
                                  onClick={() =>
                                    navigate("/review/post/" + item.id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  <div className="row flex-wrap">
                                    <div className="col-sm-9">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <MemberInfo
                                          memberID={item.member_id}
                                          time={item.time}
                                          date={item.date}
                                        />
                                        <Dropdown
                                          drop="down"
                                          onClick={handlePropagation}
                                        >
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
                                          <Rep_Del_Click
                                            postID={item.id}
                                            rep_users={item.rep_users}
                                            rep_count={item.report}
                                            tagName={item.tag}
                                            member_id={item.member_id}
                                          />
                                        </Dropdown>
                                      </div>
                                      <div>
                                        <div className="homeHeader2">
                                          {item.header}
                                        </div>
                                        <div
                                          className="text-limit body"
                                          dangerouslySetInnerHTML={{
                                            __html: item.content,
                                          }}
                                        ></div>
                                        <div
                                          className="row"
                                          style={{
                                            paddingTop: "1rem",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="col"
                                            onClick={handlePropagation}
                                          >
                                            <a href={`/review/tag/${item.tag}`}>
                                              <Button className="hit-tag">
                                                {item.tag}
                                              </Button>
                                            </a>
                                          </div>

                                          <div className="col">
                                            <div className="row float-end pt-2 cmnt-like">
                                              <div className="col">
                                                <Link
                                                  to={"/review/post/" + item.id}
                                                  style={{
                                                    paddingRight: "0.5rem",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      require("../../images/icon/chat.svg")
                                                        .default
                                                    }
                                                    alt="chat svg"
                                                  />
                                                </Link>
                                                <span>{item.comment}</span>
                                              </div>
                                              <div className="col">
                                                <LikeCheck
                                                  postID={item.id}
                                                  users={item.users}
                                                  like_count={item.like}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="col-sm-3 pt-3"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center", // Horizontally center the image
                                        alignItems: "center", // Vertically center the image
                                      }}
                                    >
                                      {item.picture === undefined ? null : (
                                        <img
                                          src={item.picture}
                                          style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div style={{ paddingTop: "1rem" }}>
                                      <hr />
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
                        onClick={() => handleOptionSelect("ล่าสุด")}
                      >
                        ล่าสุด
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
              <Rmodal />
              <div className="searchBar">
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
              <div>
                <div className="mt-4 pt-4 hit-title mb-2">
                  <span className="">เป็นที่นิยมใน Mod's Talk</span>
                </div>

                <PopularTag />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MemberInfo({ memberID, time, date }) {
  const [memberData, setMemberData] = useState(null);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

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
            <span style={{ paddingLeft: "1rem" }}>
              {formattedDate === date ? time : date}
            </span>
          </div>

          <div style={{ paddingLeft: "1rem" }}></div>
        </div>
      )}
    </div>
  );
}

function PopularTag({}) {
  const [data, setData] = useState([]); // initialize state variable for data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(db, "tag_ranked"); // create a reference to the "tag_ranked" collection

        const q = query(docRef, orderBy("count", "desc"), limit(10)); // create a query that sorts by "count" field in ascending order and limits to 5 documents

        const snapshot = await getDocs(q); // execute the query and get the snapshot of results

        const documentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // map through each document and extract its data and ID

        setData(documentsData); // set the state variable to the retrieved data
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-5">
      {data.map((doc) => (
        <a href={`/review/tag/${doc.id}`}>
          <Button className="hit-tag">{doc.id}</Button>
        </a>
      ))}
    </div>
  );
}

function Rep_Del_Click({ postID, rep_users, rep_count, tagName, member_id }) {
  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const [authorCheck, setAuthorCheck] = useState(false);
  const [reportedByCurrentUser, setReportedByCurrentUser] = useState(false);

  useEffect(() => {
    try {
      if (rep_users.includes(currentUserId)) {
        setReportedByCurrentUser(true);
      } else {
        setReportedByCurrentUser(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [rep_users, reportedByCurrentUser]);

  useEffect(() => {
    if (member_id === currentUserId) {
      setAuthorCheck(false);
    } else if (member_id !== currentUserId) {
      setAuthorCheck(true);
    }
  }, []);

  const handleReportClick = () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะรายงานโพสต์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "review", postID);
      if (reportedByCurrentUser === false) {
        updateDoc(docRef, {
          rep_users: arrayUnion(currentUserId),
          report: rep_count + 1,
        })
          .then(() => {
            console.log("You Report the post!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        alert("ขอบคุณที่แจ้งรายงาน ทางแอดมินจะพยายามตรวจสอบให้เร็วที่สุด");
      } else if (reportedByCurrentUser === true) {
        alert("คุณได้รายงานโพสต์ไปแล้ว");
      }
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะลบโพสต์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      // Create a reference to the post document
      const docRef = doc(db, "review", postID);

      // Delete the post document
      await deleteDoc(docRef);

      // Create a query to get all comments for the post
      const commentQuery = query(
        collection(db, "cmnt_review"),
        where("post_id", "==", postID)
      );

      // Create a query to get all replies for the post
      const replyQuery = query(
        collection(db, "reply_review"),
        where("post_id", "==", postID)
      );

      // Use Promise.all() to execute both queries in parallel
      const [commentSnapshot, replySnapshot] = await Promise.all([
        getDocs(commentQuery),
        getDocs(replyQuery),
      ]);

      // Delete all comment documents
      commentSnapshot.forEach(async (commentDoc) => {
        const commentDocRef = doc(db, "cmnt_review", commentDoc.id);
        await deleteDoc(commentDocRef);
      });

      // Delete all reply documents
      replySnapshot.forEach(async (replyDoc) => {
        const replyDocRef = doc(db, "reply_review", replyDoc.id);
        await deleteDoc(replyDocRef);
      });

      // Clear Tag
      const tagDocRef = doc(db, "tag_ranked", tagName);
      getDoc(tagDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const tagCount = docSnap.data().count;
          if (tagCount - 1 === 0) {
            deleteDoc(tagDocRef);
          } else {
            updateDoc(tagDocRef, {
              count: tagCount - 1,
            })
              .then(() => {
                console.log("Document updated with new count value");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
          }
        }
      });

      console.log("Post, comments, and replies deleted successfully.");
      alert("ลบโพสต์สำเร็จ");
    }
  };

  return (
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleReportClick}>รายงานโพสต์</Dropdown.Item>
      {authorCheck ? (
        <div />
      ) : (
        <Dropdown.Item onClick={handleDeleteClick}>ลบโพสต์</Dropdown.Item>
      )}
    </Dropdown.Menu>
  );
}

function LikeCheck({ postID, users, like_count }) {
  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [likeURL, setLikeURL] = useState(
    require("../../images/icon/like.svg").default
  );

  useEffect(() => {
    try {
      if (users.includes(currentUserId)) {
        setLikedByCurrentUser(true);
      } else {
        setLikedByCurrentUser(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  const handleLikeClick = (event) => {
    event.stopPropagation();
    const docRef = doc(db, "review", postID);
    if (likedByCurrentUser === false) {
      updateDoc(docRef, {
        users: arrayUnion(currentUserId),
        like: like_count + 1,
      })
        .then(() => {
          console.log("You Like the post!");
          setLikedByCurrentUser(true);
          setLikeURL(require("../../images/icon/red_like.svg").default);
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else if (likedByCurrentUser === true) {
      updateDoc(docRef, {
        users: arrayRemove(currentUserId),
        like: like_count - 1,
      })
        .then(() => {
          console.log("You Unike the post!");
          setLikedByCurrentUser(false);
          setLikeURL(require("../../images/icon/like.svg").default);
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  useEffect(() => {
    if (likedByCurrentUser === false) {
      setLikeURL(require("../../images/icon/like.svg").default);
    } else {
      setLikeURL(require("../../images/icon/red_like.svg").default);
    }
  }, [likedByCurrentUser]);

  return (
    <span>
      <span style={{ paddingRight: "0.5rem" }}>
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
          }}
          onClick={handleLikeClick}
        >
          <img src={likeURL} alt="like svg" style={{ fill: "transparent" }} />
        </button>
      </span>
      <span
      // style={{ paddingRight: "1rem" }}
      >
        {like_count}
      </span>
    </span>
  );
}

export default Review;
