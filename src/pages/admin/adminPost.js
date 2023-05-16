import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import Sidebar from "../../components/sidebar/sidebar";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { createTheme, ThemeProvider } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const theme = createTheme({
  typography: {
    fontFamily: ["Kanit", "sans-serif"].join(","),
  },
});

function AlertDialogSlide({
  id,
  post_id,
  cmnt_id,
  header,
  name,
  section,
  category,
  suspended,
  tag,
}) {
  async function deleteProc(docRef, docRefValue) {
    try {
      await deleteDoc(docRef);

      if (section === "รีวิว") {
        if (category === "โพสต์") {
          try {
            // Create a query to get all comments for the post
            const commentQuery = query(
              collection(db, "cmnt_review"),
              where("post_id", "==", id)
            );
            // Create a query to get all replies for the post
            const replyQuery = query(
              collection(db, "reply_review"),
              where("post_id", "==", id)
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
            if (suspended === undefined) {
              const tagDocRef = doc(db, "tag_ranked", tag);
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
            }
          } catch (error) {
            console.error(error);
          }
        } else if (category === "คอมเมนท์") {
          try {
            // Create a query to get all replies for the post
            const replyQuery = query(
              collection(db, "reply_review"),
              where("cmnt_id", "==", id)
            );

            // Use Promise.all() to execute both queries in parallel
            const [replySnapshot] = await Promise.all([getDocs(replyQuery)]);

            // Delete all reply documents
            replySnapshot.forEach(async (replyDoc) => {
              const replyDocRef = doc(db, "reply_review", replyDoc.id);
              await deleteDoc(replyDocRef);
            });

            console.log("Comments, and replies deleted successfully.");
            alert("ลบคอมเมนท์สำเร็จ");
          } catch (error) {
            console.error(error);
          }
        }
      } else if (section === "ถาม-ตอบ") {
        if (category === "โพสต์") {
          try {
            // Create a query to get all comments for the post
            const commentQuery = query(
              collection(db, "cmnt_question"),
              where("post_id", "==", id)
            );

            // Create a query to get all replies for the post
            const replyQuery = query(
              collection(db, "reply_question"),
              where("post_id", "==", id)
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
              const replyDocRef = doc(db, "reply_question", replyDoc.id);
              await deleteDoc(replyDocRef);
            });
          } catch (error) {
            console.error(error);
          }
        } else if (category === "คอมเมนท์") {
          try {
            // Create a query to get all replies for the post
            const replyQuery = query(
              collection(db, "reply_question"),
              where("cmnt_id", "==", id)
            );

            // Use Promise.all() to execute both queries in parallel
            const [replySnapshot] = await Promise.all([getDocs(replyQuery)]);

            // Delete all reply documents
            replySnapshot.forEach(async (replyDoc) => {
              const replyDocRef = doc(db, "reply_question", replyDoc.id);
              await deleteDoc(replyDocRef);
            });
          } catch (error) {
            console.error(error);
          }
        }
      }

      try {
        const docSnapshot = await getDoc(docRefValue);
        if (category === "คอมเมนท์") {
          try {
            if (docSnapshot.exists()) {
              if (suspended === undefined) {
                const data = docSnapshot.data();
                await updateDoc(docRefValue, {
                  comment: data.comment - 1,
                });
              }
              console.log("Comment count decremented successfully!");
            }
          } catch (e) {
            console.error("Error updating document: ", e);
          }
        } else if (category === "ตอบกลับ") {
          try {
            if (docSnapshot.exists()) {
              if (suspended === undefined) {
                const data = docSnapshot.data();
                await updateDoc(docRefValue, {
                  reply: data.reply - 1,
                });
              }
              console.log("Reply count decremented successfully!");
            }
          } catch (e) {
            console.error("Error updating document: ", e);
          }
        }
      } catch (error) {
        console.error("Error getting document: ", error);
      } finally {
        if (section === "รีวิว") {
          alert(`${category} ${header} ได้ถูกลบแล้ว`);
          window.location.reload();
        } else if (section === "ถาม-ตอบ") {
          alert(`${category} ของคุณ ${name} ได้ถูกลบแล้ว`);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  const handleDelete = (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      `คุณยืนยันที่ต้องการจะลบ${category}นี้ใช่หรือไม่ ?`
    );
    if (confirmed) {
      try {
        if (section === "รีวิว") {
          if (category === "โพสต์") {
            const docRef = doc(db, "review", id);
            deleteProc(docRef);
          } else if (category === "คอมเมนท์") {
            const docRef = doc(db, "cmnt_review", id);
            const docRefValue = doc(db, "review", post_id);
            deleteProc(docRef, docRefValue);
          } else if (category === "ตอบกลับ") {
            const docRef = doc(db, "reply_review", id);
            const docRefValue = doc(db, "cmnt_review", cmnt_id);
            deleteProc(docRef, docRefValue);
          }
        } else if (section === "ถาม-ตอบ") {
          if (category === "โพสต์") {
            const docRef = doc(db, "question", id);
            deleteProc(docRef);
          } else if (category === "คอมเมนท์") {
            const docRef = doc(db, "cmnt_question", id);
            const docRefValue = doc(db, "question", post_id);
            deleteProc(docRef, docRefValue);
          } else if (category === "ตอบกลับ") {
            const docRef = doc(db, "reply_question", id);
            const docRefValue = doc(db, "cmnt_question", cmnt_id);
            deleteProc(docRef, docRefValue);
          }
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  async function suspendedProc(docRef, docRefValue) {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().status !== undefined) {
        alert(`${category}ได้ถูกระงับอยู่แล้ว`);
      } else {
        await updateDoc(docRef, {
          status: 1,
        });
        try {
          const docSnapshot = await getDoc(docRefValue);
          if (category === "คอมเมนท์") {
            try {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                updateDoc(docRefValue, {
                  comment: data.comment - 1,
                });
                console.log("Comment count decremented successfully!");
              }
            } catch (e) {
              console.error("Error updating document: ", e);
            }
          } else if (category === "ตอบกลับ") {
            try {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                updateDoc(docRefValue, {
                  reply: data.reply - 1,
                });
                console.log("Reply count decremented successfully!");
              }
            } catch (e) {
              console.error("Error updating document: ", e);
            }
          }

          // Check Tag
          if (section === "รีวิว" && category === "โพสต์") {
            const tagDocRef = doc(db, "tag_ranked", tag);
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
              } else {
                alert("ไม่มีแท็กนี้อยู่ในระบบ");
              }
            });
          }
          // End of Check Tag
        } catch (error) {
          console.error("Error getting document: ", error);
        } finally {
          if (section === "รีวิว") {
            alert(`${category} ${header} ได้ถูกระงับแล้ว`);
          } else if (section === "ถาม-ตอบ") {
            alert(`${category} ของคุณ ${name} ได้ถูกระงับแล้ว`);
          }
          window.location.reload();
        }
        console.log("Suspended :", docRef.id);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการระงับ");
      console.error("Error Suspended : ", error);
    }
  }

  const handleSuspended = (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      `คุณยืนยันที่ต้องการจะระงับ${category}นี้ใช่หรือไม่ ?`
    );

    if (confirmed) {
      if (section === "รีวิว") {
        if (category === "โพสต์") {
          const docRef = doc(db, "review", id);
          suspendedProc(docRef);
        } else if (category === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_review", id);
          const docRefValue = doc(db, "review", post_id);
          suspendedProc(docRef, docRefValue);
        } else if (category === "ตอบกลับ") {
          const docRef = doc(db, "reply_review", id);
          const docRefValue = doc(db, "cmnt_review", cmnt_id);
          suspendedProc(docRef, docRefValue);
        }
      } else if (section === "ถาม-ตอบ") {
        if (category === "โพสต์") {
          const docRef = doc(db, "question", id);
          suspendedProc(docRef);
        } else if (category === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_question", id);
          const docRefValue = doc(db, "question", post_id);
          suspendedProc(docRef, docRefValue);
        } else if (category === "ตอบกลับ") {
          const docRef = doc(db, "reply_question", id);
          const docRefValue = doc(db, "cmnt_question", cmnt_id);
          suspendedProc(docRef, docRefValue);
        }
      }
    }
  };

  async function unsuspendedProc(docRef, docRefValue) {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().status !== undefined) {
        await updateDoc(docRef, {
          status: deleteField(),
        });
        try {
          const docSnapshot = await getDoc(docRefValue);
          if (category === "คอมเมนท์") {
            try {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                await updateDoc(docRefValue, {
                  comment: data.comment + 1,
                });
                console.log("Comment count incremented successfully!");
              }
            } catch (e) {
              console.error("Error updating document: ", e);
            }
          } else if (category === "ตอบกลับ") {
            try {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                await updateDoc(docRefValue, {
                  reply: data.reply + 1,
                });
                console.log("Reply count incremented successfully!");
              }
            } catch (e) {
              console.error("Error updating document: ", e);
            }
          }

          // Check Tag
          if (section === "รีวิว" && category === "โพสต์") {
            const tagDocRef = doc(db, "tag_ranked", tag);
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
                const newReviewDocRef = doc(reviewsCollectionRef, tag);

                const newReview = {
                  count: 1,
                };

                setDoc(newReviewDocRef, newReview)
                  .then(() => {
                    console.log(
                      "Document written with ID: ",
                      newReviewDocRef.id
                    );
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error);
                  });
              }
            });
          }
          // End of Check Tag
        } catch (error) {
          console.error("Error getting document: ", error);
        } finally {
          if (section === "รีวิว") {
            alert(`คุณอนุมัติ ${category} ${header} แล้ว`);
          } else if (section === "ถาม-ตอบ") {
            alert(`คุณอนุมัติ ${category} ของคุณ ${name} แล้ว`);
          }
          window.location.reload();
        }
      } else {
        alert(`${category}ได้รับการอนุมัติอยู่แล้ว`);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
      console.error("Error Approved : ", error);
    }
  }

  const handleUnsuspended = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      `คุณยืนยันที่ต้องการจะอนุมัติ${category}นี้ใช่หรือไม่ ?`
    );
    if (confirmed) {
      if (section === "รีวิว") {
        if (category === "โพสต์") {
          const docRef = doc(db, "review", id);
          unsuspendedProc(docRef);
        } else if (category === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_review", id);
          const docRefValue = doc(db, "review", post_id);
          unsuspendedProc(docRef, docRefValue);
        } else if (category === "ตอบกลับ") {
          const docRef = doc(db, "reply_review", id);
          const docRefValue = doc(db, "cmnt_review", cmnt_id);
          unsuspendedProc(docRef, docRefValue);
        }
      } else if (section === "ถาม-ตอบ") {
        if (category === "โพสต์") {
          const docRef = doc(db, "question", id);
          unsuspendedProc(docRef);
        } else if (category === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_question", id);
          const docRefValue = doc(db, "question", post_id);
          unsuspendedProc(docRef, docRefValue);
        } else if (category === "ตอบกลับ") {
          const docRef = doc(db, "reply_question", id);
          const docRefValue = doc(db, "cmnt_question", cmnt_id);
          unsuspendedProc(docRef, docRefValue);
        }
      }
    }
  };

  return (
    <div>
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
          <span>
            <img
              className="menu-dropdown"
              src={require("../../images/question/three_dots.svg").default}
              alt=""
            />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleDelete}>ลบ{category}</Dropdown.Item>
          {suspended === undefined ? (
            <Dropdown.Item onClick={handleSuspended}>
              ระงับ{category}
            </Dropdown.Item>
          ) : (
            <Dropdown.Item onClick={handleUnsuspended}>
              อนุมัติ{category}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

const AdminPost = ({ userData }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const [fullNames, setFullNames] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pull post
  const [allData, setAllData] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Review
        const reviewDocs = await getDocs(collection(db, "review"));
        const reviewData = reviewDocs.docs.map((doc) => ({
          id: doc.id,
          section: "รีวิว", // 0 = review, 1 = question
          category: "โพสต์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const cmntReviewDocs = await getDocs(collection(db, "cmnt_review"));
        const cmntReviewData = cmntReviewDocs.docs.map((doc) => ({
          id: doc.id,
          section: "รีวิว", // 0 = review, 1 = question
          category: "คอมเมนท์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const replyReviewDocs = await getDocs(collection(db, "reply_review"));
        const replyReviewData = replyReviewDocs.docs.map((doc) => ({
          id: doc.id,
          section: "รีวิว", // 0 = review, 1 = question
          category: "ตอบกลับ", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        // Question

        const questionDocs = await getDocs(collection(db, "question"));
        const questionData = questionDocs.docs.map((doc) => ({
          id: doc.id,
          section: "ถาม-ตอบ", // 0 = review, 1 = question
          category: "โพสต์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const cmntQuestionDocs = await getDocs(collection(db, "cmnt_question"));
        const cmntQuestionData = cmntQuestionDocs.docs.map((doc) => ({
          id: doc.id,
          section: "ถาม-ตอบ", // 0 = review, 1 = question
          category: "คอมเมนท์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const replyQuestionDocs = await getDocs(
          collection(db, "reply_question")
        );
        const replyQuestionData = replyQuestionDocs.docs.map((doc) => ({
          id: doc.id,
          section: "ถาม-ตอบ", // 0 = review, 1 = question
          category: "ตอบกลับ", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const mergedData = [
          ...reviewData,
          ...cmntReviewData,
          ...replyReviewData,
          ...questionData,
          ...cmntQuestionData,
          ...replyQuestionData,
        ];

        const mergedData2 = [
          ...reviewData,
          ...cmntReviewData,
          ...replyReviewData,
          ...questionData,
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

        const sortedData2 = mergedData2.sort((a, b) => {
          const reportComparison = b.report - a.report;
          if (reportComparison !== 0) {
            return reportComparison;
          } else {
            const dateComparison = b.date.localeCompare(a.date);
            if (dateComparison !== 0) {
              return dateComparison;
            } else {
              return b.time.localeCompare(a.time);
            }
          }
        });

        setAllData(sortedData);
        setReportData(sortedData2);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  // pull post

  return (
    <div className="adminpage">
      <Sidebar userData={userData} />
      <div className="adminhome">
        <div className="admin-title pt-5">
          <div className="text-title">
            <h3 className="px-4 admin-title">จัดการโพสต์</h3>
          </div>

          <div className="searchbox ms-4">
            <input
              className="searchInput ps-3"
              type="text"
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultActiveKey="post" className="Qtabs pt-4 px-4">
          <Tab className="pt-4 " eventKey="post" title="อนุมัติโพสต์">
            <div className="muitable px-4 pb-5">
              <ThemeProvider theme={theme}>
                <TableContainer className="" component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">วันที่โพสต์</TableCell>
                        <TableCell align="left">ข้อความ</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="left">ประเภท</TableCell>
                        <TableCell align="left">หมวดหมู่</TableCell>
                        <TableCell align="left">สถานะโพสต์</TableCell>
                        <TableCell align="left">การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allData
                        .filter(
                          (data) =>
                            data.content
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.date
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.section
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.category
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            (fullNames[data.id] &&
                              fullNames[data.id]
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()))
                        )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data) => (
                          <TableRow
                            key={data.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {data.date}
                            </TableCell>
                            <TableCell align="left">
                              <div
                                style={{
                                  wordWrap: "break-word",
                                  maxWidth: "300px",
                                }}
                              >
                                {data.content}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <MemberInfo
                                memberID={data.member_id}
                                onLoadFullName={(fullName) =>
                                  setFullNames((prev) => ({
                                    ...prev,
                                    [data.id]: fullName,
                                  }))
                                }
                              />
                              {data.name === undefined
                                ? fullNames[data.id]
                                : data.name}
                            </TableCell>
                            <TableCell align="left">{data.section}</TableCell>
                            <TableCell align="left">{data.category}</TableCell>
                            <TableCell align="left">
                              <h
                                style={{
                                  color:
                                    data.status === 1
                                      ? "#ed3419"
                                      : data.status === 0
                                      ? "#f7be3a"
                                      : "#17BF5F",
                                }}
                              >
                                {data.status === 1
                                  ? "ถูกระงับ"
                                  : data.status === 0
                                  ? "รอการอนุมัติ"
                                  : "อนุมัติแล้ว"}
                                {/* ตอนนี้ใช้แบบนี้ไปก่อน เพราะยังไม่ได้ทำ text sentiment ถ้ามีค่อยใส่ค่า status เพิ่มตอนโพสต์ */}
                              </h>
                            </TableCell>
                            <TableCell align="center">
                              <AlertDialogSlide
                                id={data.id}
                                post_id={data.post_id}
                                cmnt_id={data.cmnt_id}
                                header={data.header}
                                name={
                                  data.name === undefined
                                    ? fullNames[data.id]
                                    : data.name
                                }
                                section={data.section}
                                category={data.category}
                                suspended={data.status}
                                tag={data.tag}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          sx={{
                            ".MuiTablePagination-selectLabel": {
                              marginBottom: "0rem",
                            },

                            ".MuiTablePagination-displayedRows": {
                              marginBottom: "0rem",
                            },

                            ".MuiTablePagination-toolbar": {
                              borderTop: "1px solid #dedede",
                            },
                          }}
                          rowsPerPageOptions={[
                            10,
                            20,
                            30,
                            { label: "ทั้งหมด", value: -1 },
                          ]}
                          count={allData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              "aria-label": "จำนวนรายการต่อหน้า",
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </ThemeProvider>
            </div>
          </Tab>

          <Tab className="pt-4" eventKey="report" title="การรายงาน">
            <div className="muitable px-4 pb-5">
              <ThemeProvider theme={theme}>
                <TableContainer className="" component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">วันที่โพสต์</TableCell>
                        <TableCell align="left">ข้อความ</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="center">รายงาน</TableCell>
                        <TableCell align="left">ประเภท</TableCell>
                        <TableCell align="left">หมวดหมู่</TableCell>
                        <TableCell align="left">สถานะโพสต์</TableCell>
                        <TableCell align="center">การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData
                        .filter(
                          (data) =>
                            data.content
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.date
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.section
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.category
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            data.name
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            (fullNames[data.id] &&
                              fullNames[data.id]
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()))
                        )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data) => (
                          <TableRow
                            key={data.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {data.date}
                            </TableCell>
                            <TableCell align="left">
                              <div
                                style={{
                                  wordWrap: "break-word",
                                  maxWidth: "300px",
                                }}
                              >
                                {data.content}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <MemberInfo
                                memberID={data.member_id}
                                onLoadFullName={(fullName) =>
                                  setFullNames((prev) => ({
                                    ...prev,
                                    [data.id]: fullName,
                                  }))
                                }
                              />
                              {data.name === undefined
                                ? fullNames[data.id]
                                : data.name}
                            </TableCell>
                            <TableCell align="center">{data.report}</TableCell>
                            <TableCell align="left">{data.section}</TableCell>
                            <TableCell align="left">{data.category}</TableCell>
                            <TableCell align="left">
                              <h
                                style={{
                                  color:
                                    data.status === 1
                                      ? "#ed3419"
                                      : data.status === 0
                                      ? "#f7be3a"
                                      : "#17BF5F",
                                }}
                              >
                                {data.status === 1
                                  ? "ถูกระงับ"
                                  : data.status === 0
                                  ? "รอการอนุมัติ"
                                  : "อนุมัติแล้ว"}
                                {/* ตอนนี้ใช้แบบนี้ไปก่อน เพราะยังไม่ได้ทำ text sentiment ถ้ามีค่อยใส่ค่า status เพิ่มตอนโพสต์ */}
                              </h>
                            </TableCell>
                            <TableCell align="center">
                              <AlertDialogSlide
                                id={data.id}
                                post_id={data.post_id}
                                cmnt_id={data.cmnt_id}
                                header={data.header}
                                name={
                                  data.name === undefined
                                    ? fullNames[data.id]
                                    : data.name
                                }
                                section={data.section}
                                category={data.category}
                                suspended={data.status}
                                tag={data.tag}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          sx={{
                            ".MuiTablePagination-selectLabel": {
                              marginBottom: "0rem",
                            },

                            ".MuiTablePagination-displayedRows": {
                              marginBottom: "0rem",
                            },

                            ".MuiTablePagination-toolbar": {
                              borderTop: "1px solid #dedede",
                            },
                          }}
                          rowsPerPageOptions={[
                            5,
                            10,
                            20,
                            { label: "ทั้งหมด", value: -1 },
                          ]}
                          count={reportData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              "aria-label": "จำนวนรายการต่อหน้า",
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </ThemeProvider>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

function MemberInfo({ memberID, onLoadFullName }) {
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

  useEffect(() => {
    if (memberData) {
      const fullName = `${memberData.fname} ${memberData.lname}`;
      onLoadFullName(fullName);
    }
  }, [memberData]);

  return <></>;
}

export default AdminPost;
