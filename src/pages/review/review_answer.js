import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../../styles/review.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { api_address, auth, db, storage } from "../../config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
              placeholder="เช่น GEN123 หรือ วิชานี้ดี"
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
              โพสต์
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
const Answer = ({ userData }) => {
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

  const { id } = useParams();
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

  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

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
      const docRef = await addDoc(collection(db, "cmnt_review"), postData);
      if (postData.status === undefined) {
        const docRef2 = doc(db, "review", id);
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
    if (buttonStatus) {
    } else {
      event.preventDefault();
      const data = {
        post_id: id,
        like: 0,
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
    const reviewRef = collection(db, "review");
    const docRef = doc(reviewRef, id);

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
    const q = query(collection(db, "cmnt_review"), where("post_id", "==", id));

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
                    <MemberHost
                      memberID={post.member_id}
                      time={post.time}
                      date={post.date}
                    />
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
                      <Rep_Del_Click
                        postID={id}
                        rep_users={post.rep_users}
                        rep_count={post.report}
                        tagName={post.tag}
                        member_id={post.member_id}
                      />
                    </Dropdown>
                  </div>

                  <div className="pt-2 homeHeader2">{post.header}</div>

                  <div>
                    <Button className="hit-header">{post.tag}</Button>
                  </div>

                  <div
                    style={{
                      paddingTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: post.picture === undefined ? null : "400px",
                    }}
                  >
                    <img
                      src={post.picture}
                      className="img-fluid"
                      style={{ height: "100%" }}
                    />
                  </div>

                  <p
                    className="pt-3 text"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></p>

                  <div className="flex-container comment">
                    <div className="flex-1-comment">
                      <img
                        className="menu-pic"
                        src={
                          require("../../images/question/chat_1.svg").default
                        }
                        alt=""
                        style={{ paddingRight: "0.3rem" }}
                      />
                      <text id="comment-count" style={{ paddingRight: "1rem" }}>
                        {post.comment}
                      </text>
                      <LikeCheck
                        postID={id}
                        users={post.users}
                        like_count={post.like}
                      />
                    </div>

                    <div className="flex-2-comment"></div>
                  </div>
                </div>

                {/* เขียนคอมเมนท์                           */}
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
                {/* เขียนคอมเมนท์                           */}

                {/* ดึง map comment                           */}
                <div>
                  {sortedData ? (
                    <div>
                      {sortedData.map((item) => (
                        <div className="post-border" key={item.id}>
                          {item.status === undefined ? (
                            <>
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
                                      rep_users={item.rep_users}
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

                                <div className="flex-1-right px-4">
                                  <LikeCommentCheck
                                    postID={item.id}
                                    users={item.users}
                                    like_count={item.like}
                                  />
                                </div>
                              </div>

                              {visibility[item.id] && (
                                <div className="container">
                                  <hr />
                                  <ReplyLoad
                                    userData={userData}
                                    postID={id}
                                    cmntID={item.id}
                                    replyCount={item.reply}
                                  />
                                </div>
                              )}
                            </>
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

function MemberHost({ memberID, time, date }) {
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
            <div className="profile-image-host">
              <img
                src={memberData.profile}
                alt="main page png"
                className="img-fluid"
              />
            </div>
          </div>
          <div>
            <div
              className="box"
              style={{
                display: "flex",
              }}
            >
              {memberData.fname} {memberData.lname}
            </div>
            <div
              className="box"
              style={{
                display: "flex",
              }}
            >
              <span className="post-date">
                {formattedDate === date ? time : date}
              </span>
            </div>
          </div>

          <div style={{ paddingLeft: "1rem" }}></div>
        </div>
      )}
    </div>
  );
}

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
        <Link to={`/review/tag/${doc.id}`}>
          <Button className="hit-tag">{doc.id}</Button>
        </Link>
      ))}
    </div>
  );
}

function ReplyLoad({ userData, postID, cmntID, replyCount }) {
  const [content, setContent] = useState("");
  const [reply, setReply] = useState([]);
  const [buttonStatus, setButtonStatus] = useState(true);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

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
      const docRef = await addDoc(collection(db, "reply_review"), postData);
      if (postData.status === undefined) {
        const docRef2 = doc(db, "cmnt_review", cmntID);
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
    if (buttonStatus) {
    } else {
      event.preventDefault();
      const data = {
        post_id: postID,
        cmnt_id: cmntID,
        like: 0,
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
      collection(db, "reply_review"),
      where("post_id", "==", postID) && where("cmnt_id", "==", cmntID)
    );

    try {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const replies = [];
        querySnapshot.forEach((doc) => {
          replies.push({ id: doc.id, ...doc.data() });
        });
        setReply(replies);
        console.log("Reply has been pulled");
        console.log(cmntID);
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
                          rep_users={item.rep_users}
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

                    <div className="flex-1-right px-4">
                      <LikeReplyCheck
                        postID={item.id}
                        users={item.users}
                        like_count={item.like}
                      />
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

function Rep_Del_Click({ postID, rep_users, rep_count, tagName, member_id }) {
  const navigate = useNavigate();

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
      try {
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
      } catch (error) {
        console.log(error);
      } finally {
        console.log("Post, comments, and replies deleted successfully.");
        alert("ลบโพสต์สำเร็จ");
        navigate("/");
      }
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

function Rep_Del_Comment_Click({
  postID,
  cmnt_count,
  cmnt_id,
  rep_users,
  rep_count,
  member_id,
}) {
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
      "คุณยืนยันที่ต้องการจะรายงานคอมเมนท์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "cmnt_review", cmnt_id);
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
        alert("คุณได้รายงานคอมเมนท์ไปแล้ว");
      }
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะลบคอมเมนท์ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const postRef = doc(db, "review", postID);

      updateDoc(postRef, {
        comment: cmnt_count - 1,
      });

      const docRef = doc(db, "cmnt_review", cmnt_id);

      // Create a query to get all replies for the post
      const replyQuery = query(
        collection(db, "reply_review"),
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
  rep_users,
  rep_count,
  member_id,
}) {
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
      "คุณยืนยันที่ต้องการจะรายงานตอบกลับใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "reply_review", reply_id);
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
        alert("คุณได้รายงานตอบกลับไปแล้ว");
      }
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะลบตอบกลับใช่หรือไม่ ?"
    );

    if (confirmed) {
      const cmntRef = doc(db, "cmnt_review", cmnt_id);

      updateDoc(cmntRef, {
        reply: reply_count - 1,
      });

      const docRef = doc(db, "reply_review", reply_id);

      // Delete the post document
      await deleteDoc(docRef);

      console.log("Replies deleted successfully.");
      alert("ลบตอบกลับสำเร็จ");
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

  const handleLikeClick = () => {
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
      <span style={{ paddingRight: "1rem" }}>{like_count}</span>
    </span>
  );
}

function LikeCommentCheck({ postID, users, like_count }) {
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

  const handleLikeClick = () => {
    const docRef = doc(db, "cmnt_review", postID);
    if (likedByCurrentUser === false) {
      updateDoc(docRef, {
        users: arrayUnion(currentUserId),
        like: like_count + 1,
      })
        .then(() => {
          console.log("You Like the comment!");
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
          console.log("You Unike the comment!");
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
      <span style={{ paddingRight: "1rem" }}>{like_count}</span>
    </span>
  );
}

function LikeReplyCheck({ postID, users, like_count }) {
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

  const handleLikeClick = () => {
    const docRef = doc(db, "reply_review", postID);
    if (likedByCurrentUser === false) {
      updateDoc(docRef, {
        users: arrayUnion(currentUserId),
        like: like_count + 1,
      })
        .then(() => {
          console.log("You Like the comment!");
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
          console.log("You Unike the comment!");
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
      <span style={{ paddingRight: "1rem" }}>{like_count}</span>
    </span>
  );
}

export default Answer;
