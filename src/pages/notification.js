import React, { useEffect, useState } from "react";
import "../styles/notification.css";
import { Tabs, Tab, Dropdown, Modal } from "react-bootstrap";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Rmodal() {
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  const [currentUserId, setCurrentUserId] = useState(null);

  const timestamp = Date.now();

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

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
      navigate("/");
    }
    checkInfo();
  }, [selectedOption]);

  async function createData(postData, tagName) {
    try {
      const docRef = await addDoc(collection(db, "review"), postData);
      const tagDocRef = doc(db, "tag_ranked", tagName);
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

      console.log("This Post has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  function checkInfo() {
    if (
      header === "" ||
      content === "" ||
      selectedOption === "เลือก" ||
      tag === ""
    ) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
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
        const data = {
          like: 0,
          report: 0,
          comment: 0,
          header: header,
          content: content,
          tag: tag,
          type: selectedOption,
          member_id: currentUserId,
          date: formattedDate,
          time: formattedTime,
          picture:
            "https://cdn.discordapp.com/attachments/718002735475064874/1091698626033619094/no-camera.png",
        };
        createData(data, tag);
      } else {
        const storageRef = ref(
          storage,
          currentUserId + "-" + timestamp + "-" + file.name
        );

        uploadBytes(storageRef, file).then(() => {
          console.log("File uploaded successfully");
          getDownloadURL(storageRef).then((url) => {
            console.log("Download URL:", url);
            const data = {
              like: 0,
              report: 0,
              comment: 0,
              header: header,
              content: content,
              tag: tag,
              type: selectedOption,
              member_id: currentUserId,
              date: formattedDate,
              time: formattedTime,
              picture: url,
            };
            createData(data, tag);
          });
        });
      }
    }
    setSelectedOption("เลือก");
    setFile(null);
  };

  return (
    <>
      <button
        type="button"
        className="button"
        onClick={handleShow}
        style={{ width: "100%" }}
      >
        เริ่มต้นการเขียนโพสต์
      </button>

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

          <div className="modal-body question-modal-body px-4 pt-2">
            <text className="modal-topic ">เนื้อหาโพสต์</text>
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

            <text className="modal-topic">แฮชแท็ก</text>
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

          <div className="modal-body question-modal-body px-4 pt-2">
            <text className="modal-topic ">หมวดหมู่</text>
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

const Notification = ({ userData }) => {
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
      setSearchQuery("");
      navigate("/review/search/" + searchQuery);
    }
  }
  //-----------

  // Pull Notification
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewRef = query(
          collection(db, "review"),
          where("member_id", "==", userData.id)
        );

        const cmntReviewRef = collection(db, "cmnt_review");
        const cmntReviewRef2 = query(
          collection(db, "cmnt_review"),
          where("member_id", "==", userData.id)
        );
        const replyReviewRef = collection(db, "reply_review");

        const questionRef = query(
          collection(db, "question"),
          where("member_id", "==", userData.id)
        );

        const cmntQuestionRef = collection(db, "cmnt_question");
        const cmntQuestionRef2 = query(
          collection(db, "cmnt_question"),
          where("member_id", "==", userData.id)
        );
        const replyQuestionRef = collection(db, "reply_question");

        // Review
        const reviewDocs = await getDocs(reviewRef);
        const reviewIds = reviewDocs.docs.map((doc) => doc.id);

        const cmntReviewDocs = await getDocs(cmntReviewRef2);
        const cmntReviewIds = cmntReviewDocs.docs.map((doc) => doc.id);

        const cmntReviewQuery =
          reviewIds.length > 0
            ? query(cmntReviewRef, where("post_id", "in", reviewIds))
            : null;
        const cmntReviewDocs2 = cmntReviewQuery
          ? await getDocs(cmntReviewQuery)
          : null;

        const cmntReviewData =
          cmntReviewDocs2 && cmntReviewDocs2.docs.length > 0
            ? cmntReviewDocs2.docs.map((doc) => ({
                id: doc.id,
                status: 0,
                reply_status: 0,
                ...doc.data(),
              }))
            : [];

        const replyReviewQuery =
          cmntReviewIds.length > 0
            ? query(replyReviewRef, where("cmnt_id", "in", cmntReviewIds))
            : null;
        const replyReviewDocs = replyReviewQuery
          ? await getDocs(replyReviewQuery)
          : null;

        const replyReviewData =
          replyReviewDocs && replyReviewDocs.docs.length > 0
            ? replyReviewDocs.docs.map((doc) => ({
                id: doc.id,
                status: 0,
                reply_status: 1,
                ...doc.data(),
              }))
            : [];

        // Question
        const questionDocs = await getDocs(questionRef);
        const questionIds = questionDocs.docs.map((doc) => doc.id);

        const cmntQuestionDocs = await getDocs(cmntQuestionRef2);
        const cmntQuestionIds = cmntQuestionDocs.docs.map((doc) => doc.id);

        const cmntQuestionQuery =
          questionIds.length > 0
            ? query(cmntQuestionRef, where("post_id", "in", questionIds))
            : null;
        const cmntQuestionDocs2 = cmntQuestionQuery
          ? await getDocs(cmntQuestionQuery)
          : null;

        const cmntQuestionData =
          cmntQuestionDocs2 && cmntQuestionDocs2.docs.length > 0
            ? cmntQuestionDocs2.docs.map((doc) => ({
                id: doc.id,
                status: 1,
                reply_status: 0,
                ...doc.data(),
              }))
            : [];

        const replyQuestionQuery =
          cmntQuestionIds.length > 0
            ? query(replyQuestionRef, where("cmnt_id", "in", cmntQuestionIds))
            : null;
        const replyQuestionDocs = replyQuestionQuery
          ? await getDocs(replyQuestionQuery)
          : null;

        const replyQuestionData =
          replyQuestionDocs && replyQuestionDocs.docs.length > 0
            ? replyQuestionDocs.docs.map((doc) => ({
                id: doc.id,
                status: 1,
                reply_status: 1,
                ...doc.data(),
              }))
            : [];

        const mergedData = [
          ...cmntReviewData,
          ...replyReviewData,
          ...cmntQuestionData,
          ...replyQuestionData,
        ];

        const sortedData = mergedData.sort((a, b) => {
          const dateComparison = b.date.localeCompare(a.date);
          if (dateComparison !== 0) {
            return dateComparison;
          } else {
            return b.time.localeCompare(a.time);
          }
        });

        setSortedData(sortedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userData]);

  const [active, setActive] = useState(true);

  function closeItem() {
    setActive(false);
  }

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="left-content">
                <span className="qTitle">การแจ้งเตือน</span>
                <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
                  <Tab className="pt-4" eventKey="all" title="ทั้งหมด">
                    {sortedData.map((data) => (
                      <div key={data.id}>
                        {/* {alert(data.member_id + "===" + userData.id)} */}
                        {data.member_id !== userData.id ? (
                          <MemberInfo
                            memberID={data.member_id}
                            postID={data.post_id}
                            cmntID={data.cmnt_id}
                            status={data.status}
                            reply_status={data.reply_status}
                            this_content={data.content}
                            time={data.time}
                            date={data.date}
                          />
                        ) : (
                          <div></div>
                        )}
                        {/* <MemberInfo
                          memberID={data.member_id}
                          postID={data.post_id}
                          cmntID={data.cmnt_id}
                          status={data.status}
                          reply_status={data.reply_status}
                          this_content={data.content}
                          time={data.time}
                          date={data.date}
                        /> */}
                      </div>
                    ))}
                  </Tab>
                  {/* <Tab className="pt-4" eventKey="no-ans" title="การตอบกลับ">
                    <div>
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          bgcolor: "background.paper",
                        }}
                      >
                        <ListItem alignItems="flex-start center">
                          <ListItemAvatar>
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <React.Fragment>
                                <Typography
                                  className="notiName"
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  วรรณดา แม็กซิมอฟ
                                </Typography>
                                &nbsp; &nbsp;
                                <Typography
                                  className="notiText"
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  ได้แสดงความคิดเห็นต่อโพสต์
                                </Typography>
                                &nbsp; &nbsp;
                                <Typography
                                  className="notiPost"
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  วิชานี้ GEN231 ดีมั้ยครับ อยากฟังรีวิจากพี่ๆ
                                  ครับ
                                </Typography>
                              </React.Fragment>
                            }
                            secondary={
                              <Typography className="notiTime">
                                10 นาทีที่ผ่านมา
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </div>
                  </Tab> */}
                </Tabs>
              </div>
            </div>

            <div className="col-md-1">
              <div className="vertical-line"></div>
            </div>

            <div className="col-md-3">
              <div className="d-grid mx-auto">
                <Rmodal />

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
                    คุณสามารถเริ่มถามคำถามจากปุ่มด้านบนนี้ หรือ
                    ถ้าสงสัยเกี่ยวกับรายวิชา หอพัก สิ่งต่างๆ
                    สามารถค้นหาสิ่งที่คุณอยากรู้ได้ที่แถบด้านล่างนี้เลย
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
                            src={require("../images/icon/search.svg").default}
                            alt="search svg"
                          />
                        </span>
                        {searchTextShow ? (
                          <span
                            style={{ paddingLeft: "1rem", fontSize: "14px" }}
                          >
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
      </div>
    </div>
  );
};

function MemberInfo({
  memberID,
  postID,
  cmntID,
  status,
  reply_status,
  this_content,
  time,
  date,
}) {
  const [memberData, setMemberData] = useState(null);
  const [postData, setPostData] = useState(null);

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

  // pull postData
  useEffect(() => {
    try {
      if (status === 0) {
        if (reply_status === 0) {
          const postDocRef = doc(db, "review", postID);
          getDoc(postDocRef).then((docSnap) => {
            if (docSnap.exists()) {
              console.log("Successfully Load postData (review)");
              const data = docSnap.data();
              setPostData(data);
            } else {
              console.error("Member document not found");
            }
          });
        } else if (reply_status === 1) {
          const postDocRef = doc(db, "cmnt_review", cmntID);
          getDoc(postDocRef).then((docSnap) => {
            if (docSnap.exists()) {
              console.log("Successfully Load postData (cmnt_review)");
              const data = docSnap.data();
              setPostData(data);
            } else {
              console.error("Member document not found");
            }
          });
        }
      } else if (status === 1) {
        if (reply_status === 0) {
          const postDocRef = doc(db, "question", postID);
          getDoc(postDocRef).then((docSnap) => {
            if (docSnap.exists()) {
              console.log("Successfully Load postData (question)");
              const data = docSnap.data();
              setPostData(data);
            } else {
              console.error("Member document not found");
            }
          });
        } else if (reply_status === 1) {
          const postDocRef = doc(db, "cmnt_question", cmntID);
          getDoc(postDocRef).then((docSnap) => {
            if (docSnap.exists()) {
              console.log("Successfully Load postData (cmnt_question)");
              const data = docSnap.data();
              setPostData(data);
            } else {
              console.error("Member document not found");
            }
          });
        }
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  }, []);
  // pull postData

  return (
    <div>
      {memberData && (
        <Link
          to={
            status === 0 ? "/review/post/" + postID : "/question/post/" + postID
          }
          style={{ textDecoration: "none" }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: "100%",
              bgcolor: "background.paper",
            }}
          >
            <ListItem alignItems="flex-start center">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={memberData.profile} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      className="notiName"
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {memberData.fname} {memberData.lname}
                    </Typography>
                    &nbsp; &nbsp;
                    <Typography
                      className="notiText"
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      ได้ตอบกลับต่อคุณใน
                      {reply_status === 0 ? "โพสต์" : "คอมเมนท์"}
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography
                      className="notiPost"
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      "
                      {status === 0 ? (
                        <span>
                          {reply_status === 0
                            ? postData.header
                            : postData.content}
                        </span>
                      ) : (
                        postData.content
                      )}
                      "
                    </Typography>
                    &nbsp;&nbsp;
                    <Typography
                      className="notiText"
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      ว่า &nbsp;
                    </Typography>
                    <Typography
                      className="notiPost"
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      "{this_content}"
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <Typography className="notiTime">
                    {formattedDate === date ? time : date}
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <hr style={{ color: "gray" }} />
        </Link>
      )}
    </div>
  );
}

export default Notification;
