import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import "../styles/notification.css";
import "../styles/review.css";
import { Tabs, Tab, Dropdown, Modal, Button } from "react-bootstrap";
import { useMediaQuery } from "@mui/material";
import { Typography } from "@mui/material";
import { ListItemText } from "@mui/material";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { api_address, auth, db, storage } from "../config";
import { Link, useNavigate } from "react-router-dom";
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
              โพสต์
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
function EditProfile({ userData }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const handleClose = () => {
    setShow(false);
    setFac(userData.fac);
  };
  const handleShow = () => setShow(true);

  const [fullname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [studentid, setId] = useState("");
  const [faculty, setFac] = useState("");
  const [position, setPos] = useState("");

  const handleFacultyChange = (value) => {
    setFac(value);
  };

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file && /image\/(jpeg|png)/.test(file.type)) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
    setFile(file);
  }

  async function createData(postData, currentUserId) {
    try {
      const docRef = doc(db, "member", currentUserId);
      updateDoc(docRef, postData)
        .then(() => {
          console.log("Document updated with new count value");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });

      console.log("This Post has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  const handleSubmit = (event) => {
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    const timestamp = Date.now();

    event.preventDefault();
    if (file === null) {
      const data = {
        code: studentid,
        fname: fullname,
        lname: lastname,
        fac: faculty,
        pos: position,
        profile: userData.profile,
      };
      createData(data, currentUserId);
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
            code: studentid,
            fname: fullname,
            lname: lastname,
            fac: faculty,
            pos: position,
            profile: url,
          };
          createData(data, currentUserId);
        });
      });
    }
    setFile(null);
  };

  useEffect(() => {
    setFname(userData.fname);
    setLname(userData.lname);
    setId(userData.code);
    setFac(userData.fac);
    setPos(userData.pos);
    setPreview(userData.profile);
  }, [userData]);

  return (
    <>
      <button
        type="button"
        className="bbprofile btn"
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
        <form onSubmit={handleSubmit}>
          <div className="modal-header question-modal-header pt-4">
            <h1
              className="modal-title question-modal-title fs-5 ps-2 "
              id="exampleModalLabel"
            >
              แก้ไขโปรไฟล์
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
            <text className="modal-topic">แก้ไขรูปภาพ</text>
            <div className="row mt-3 mb-3">
              <div className="col-3">
                <div className="edit-profile-image">
                  <img src={preview} className="img-fluid" />
                </div>
              </div>
              <div
                className="col-9"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div style={{ paddingLeft: "10px" }}>
                  <input
                    type="file"
                    className="form-control mt-2 mb-3"
                    id="picture"
                    placeholder="ไฟล์รูปภาพสกุล JPG, PNG"
                    accept="image/jpeg, image/png"
                    onChange={handleUpload}
                  />

                  <text
                    className="modal-topic mt-1"
                    style={{ display: "block" }}
                  >
                    แนะนำ: ใช้รูปภาพเป็นสกุล JPG หรือ PNG
                  </text>
                </div>
              </div>
            </div>

            <text className="modal-topic mb-3" style={{ display: "block" }}>
              แก้ไขข้อมูลส่วนตัว
            </text>

            <div className="row">
              <div className="col">
                <text className="modal-topic">ชื่อจริง</text>
                <input
                  type="text"
                  className="form-control mt-2 mb-3"
                  id="modal-input-box"
                  value={fullname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                />
              </div>
              <div className="col">
                <text className="modal-topic">นามสกุล</text>
                <input
                  type="text"
                  className="form-control mt-2 mb-3"
                  id="modal-input-box"
                  value={lastname}
                  onChange={(e) => {
                    setLname(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <text className="modal-topic">คณะ</text>
                <Dropdown className="pt-2">
                  <Dropdown.Toggle
                    className="form-control py-2"
                    style={{
                      textAlign: "left",
                      backgroundColor: "transparent",
                      color: "rgba(79, 79, 79)",
                      borderColor: "rgba(79, 79, 79, 0.3)",
                      width: "100%",
                      whiteSpace: "nowrap", // prevent text from wrapping
                      overflow: "hidden", // hide text that overflows
                      textOverflow: "ellipsis", // show ellipsis when text overflows
                    }}
                    id="dropdown-basic"
                  >
                    {faculty}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ width: "100%", textAlign: "left" }}>
                    <Dropdown.Item
                      style={{ whiteSpace: "normal" }}
                      onClick={() => {
                        handleFacultyChange("วิศวกรรมศาสตร์");
                      }}
                    >
                      วิศวกรรมศาสตร์
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ whiteSpace: "normal" }}
                      onClick={() => {
                        handleFacultyChange("ครุศาสตร์อุตสาหกรรมและเทคโนโลยี");
                      }}
                    >
                      ครุศาสตร์อุตสาหกรรมและเทคโนโลยี
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ whiteSpace: "normal" }}
                      onClick={() => {
                        handleFacultyChange("วิทยาศาสตร์");
                      }}
                    >
                      วิทยาศาสตร์
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ whiteSpace: "normal" }}
                      onClick={() => {
                        handleFacultyChange("สถาบันวิทยาการหุ่นยนต์ภาคสนาม");
                      }}
                    >
                      สถาบันวิทยาการหุ่นยนต์ภาคสนาม
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ whiteSpace: "normal" }}
                      onClick={() => {
                        handleFacultyChange("สถาปัตยกรรมศาสตร์และการออกแบบ");
                      }}
                    >
                      สถาปัตยกรรมศาสตร์และการออกแบบ
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-6">
                <text className="modal-topic">สาขา</text>
                <input
                  type="text"
                  className="form-control mt-2 mb-3"
                  style={{ height: "42px" }}
                  id="modal-input-box"
                  value={position}
                  onChange={(e) => {
                    setPos(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <text className="modal-topic">รหัสนักศึกษา</text>
                <input
                  type="text"
                  className="form-control mt-2 mb-3"
                  id="modal-input-box"
                  value={studentid}
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                />
              </div>
              <div className="col"></div>
            </div>
          </div>

          <div className="modal-footer question-modal-footer flex-center pt-1 pb-4">
            <button
              type="submit"
              className="btn post-question-btn mx-auto mt-0 "
              onClick={handleClose}
            >
              บันทึก
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

const Profile = ({ userData }) => {
  const navigate = useNavigate();

  const matches = useMediaQuery("(min-width:1024px)");

  const [all, setAll] = useState([]);

  const [status, setStatus] = useState("Loading");

  useEffect(() => {
    if (userData.type == 0) {
      setStatus("นักศึกษา");
    } else {
      setStatus("อาจารย์/บุคลากร");
    }
  });

  let orderOne, orderTwo, orderThree;
  if (matches) {
    orderOne = "1";
    orderTwo = "2";
    orderThree = "3";
  } else {
    orderOne = "2";
    orderTwo = "3";
    orderThree = "1";
  }

  useEffect(() => {
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    const itemsCollection = collection(db, "review");

    const sortedCollection = query(
      collection(db, "review"),
      where("member_id", "==", currentUserId),
      orderBy("date", "desc"),
      orderBy("time", "desc")
    );

    try {
      const unsubscribe = onSnapshot(sortedCollection, (querySnapshot) => {
        const itemsList = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
          console.log("Succesfully Loading Post");
        });
        setAll(itemsList);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handlePropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8" style={{ order: orderOne }}>
              <div className="left-content">
                {matches ? (
                  <span className="qTitle">
                    {userData.fname} {userData.lname}
                  </span>
                ) : (
                  <div></div>
                )}
                <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
                  <Tab
                    className="pt-4"
                    eventKey="all"
                    title="โพสต์ของคุณทั้งหมด"
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
                                                  require("../images/question/three_dots.svg")
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
                                                      require("../images/icon/chat.svg")
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
              </div>
            </div>

            <div className="col-md-1" style={{ order: orderTwo }}>
              <div className="vertical-line"></div>
            </div>

            <div className="col-md-3" style={{ order: orderThree }}>
              <div className="d-grid mx-auto">
                <Rmodal />

                <EditProfile userData={userData} />

                <div className="box mt-5">
                  <div className="profile-main">
                    <img
                      src={userData.profile}
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
                  {userData.fname} {userData.lname}
                </Typography>

                <Typography className="profilestatus" variant="body2">
                  {status}
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
                      &nbsp; {userData.code}
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
                      &nbsp; {userData.fac}
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
                      &nbsp; {userData.pos}
                    </Typography>
                  }
                />
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
    // Create a reference to the post document
    const docRef = doc(db, "review", postID);

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

    // Delete the post document
    await deleteDoc(docRef);

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
    require("../images/icon/like.svg").default
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
          setLikeURL(require("../images/icon/red_like.svg").default);
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
          setLikeURL(require("../images/icon/like.svg").default);
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  useEffect(() => {
    if (likedByCurrentUser === false) {
      setLikeURL(require("../images/icon/like.svg").default);
    } else {
      setLikeURL(require("../images/icon/red_like.svg").default);
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

export default Profile;
