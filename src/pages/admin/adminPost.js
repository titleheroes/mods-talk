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

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

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
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
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

function createData(id, msg, fullname, post_date, post_status, report_count) {
  return { id, msg, fullname, post_date, post_status, report_count };
}

const rows = [
  createData(
    "0001",
    "เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร...",
    "เมริสา อินทรเกียรติ",
    "15/10/2022",
    "อนุมัติโพสต์แล้ว",
    "10"
  ),
  createData(
    "0002",
    "เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร...",
    "เมริสา อินทรเกียรติ",
    "15/10/2022",
    "อนุมัติโพสต์แล้ว",
    "5"
  ),
  createData(
    "0003",
    "ที่ถามเพราะหิวแสงหรอ ที่ถามเพราะหิวแสงหรอ ที่ถามเพราะหิวแสงหรอ ที่ถามเพราะหิวแสงหรอ",
    "แก้วขวัญ ปิติทัศน์",
    "15/10/2022",
    "รอการอนุมัติ",
    "6"
  ),
  createData(
    "0004",
    "อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี",
    "แก้วขวัญ ปิติทัศน์",
    "15/10/2022",
    "อนุมัติโพสต์แล้ว",
    "0"
  ),
  createData(
    "0005",
    "เบื่อว่ะ เรียนไปได้อะไรเลย เบื่อว่ะ เรียนไปได้อะไรเลย เบื่อว่ะ เรียนไปได้อะไรเลย",
    "ธนารีย์ อรุณรุ่ง",
    "15/10/2022",
    "รอการอนุมัติ",
    "7"
  ),
  createData(
    "0006",
    "อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี",
    "ธนารีย์ อรุณรุ่ง",
    "15/10/2022",
    "อนุมัติโพสต์แล้ว",
    "2"
  ),
  createData(
    "0007",
    "เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร...",
    "ธนารีย์ อรุณรุ่ง",
    "15/10/2022",
    "อนุมัติโพสต์แล้ว",
    "18"
  ),
];

function AlertDialogSlide({ id, header, section, type, suspended }) {
  let docRef;

  const handleDelete = (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      `คุณยืนยันที่ต้องการจะลบ${type}นี้ใช่หรือไม่ ?`
    );
    if (confirmed) {
      if (section === "รีวิว") {
        if (type === "โพสต์") {
          const docRef = doc(db, "review", id);
        } else if (type === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_review", id);
        } else if (type === "ตอบกลับ") {
          const docRef = doc(db, "reply_review", id);
        }
      } else if (section === "ถาม-ตอบ") {
        if (type === "โพสต์") {
          const docRef = doc(db, "question", id);
        } else if (type === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_question", id);
        } else if (type === "ตอบกลับ") {
          const docRef = doc(db, "reply_question", id);
        }
      }

      try {
        deleteDoc(docRef).then(() => {
          alert(`${type} ${header} ได้ถูกลบแล้ว`);
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleSuspended = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      `คุณยืนยันที่ต้องการจะระงับ${type}นี้ใช่หรือไม่ ?`
    );

    if (confirmed) {
      if (section === "รีวิว") {
        if (type === "โพสต์") {
          const docRef = doc(db, "review", id);
        } else if (type === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_review", id);
        } else if (type === "ตอบกลับ") {
          const docRef = doc(db, "reply_review", id);
        }
      } else if (section === "ถาม-ตอบ") {
        if (type === "โพสต์") {
          const docRef = doc(db, "question", id);
        } else if (type === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_question", id);
        } else if (type === "ตอบกลับ") {
          const docRef = doc(db, "reply_question", id);
        }
      }

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().status) {
          alert(`${type}ได้ถูกระงับอยู่แล้ว`);
        } else {
          await updateDoc(docRef, {
            status: 1,
          });
          alert(`คุณระงับ${type} ${header} แล้ว`);
          console.log("Suspended :", docRef.id);
          window.location.reload();
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการระงับ");
        console.error("Error Suspended : ", error);
      }
    }
  };

  const handleUnsuspended = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      `คุณยืนยันที่ต้องการจะอนุมัติ${type}นี้ใช่หรือไม่ ?`
    );

    if (confirmed) {
      if (section === "รีวิว") {
        if (type === "โพสต์") {
          const docRef = doc(db, "review", id);
        } else if (type === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_review", id);
        } else if (type === "ตอบกลับ") {
          const docRef = doc(db, "reply_review", id);
        }
      } else if (section === "ถาม-ตอบ") {
        if (type === "โพสต์") {
          const docRef = doc(db, "question", id);
        } else if (type === "คอมเมนท์") {
          const docRef = doc(db, "cmnt_question", id);
        } else if (type === "ตอบกลับ") {
          const docRef = doc(db, "reply_question", id);
        }
      }

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().status) {
          await updateDoc(docRef, {
            status: null,
          });
          alert(`คุณอนุมัติ${type} ${header} แล้ว`);
          console.log("Approved :", docRef.id);
          window.location.reload();
        } else {
          alert(`${type}ได้รับการอนุมัติอยู่แล้ว`);
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการอนุมัติ");
        console.error("Error Approved : ", error);
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
          <Dropdown.Item onClick={handleDelete}>ลบ{type}</Dropdown.Item>
          {suspended === 1 ? (
            <Dropdown.Item onClick={handleUnsuspended}>
              อนุมัติ{type}
            </Dropdown.Item>
          ) : (
            <Dropdown.Item onClick={handleSuspended}>ระงับ{type}</Dropdown.Item>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Review
        const reviewDocs = await getDocs(collection(db, "review"));
        const reviewData = reviewDocs.docs.map((doc) => ({
          id: doc.id,
          section: "รีวิว", // 0 = review, 1 = question
          type: "โพสต์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const cmntReviewDocs = await getDocs(collection(db, "cmnt_review"));
        const cmntReviewData = cmntReviewDocs.docs.map((doc) => ({
          id: doc.id,
          section: "รีวิว", // 0 = review, 1 = question
          type: "คอมเมนท์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const replyReviewDocs = await getDocs(collection(db, "reply_review"));
        const replyReviewData = replyReviewDocs.docs.map((doc) => ({
          id: doc.id,
          section: "รีวิว", // 0 = review, 1 = question
          type: "ตอบกลับ", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        // Question

        const questionDocs = await getDocs(collection(db, "question"));
        const questionData = questionDocs.docs.map((doc) => ({
          id: doc.id,
          section: "ถาม-ตอบ", // 0 = review, 1 = question
          type: "โพสต์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const cmntQuestionDocs = await getDocs(collection(db, "cmnt_question"));
        const cmntQuestionData = cmntQuestionDocs.docs.map((doc) => ({
          id: doc.id,
          section: "ถาม-ตอบ", // 0 = review, 1 = question
          type: "คอมเมนท์", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const replyQuestionDocs = await getDocs(
          collection(db, "reply_question")
        );
        const replyQuestionData = replyQuestionDocs.docs.map((doc) => ({
          id: doc.id,
          section: "ถาม-ตอบ", // 0 = review, 1 = question
          type: "ตอบกลับ", // 0 = post, 1 = cmnt, 2 = reply
          ...doc.data(),
        }));

        const mergedData = [
          ...reviewData,
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
        setAllData(sortedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  // pull post

  console.log(allData);

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
                            data.type
                              .toLowerCase()
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
                            <TableCell align="left">{data.content}</TableCell>
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
                              {fullNames[data.id]}
                            </TableCell>
                            <TableCell align="left">{data.section}</TableCell>
                            <TableCell align="left">{data.type}</TableCell>
                            <TableCell align="left">
                              {console.log(data.status)}
                              <h
                                style={{
                                  color:
                                    data.status === undefined
                                      ? "#17BF5F"
                                      : "#f7be3a",
                                }}
                              >
                                {data.status === undefined
                                  ? "อนุมัติแล้ว"
                                  : "ถูกระงับ"}
                                {/* ตอนนี้ใช้แบบนี้ไปก่อน เพราะยังไม่ได้ทำ text sentiment ถ้ามีค่อยใส่ค่า status เพิ่มตอนโพสต์ */}
                              </h>
                            </TableCell>
                            <TableCell align="center">
                              <AlertDialogSlide
                                id={data.id}
                                header={data.header}
                                section={data.section}
                                type={data.type}
                                suspended={data.status}
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
                          count={rows.length}
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
                        <TableCell align="center">
                          จำนวนครั้งที่โดนรายงาน
                        </TableCell>
                        <TableCell align="left">ประเภท</TableCell>
                        <TableCell align="left">สถานะโพสต์</TableCell>
                        <TableCell align="center">การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : rows
                      ).map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center" component="th" scope="row">
                            {row.post_date}
                          </TableCell>
                          <TableCell align="left">{row.msg}</TableCell>
                          <TableCell align="left" className="table-text">
                            <h className="table-text">{row.fullname}</h>
                          </TableCell>
                          <TableCell align="center">
                            {row.report_count}
                          </TableCell>
                          <TableCell align="left">{row.id}</TableCell>
                          <TableCell align="left">
                            <h
                              className="table-text"
                              style={{
                                color:
                                  row.post_status === "อนุมัติโพสต์แล้ว"
                                    ? "#17BF5F"
                                    : "#f7be3a",
                              }}
                            >
                              {row.post_status}
                            </h>
                          </TableCell>
                          <TableCell align="center">
                            <button className="deleteUserButton">
                              <DeleteOutlineIcon />
                            </button>
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
                          count={rows.length}
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
  }, [memberData, onLoadFullName]);

  return <></>;
}

export default AdminPost;
