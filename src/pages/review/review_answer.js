import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../../styles/review.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config";

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

const Answer = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const [userData, setUserData] = useState([]);
  const [active, setActive] = useState(true);

  const [content, setContent] = useState("");
  const [comment, setComment] = useState([]);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const navigate = useNavigate();

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  function closeItem() {
    setActive(false);
  }
  function openItem() {
    setActive(true);
  }

  // pull userData
  function fetchData() {
    try {
      const currentUserInfo = currentUser && currentUser.uid;
      const docRef = doc(db, "member", currentUserInfo);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error fetching document: ", error);
        });
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  }

  fetchData();
  // pull userData

  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "cmnt_review"), postData);
      console.log("This Comment has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  async function createLikeData(postID, content) {
    try {
      const docRef = doc(db, "cmnt_review_like", postID);
      await setDoc(docRef, { content: content });
      console.log("This Post has been created", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  // ดันข้อมูลคอมเมนท์
  const commentSubmit = (event) => {
    if (content === null) {
    } else {
      event.preventDefault();
      const data = {
        post_id: id,
        like: 0,
        report: 0,
        reply: 0,
        content: content,
        member_id: currentUserId,
        date: formattedDate,
        time: formattedTime,
      };
      createData(data)
        .then((id) => {
          console.log("create data success");
          createLikeData(id, content)
            .then(() => {
              console.log("create like data success");
            })
            .catch((error) => {
              console.error(error);
            })
            .then(() => {
              setContent("");
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    // ดึงข้อมูล
    async function fetchPost() {
      const count = 1;
      // console.log("Review page : Post Load -> " + count);
      count++;

      const postRef = doc(db, "review", id);
      const postDoc = await getDoc(postRef);

      // ดึงข้อมูลโพสต์
      if (postDoc.exists()) {
        setPost(postDoc.data());
        // console.log(post);
      } else {
        console.error("No such document!");
      }
    }

    fetchPost();
  }, []);

  // ดึง cmnt_review
  useEffect(() => {
    try {
      const fetchData = async () => {
        const q = query(
          collection(db, "cmnt_review"),
          where("post_id", "==", id)
        );
        const itemsList = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          item.id = doc.id;
          itemsList.push(item);
        });
        setComment(itemsList);
      };
      fetchData();
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md vertLine">
              <div className="left-content">
                <div className="post-border">
                  {console.log("post repeater")}
                  <MemberHost
                    memberID={post.member_id}
                    time={post.time}
                    date={post.date}
                  />

                  <div className="pt-2 homeHeader2">{post.header}</div>

                  <div>
                    <Button className="hit-header">{post.tag}</Button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "400px",
                    }}
                  >
                    <img
                      src={post.picture}
                      className="img-fluid"
                      style={{ height: "100%" }}
                    />
                  </div>

                  <p className="pt-3 text">{post.content}</p>

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
                      <LikeCheck postID={id} like_count={post.like} />
                    </div>

                    <div className="flex-2-comment"></div>

                    <div className="flex-1-comment-right">
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

                {/* เขียนคอมเมนท์                           */}
                <form onSubmit={commentSubmit}>
                  <div className="flex-container comment" id="comment-2">
                    <div
                      className="profile-image"
                      style={{ marginRight: "1rem" }}
                    >
                      <img
                        src={userData.profile}
                        alt="main page png"
                        className="img-fluid"
                      />
                    </div>

                    <div className="flex-2">
                      <input
                        type="text"
                        className="form-control "
                        id="content"
                        placeholder="เขียนความคิดเห็น..."
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                      />
                    </div>

                    <div className="flex-1-right">
                      <Button className="sent-comment" type="submit">
                        <img
                          className="menu-pic pe-3"
                          src={
                            require("../../images/question/sent_1.svg").default
                          }
                          alt=""
                        />
                      </Button>
                    </div>
                  </div>
                </form>
                {/* เขียนคอมเมนท์                           */}

                {/* ดึง map comment                           */}
                <div>
                  {comment ? (
                    <div>
                      {comment.map((item) => (
                        <div key={item.id}>
                          {console.log("item repeater" + item.id)}
                          <div className="flex-container comment pt-3">
                            <MemberInfo memberID={post.member_id} />

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

                          <div className="pt-4">
                            <span>{item.content}</span>
                          </div>

                          <div
                            className="flex-container comment pt-2"
                            id="comment-reply"
                          >
                            <div className="pe-4">
                              <span className="post-date">
                                {formattedDate === post.date
                                  ? post.time
                                  : post.date}
                              </span>
                            </div>

                            <div className="">
                              <Button className="reply-button">
                                <text id="reply-text">ตอบกลับ</text>
                              </Button>
                            </div>
                          </div>
                          <hr />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>data not available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="d-grid mx-auto right-content ">
                <Qmodal />

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
                    src={require("../../images/question/search.svg").default}
                    alt=""
                  />

                  <text className="search-tips" id="s2">
                    และพิมพ์เกี่ยวกับสิ่งที่คุณอยากรู้เพื่อค้นหาคำถาม
                    ที่ใกล้เคียงหรือหาคำตอบไปด้วยกัน
                  </text>
                </div>

                <div>
                  <div className="mt-4 pt-4 hit-title mb-2">
                    <span className="">เป็นที่นิยมใน Mod's Talk</span>
                  </div>

                  <Button className="hit-tag">Programming</Button>
                  <Button className="hit-tag">Data Science</Button>
                  <Button className="hit-tag">Technology</Button>
                  <Button className="hit-tag">Self Improvement</Button>
                  <Button className="hit-tag">Writing</Button>
                  <Button className="hit-tag">Ralationships</Button>
                  <Button className="hit-tag">Machine Learning</Button>
                  <Button className="hit-tag">Some random topic</Button>
                </div>
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
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  async function fetchMemberData() {
    const memberDocRef = doc(db, "member", memberID);
    const memberDocSnapshot = await getDoc(memberDocRef);
    if (memberDocSnapshot.exists()) {
      const memberData = memberDocSnapshot.data();
      setMemberData(memberData);
    } else {
      console.error("Member document not found");
    }
  }
  fetchMemberData();

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

  async function fetchMemberData() {
    const memberDocRef = doc(db, "member", memberID);
    const memberDocSnapshot = await getDoc(memberDocRef);
    if (memberDocSnapshot.exists()) {
      const memberData = memberDocSnapshot.data();
      setMemberData(memberData);
    } else {
      console.error("Member document not found");
    }
  }

  fetchMemberData();

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
    const timeoutId = setTimeout(() => {
      const fetchData = async () => {
        const liked = await checkIfLiked(currentUserId, postID);
        setLikedByCurrentUser(liked);
      };
      fetchData();
      const intervalId = setInterval(fetchData, 1000);
      return () => clearInterval(intervalId);
    }, 10000);
    return () => clearTimeout(timeoutId);
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

export default Answer;
