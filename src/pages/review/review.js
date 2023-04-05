import React, { useEffect, useState } from "react";
import "../../styles/review.css";
import { Tabs, Tab, Dropdown, Modal, Form } from "react-bootstrap";
import { auth, db, storage } from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { queries } from "@testing-library/react";

function Rmodal() {
  const navigate = useNavigate();

  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const location = useLocation();

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
  const [userData, setUserData] = useState([]);
  const [file, setFile] = useState(null);

  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const [buttonStatus, setButtonStatus] = useState(true);

  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "review"), postData);
      console.log("This Post has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  async function createLikeData(postID, header) {
    try {
      const docRef = doc(db, "review_like", postID);
      await setDoc(docRef, { header: header });
      console.log("This Post has been created", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
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
        createData(data)
          .then((id) => {
            console.log("create data success");
            createLikeData(id, header)
              .then(() => {
                console.log("create like data success");
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
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
            createData(data)
              .then((id) => {
                console.log("create data success");
                createLikeData(id, header)
                  .then(() => {
                    console.log("create like data success");
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          });
        });
      }
    }
    setSelectedOption("เลือก");
    setFile(null);
  };

  useEffect(() => {
    checkInfo();
    const fetchData = async () => {
      try {
        const currentUserInfo = currentUser && currentUser.uid;
        const docRef = doc(db, "member", currentUserInfo);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error fetching document: ", e);
      }
    };
    fetchData();
  }, [selectedOption]);

  return (
    <>
      {/* <button onClick={handleShow} type="button" class="btn ask-button">
        เริ่มต้นถามคำถาม
      </button> */}
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

const Review = () => {
  //Search Bar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTextShow, setSearchTextShow] = useState(true);

  const [all, setAll] = useState([]);
  const [subject, setSubject] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [dorm, setDorm] = useState([]);
  const [work, setWork] = useState([]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setSearchTextShow(true);
    } else {
      setSearchTextShow(false);
    }
  };
  //-----------

  //Sorting
  const [selectedOption, setSelectedOption] = useState("ทั้งหมด");

  const handleOptionSelect = (optionName) => {
    setSelectedOption(optionName);
  };
  //-----------

  useEffect(() => {
    const itemsCollection = collection(db, "review");

    let sortedCollection = itemsCollection;

    if (selectedOption === "ยอดนิยม") {
      sortedCollection = query(itemsCollection, orderBy("like", "desc"));
    }

    try {
      //all
      const unsubscribe = onSnapshot(sortedCollection, (querySnapshot) => {
        const itemsList = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
        });
        setAll(itemsList);
      });

      //วิชาเรียน
      const subjectQuery = query(
        itemsCollection,
        where("type", "==", "วิชาเรียน")
      );
      const unsubscribeSubject = onSnapshot(subjectQuery, (querySnapshot) => {
        const itemsList = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
        });
        setSubject(itemsList);
      });

      //อาจารย์
      const teacherQuery = query(
        itemsCollection,
        where("type", "==", "อาจารย์")
      );
      const unsubscribeTeacher = onSnapshot(teacherQuery, (querySnapshot) => {
        const itemsList = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
        });
        setTeacher(itemsList);
      });

      //อาจารย์
      const restaurantQuery = query(
        itemsCollection,
        where("type", "==", "ร้านอาหาร")
      );
      const unsubscribeRestaurant = onSnapshot(
        restaurantQuery,
        (querySnapshot) => {
          const itemsList = [];
          querySnapshot.forEach((doc) => {
            const item = doc.data();
            item.id = doc.id;
            itemsList.push(item);
          });
          setRestaurant(itemsList);
        }
      );

      //หอพัก
      const dormQuery = query(
        itemsCollection,
        where("type", "==", "ร้านอาหาร")
      );
      const unsubscribeDorm = onSnapshot(dormQuery, (querySnapshot) => {
        const itemsList = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
        });
        setDorm(itemsList);
      });

      //หอพัก
      const workQuery = query(
        itemsCollection,
        where("type", "==", "สถานที่ฝึกงาน")
      );
      const unsubscribeWork = onSnapshot(workQuery, (querySnapshot) => {
        const itemsList = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
        });
        setWork(itemsList);
      });

      return () => {
        unsubscribe();
        unsubscribeSubject();
        unsubscribeTeacher();
        unsubscribeRestaurant();
        unsubscribeDorm();
        unsubscribeWork();
      };
    } catch (error) {
      console.error(error);
    }
  }, [db, selectedOption]);

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
                    <div>
                      {all ? (
                        <div>
                          {all.map((item) => (
                            <div key={item.id}>
                              <div className="row">
                                <div className="col-9">
                                  <MemberInfo
                                    memberID={item.member_id}
                                    time={item.time}
                                    date={item.date}
                                  />
                                  <div>
                                    <div className="homeHeader2">
                                      {item.header}
                                    </div>
                                    <div className="text-limit body">
                                      {item.content}
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                        width: "100%",
                                      }}
                                    >
                                      <div className="box">
                                        <div className="rectangle-container">
                                          <div className="rectangle-border">
                                            <div className="rectangle-text">
                                              {item.tag}
                                            </div>
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
                                            <a
                                              href=""
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <img
                                                src={
                                                  require("../../images/icon/chat.svg")
                                                    .default
                                                }
                                                alt="chat svg"
                                              />
                                            </a>
                                            <span
                                              style={{ paddingRight: "1rem" }}
                                            >
                                              {item.comment}
                                            </span>

                                            {/* <span
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <button
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    require("../../images/icon/like.svg")
                                                      .default
                                                  }
                                                  alt="like svg"
                                                />
                                              </button>
                                            </span> */}
                                            <LikeCheck
                                              postID={item.id}
                                              like_count={item.like}
                                            />
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
                                  </div>
                                </div>

                                <div className="col-3">
                                  <img
                                    src={item.picture}
                                    className="img-fluid"
                                  />
                                </div>
                                <div style={{ paddingTop: "1rem" }}>
                                  <hr />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>data not available</div>
                      )}
                    </div>
                    {/* <div>
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
                                  src={require("../../images/home/main.png")}
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
                              อยากทราบความเห็นของพี่ๆ
                              ที่เรียนวิชานี้ปีที่แล้วครับ ว่ามันดีไม่ดีอย่าง ไร
                              มันดึงเกรดเยอะมั้ยครับ พอดีไม่อยากให้เกรดตกครับผม
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
                                    <a
                                      href=""
                                      style={{ paddingRight: "0.5rem" }}
                                    >
                                      <img
                                        src={
                                          require("../../images/icon/chat.svg")
                                            .default
                                        }
                                        alt="chat svg"
                                      />
                                    </a>
                                    <span style={{ paddingRight: "1rem" }}>
                                      12
                                    </span>

                                    <a
                                      href=""
                                      style={{ paddingRight: "0.5rem" }}
                                    >
                                      <img
                                        src={
                                          require("../../images/icon/like.svg")
                                            .default
                                        }
                                        alt="like svg"
                                      />
                                    </a>
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
                          </div>
                        </div>

                        <div className="col-3">
                          <img
                            src={require("../../images/example/1x1.png")}
                            alt="ex_1x1"
                            className="img-fluid float-end"
                          />
                        </div>
                        <div style={{ paddingTop: "1rem" }}>
                          <hr />
                        </div>
                      </div>
                    </div> */}
                  </Tab>

                  <Tab className="pt-4" eventKey="subject" title="วิชาเรียน">
                    <div>
                      {subject ? (
                        <div>
                          {subject.map((item) => (
                            <div key={item.id}>
                              <div className="row">
                                <div className="col-9">
                                  <MemberInfo
                                    memberID={item.member_id}
                                    time={item.time}
                                    date={item.date}
                                  />
                                  <div>
                                    <div className="homeHeader2">
                                      {item.header}
                                    </div>
                                    <div className="text-limit body">
                                      {item.content}
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                        width: "100%",
                                      }}
                                    >
                                      <div className="box">
                                        <div className="rectangle-container">
                                          <div className="rectangle-border">
                                            <div className="rectangle-text">
                                              {item.tag}
                                            </div>
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
                                            <a
                                              href=""
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <img
                                                src={
                                                  require("../../images/icon/chat.svg")
                                                    .default
                                                }
                                                alt="chat svg"
                                              />
                                            </a>
                                            <span
                                              style={{ paddingRight: "1rem" }}
                                            >
                                              {item.comment}
                                            </span>

                                            {/* <span
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <button
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    require("../../images/icon/like.svg")
                                                      .default
                                                  }
                                                  alt="like svg"
                                                />
                                              </button>
                                            </span> */}
                                            <LikeCheck
                                              postID={item.id}
                                              like_count={item.like}
                                            />
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
                                  </div>
                                </div>

                                <div className="col-3">
                                  <img
                                    src={item.picture}
                                    className="img-fluid"
                                  />
                                </div>
                                <div style={{ paddingTop: "1rem" }}>
                                  <hr />
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

                  <Tab className="pt-4" eventKey="teacher" title="อาจารย์">
                    <div>
                      {teacher ? (
                        <div>
                          {teacher.map((item) => (
                            <div key={item.id}>
                              <div className="row">
                                <div className="col-9">
                                  <MemberInfo
                                    memberID={item.member_id}
                                    time={item.time}
                                    date={item.date}
                                  />
                                  <div>
                                    <div className="homeHeader2">
                                      {item.header}
                                    </div>
                                    <div className="text-limit body">
                                      {item.content}
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                        width: "100%",
                                      }}
                                    >
                                      <div className="box">
                                        <div className="rectangle-container">
                                          <div className="rectangle-border">
                                            <div className="rectangle-text">
                                              {item.tag}
                                            </div>
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
                                            <a
                                              href=""
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <img
                                                src={
                                                  require("../../images/icon/chat.svg")
                                                    .default
                                                }
                                                alt="chat svg"
                                              />
                                            </a>
                                            <span
                                              style={{ paddingRight: "1rem" }}
                                            >
                                              {item.comment}
                                            </span>

                                            {/* <span
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <button
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    require("../../images/icon/like.svg")
                                                      .default
                                                  }
                                                  alt="like svg"
                                                />
                                              </button>
                                            </span> */}
                                            <LikeCheck
                                              postID={item.id}
                                              like_count={item.like}
                                            />
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
                                  </div>
                                </div>

                                <div className="col-3">
                                  <img
                                    src={item.picture}
                                    className="img-fluid"
                                  />
                                </div>
                                <div style={{ paddingTop: "1rem" }}>
                                  <hr />
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

                  <Tab className="pt-4" eventKey="restaurant" title="ร้านอาหาร">
                    <div>
                      {restaurant ? (
                        <div>
                          {restaurant.map((item) => (
                            <div key={item.id}>
                              <div className="row">
                                <div className="col-9">
                                  <MemberInfo
                                    memberID={item.member_id}
                                    time={item.time}
                                    date={item.date}
                                  />
                                  <div>
                                    <div className="homeHeader2">
                                      {item.header}
                                    </div>
                                    <div className="text-limit body">
                                      {item.content}
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                        width: "100%",
                                      }}
                                    >
                                      <div className="box">
                                        <div className="rectangle-container">
                                          <div className="rectangle-border">
                                            <div className="rectangle-text">
                                              {item.tag}
                                            </div>
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
                                            <a
                                              href=""
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <img
                                                src={
                                                  require("../../images/icon/chat.svg")
                                                    .default
                                                }
                                                alt="chat svg"
                                              />
                                            </a>
                                            <span
                                              style={{ paddingRight: "1rem" }}
                                            >
                                              {item.comment}
                                            </span>

                                            {/* <span
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <button
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    require("../../images/icon/like.svg")
                                                      .default
                                                  }
                                                  alt="like svg"
                                                />
                                              </button>
                                            </span> */}
                                            <LikeCheck
                                              postID={item.id}
                                              like_count={item.like}
                                            />
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
                                  </div>
                                </div>

                                <div className="col-3">
                                  <img
                                    src={item.picture}
                                    className="img-fluid"
                                  />
                                </div>
                                <div style={{ paddingTop: "1rem" }}>
                                  <hr />
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

                  <Tab className="pt-4" eventKey="dorm" title="หอพัก">
                    <div>
                      {dorm ? (
                        <div>
                          {dorm.map((item) => (
                            <div key={item.id}>
                              <div className="row">
                                <div className="col-9">
                                  <MemberInfo
                                    memberID={item.member_id}
                                    time={item.time}
                                    date={item.date}
                                  />
                                  <div>
                                    <div className="homeHeader2">
                                      {item.header}
                                    </div>
                                    <div className="text-limit body">
                                      {item.content}
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                        width: "100%",
                                      }}
                                    >
                                      <div className="box">
                                        <div className="rectangle-container">
                                          <div className="rectangle-border">
                                            <div className="rectangle-text">
                                              {item.tag}
                                            </div>
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
                                            <a
                                              href=""
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <img
                                                src={
                                                  require("../../images/icon/chat.svg")
                                                    .default
                                                }
                                                alt="chat svg"
                                              />
                                            </a>
                                            <span
                                              style={{ paddingRight: "1rem" }}
                                            >
                                              {item.comment}
                                            </span>

                                            {/* <span
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <button
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    require("../../images/icon/like.svg")
                                                      .default
                                                  }
                                                  alt="like svg"
                                                />
                                              </button>
                                            </span> */}
                                            <LikeCheck
                                              postID={item.id}
                                              like_count={item.like}
                                            />
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
                                  </div>
                                </div>

                                <div className="col-3">
                                  <img
                                    src={item.picture}
                                    className="img-fluid"
                                  />
                                </div>
                                <div style={{ paddingTop: "1rem" }}>
                                  <hr />
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

                  <Tab className="pt-4" eventKey="work" title="สถานที่ฝึกงาน">
                    <div>
                      {work ? (
                        <div>
                          {work.map((item) => (
                            <div key={item.id}>
                              <div className="row">
                                <div className="col-9">
                                  <MemberInfo
                                    memberID={item.member_id}
                                    time={item.time}
                                    date={item.date}
                                  />
                                  <div>
                                    <div className="homeHeader2">
                                      {item.header}
                                    </div>
                                    <div className="text-limit body">
                                      {item.content}
                                    </div>
                                    <div
                                      style={{
                                        paddingTop: "1rem",
                                        width: "100%",
                                      }}
                                    >
                                      <div className="box">
                                        <div className="rectangle-container">
                                          <div className="rectangle-border">
                                            <div className="rectangle-text">
                                              {item.tag}
                                            </div>
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
                                            <a
                                              href=""
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <img
                                                src={
                                                  require("../../images/icon/chat.svg")
                                                    .default
                                                }
                                                alt="chat svg"
                                              />
                                            </a>
                                            <span
                                              style={{ paddingRight: "1rem" }}
                                            >
                                              {item.comment}
                                            </span>

                                            {/* <span
                                              style={{ paddingRight: "0.5rem" }}
                                            >
                                              <button
                                                style={{
                                                  backgroundColor:
                                                    "transparent",
                                                  border: "none",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    require("../../images/icon/like.svg")
                                                      .default
                                                  }
                                                  alt="like svg"
                                                />
                                              </button>
                                            </span> */}
                                            <LikeCheck
                                              postID={item.id}
                                              like_count={item.like}
                                            />
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
                                  </div>
                                </div>

                                <div className="col-3">
                                  <img
                                    src={item.picture}
                                    className="img-fluid"
                                  />
                                </div>
                                <div style={{ paddingTop: "1rem" }}>
                                  <hr />
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
              {/* <button
                type="button"
                className="button"
                onClick=""
                style={{ width: "100%" }}
              >
                เริ่มต้นการเขียนโพสต์
              </button> */}
              <Rmodal />
              <div className="searchBar">
                <div className="search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ paddingLeft: "2.5rem" }}
                  />
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

function MemberInfo({ memberID, time, date }) {
  const [memberData, setMemberData] = useState(null);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  useEffect(() => {
    async function fetchMemberData() {
      const memberDocRef = doc(db, "member", memberID);
      const memberDocSnapshot = await getDoc(memberDocRef);
      if (memberDocSnapshot.exists()) {
        const memberData = memberDocSnapshot.data();
        setMemberData(memberData);
      } else {
        console.log("Member document not found");
      }
    }

    fetchMemberData();
  }, [memberID]);

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

function LikeCheck({ postID, like_count }) {
  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [likeURL, setLikeURL] = useState(
    require("../../images/icon/like.svg").default
  );

  async function checkIfLiked(currentUserID, postID) {
    const docRef = doc(db, "review_like", postID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { users } = docSnap.data();
      return users.includes(currentUserID);
    }
    return false;
  }

  useEffect(() => {
    const fetchData = async () => {
      const liked = await checkIfLiked(currentUserId, postID);
      setLikedByCurrentUser(liked);
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // update every 1 seconds
    return () => clearInterval(intervalId);
  }, [postID, currentUserId]);

  useEffect(() => {
    if (likedByCurrentUser === false) {
      setLikeURL(require("../../images/icon/like.svg").default);
    } else {
      setLikeURL(require("../../images/icon/red_like.svg").default);
    }
  }, [likedByCurrentUser]);

  const handleLikeClick = () => {
    const docRef = doc(db, "review_like", postID);
    setLikedByCurrentUser(!likedByCurrentUser);
    if (likedByCurrentUser === false) {
      updateDoc(docRef, { users: arrayUnion(currentUserId) })
        .then(() => {
          console.log("You Like the post!");
          const postRef = doc(collection(db, "review"), postID);
          updateDoc(postRef, { like: like_count + 1 });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        })
        .then(() => {
          setLikeURL(require("../../images/icon/red_like.svg").default);
        });
    } else if (likedByCurrentUser === true) {
      updateDoc(docRef, { users: arrayRemove(currentUserId) })
        .then(() => {
          const postRef = doc(collection(db, "review"), postID);
          console.log("You Unike the post!");
          updateDoc(postRef, {
            like: like_count - 1,
          });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        })
        .then(() => {
          setLikeURL(require("../../images/icon/like.svg").default);
        });
    }
  };

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

export default Review;
