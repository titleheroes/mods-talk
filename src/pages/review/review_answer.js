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
  onSnapshot,
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

const Answer = ({ userData }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const [active, setActive] = useState(true);

  const [content, setContent] = useState("");
  const [comment, setComment] = useState([]);

  const [visibility, setVisibility] = useState({});

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
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  function closeItem() {
    setActive(false);
  }
  function openItem() {
    setActive(true);
  }

  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "cmnt_review"), postData);
      const docRef2 = doc(db, "review", id);
      updateDoc(docRef2, {
        comment: post.comment + 1,
      });
      console.log("This Comment has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
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
        .then(() => {
          console.log("create data success");
          setContent("");
        })
        .catch((error) => {
          console.error(error);
        });
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
                      paddingTop: "1rem",
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
                      <LikeCheck
                        postID={id}
                        users={post.users}
                        like_count={post.like}
                      />
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
                                {formattedDate === item.date
                                  ? item.time
                                  : item.date}
                              </span>
                            </div>

                            <div>
                              <Button
                                className="reply-button"
                                onClick={() => handleToggleVisibility(item.id)}
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
                          <hr />
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

function ReplyLoad({ userData, postID, cmntID, replyCount }) {
  const [content, setContent] = useState("");
  const [reply, setReply] = useState([]);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser.uid;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  // ดันข้อมูลคอมเมนท์
  async function createData(postData) {
    try {
      const docRef = await addDoc(collection(db, "reply_review"), postData);
      const docRef2 = doc(db, "cmnt_review", cmntID);
      updateDoc(docRef2, {
        reply: replyCount + 1,
      });
      console.log("This Comment has been created", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
    }
  }

  const replySubmit = (event) => {
    if (content === null) {
    } else {
      event.preventDefault();
      const data = {
        post_id: postID,
        cmnt_id: cmntID,
        like: 0,
        report: 0,
        content: content,
        member_id: currentUserId,
        date: formattedDate,
        time: formattedTime,
      };
      createData(data)
        .then(() => {
          console.log("create data success");
          setContent("");
        })
        .catch((error) => {
          console.error(error);
        });
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
        console.log("Comment has been pulled");
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="px-3">
      {reply ? (
        <div>
          {reply.map((item) => (
            <div key={item.id}>
              <div className="flex-container comment pt-3">
                <MemberInfo memberID={item.member_id} />

                <div className="flex-1-right">
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

              <div className="pt-4">
                <span>{item.content}</span>
              </div>

              <div className="flex-container comment pt-2" id="comment-reply">
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
            </div>
          ))}
        </div>
      ) : (
        <div>data not available</div>
      )}
      {/* เขียนคอมเมนท์                           */}
      <form className="pt-3 pb-1" onSubmit={replySubmit}>
        <div className="flex-container comment" id="comment-2">
          <div className="profile-image" style={{ marginRight: "1rem" }}>
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
                src={require("../../images/question/sent_1.svg").default}
                alt=""
              />
            </Button>
          </div>
        </div>
      </form>
      {/* เขียนคอมเมนท์                           */}
      <hr />
    </div>
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
