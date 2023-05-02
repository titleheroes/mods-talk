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

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";

import { createTheme, ThemeProvider } from "@mui/material";
import { auth, db } from "../../config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Modal } from "react-bootstrap";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialogSlide({ id, fullname, suspended }) {
  const [buttonStatus, setButtonStatus] = useState(true);
  const [show, setShow] = useState(false);

  const [selectedOption, setSelectedOption] = useState("เลือก");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const finishClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function checkInfo() {
    if (selectedOption === "เลือก") {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  }

  function handleClose(event) {
    setShow(false);
    setButtonStatus(true);
    setSelectedOption("เลือก");
  }

  const handleSubmitRole = (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะเปลี่ยนบทบาทใช่หรือไม่ ?"
    );

    if (confirmed) {
      const docRef = doc(db, "admin", id);
      if (selectedOption === "แอดมิน") {
        try {
          setDoc(docRef, {
            level: "admin",
          }).then(() => {
            alert(`คุณ ${fullname} ถูกปรับบทบาทให้เป็นแอดมินแล้ว`);
            setSelectedOption("เลือก");
            console.log("Changed level of admin :", docRef.id);
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      } else if (selectedOption === "สมาชิก") {
        try {
          deleteDoc(docRef).then(() => {
            alert(`คุณ ${fullname} ถูกปรับบทบาทให้เป็นสมาชิกแล้ว`);
            setSelectedOption("เลือก");
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    }
  };

  const handleShowDel = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะระงับสมาชิกคนนี้ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;

      const docRef = doc(db, "admin", currentUserId);
      const memberRef = doc(db, "member", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const level = docSnap.data().level;
        if (level === "superadmin" && !isSuperAdmin) {
          alert("คุณไม่สามารถระงับบัญชีซูเปอร์แอดมินได้");
        } else {
          try {
            const memberDocSnap = await getDoc(memberRef);
            if (memberDocSnap.exists() && memberDocSnap.data().suspended) {
              alert("บัญชีนี้ถูกระงับแล้ว");
            } else {
              await updateDoc(memberRef, {
                suspended: 1,
              });
              alert(`คุณระงับบัญชี ${fullname} แล้ว`);
              console.log("Suspended User :", memberRef.id);
              window.location.reload();
            }
          } catch (error) {
            alert("เกิดข้อผิดพลาดในการระงับบัญชี");
            console.error("Error Suspended : ", error);
          }
        }
      }
    }
  };

  const handleUnsuspended = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      "คุณยืนยันที่ต้องการจะปลดระงับสมาชิกคนนี้ใช่หรือไม่ ?"
    );

    if (confirmed) {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;

      const docRef = doc(db, "admin", currentUserId);
      const memberRef = doc(db, "member", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const level = docSnap.data().level;
        if (level === "superadmin" && !isSuperAdmin) {
          alert("คุณไม่สามารถระงับบัญชีซูเปอร์แอดมินได้");
        } else {
          try {
            const memberDocSnap = await getDoc(memberRef);
            if (memberDocSnap.exists() && memberDocSnap.data().suspended) {
              await updateDoc(memberRef, {
                suspended: 0,
              });
              alert(`คุณปลดระงับบัญชี ${fullname} แล้ว`);
              console.log("Suspended User :", memberRef.id);
              window.location.reload();
            }
          } catch (error) {
            alert("เกิดข้อผิดพลาดในการระงับบัญชี");
            console.error("Error Suspended : ", error);
          }
        }
      }
    }
  };

  // ดึงข้อมูลแอดมิน
  useEffect(() => {
    try {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;
      const docRef = doc(db, "admin", currentUserId);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const level = docSnap.data().level;
          if (level === "superadmin") {
            setIsSuperAdmin(true);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);
  // ดึงข้อมูลแอดมิน

  useEffect(() => {
    checkInfo();
  });

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
          {isSuperAdmin ? (
            <Dropdown.Item onClick={handleShow}>แก้ไขบทบาท</Dropdown.Item>
          ) : (
            <div></div>
          )}
          {suspended === 1 ? (
            <Dropdown.Item onClick={handleUnsuspended}>
              ปลดระงับสมาชิก
            </Dropdown.Item>
          ) : (
            <Dropdown.Item onClick={handleShowDel}>ระงับสมาชิก</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="question-modal"
      >
        <form onSubmit={handleSubmitRole}>
          <div className="modal-header question-modal-header pt-4">
            <h1
              className="modal-title question-modal-title fs-5 ps-2 "
              id="exampleModalLabel"
            >
              แก้ไขบทบาท
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
            <text className="modal-topic ">เลือกบทบาท</text>
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
                      setSelectedOption("สมาชิก");
                      checkInfo();
                    }}
                  >
                    สมาชิก
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedOption("แอดมิน");
                      checkInfo();
                    }}
                  >
                    แอดมิน
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
              ยืนยันการเปลี่ยนบทบาท
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const AdminUser = ({ userData }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pull memberData
  const [memberData, setMemberData] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberRef = collection(db, "member");
        const querySnapshot = await getDocs(memberRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedData = data.sort((a, b) => a.code.localeCompare(b.code));
        setMemberData(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMembers();
    console.log(memberData);
  }, []);
  // pull memberData

  return (
    <div className="adminpage">
      <Sidebar userData={userData} />
      <div className="adminhome">
        <div className="admin-title pt-5">
          <div className="text-title">
            <h3 className="px-4 admin-title">จัดการข้อมูลผู้ใช้งาน</h3>
          </div>

          <div className="searchbox ms-4">
            <SearchIcon />
            <input
              className="searchInput ps-3"
              type="text"
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultActiveKey="all" className="Qtabs pt-4 px-4">
          <Tab className="pt-4 " eventKey="all" title="ทั้งหมด">
            <div className="muitable px-4 pb-5">
              <ThemeProvider theme={theme}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 500 }}
                    aria-label="custom pagination table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          รหัสนักศึกษา/รหัสประจำตัว
                        </TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="left">คณะ</TableCell>
                        <TableCell align="left">สาขา/ตำแหน่ง</TableCell>
                        <TableCell align="left">อีเมล</TableCell>
                        <TableCell align="left">วันที่สมัคร</TableCell>
                        <TableCell align="center">การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? memberData
                            .filter((data) => {
                              const searchValue = searchQuery
                                .trim()
                                .toLowerCase();
                              if (searchValue === "") return true;
                              return (
                                data.code.toString().includes(searchValue) ||
                                data.fname
                                  .toLowerCase()
                                  .includes(searchValue) ||
                                data.lname
                                  .toLowerCase()
                                  .includes(searchValue) ||
                                data.fac.toLowerCase().includes(searchValue) ||
                                data.pos.toLowerCase().includes(searchValue) ||
                                data.email
                                  .toLowerCase()
                                  .includes(searchValue) ||
                                data.date.toLowerCase().includes(searchValue)
                              );
                            })
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                        : memberData
                      ).map((data) => (
                        <TableRow
                          key={data.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{data.code}</TableCell>
                          <TableCell align="left">
                            {data.fname} {data.lname}
                          </TableCell>
                          <TableCell align="left">{data.fac}</TableCell>
                          <TableCell align="left">{data.pos}</TableCell>
                          <TableCell align="left">{data.email}</TableCell>
                          <TableCell align="left">{data.date}</TableCell>
                          <TableCell align="center">
                            <AlertDialogSlide
                              id={data.id}
                              fullname={data.fname + " " + data.lname}
                              suspended={data.suspended}
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
                          count={memberData.length}
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

          <Tab className="pt-4" eventKey="student" title="นักศึกษา">
            <div className="muitable px-4 pb-5">
              <ThemeProvider theme={theme}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 500 }}
                    aria-label="custom pagination table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">รหัสนักศึกษา</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="left">คณะ</TableCell>
                        <TableCell align="left">สาขา</TableCell>
                        <TableCell align="left">อีเมล</TableCell>
                        <TableCell align="left">วันที่สมัคร</TableCell>
                        <TableCell align="left">การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberData
                        .filter((data) => {
                          const searchValue = searchQuery.trim().toLowerCase();
                          if (searchValue === "") return true;
                          return (
                            data.code.toString().includes(searchValue) ||
                            data.fname.toLowerCase().includes(searchValue) ||
                            data.lname.toLowerCase().includes(searchValue) ||
                            data.fac.toLowerCase().includes(searchValue) ||
                            data.pos.toLowerCase().includes(searchValue) ||
                            data.email.toLowerCase().includes(searchValue) ||
                            data.date.toLowerCase().includes(searchValue)
                          );
                        })
                        .filter((data) => data.type === "0")
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
                            <TableCell align="center">{data.code}</TableCell>
                            <TableCell align="left">
                              {data.fname} {data.lname}
                            </TableCell>
                            <TableCell align="left">{data.fac}</TableCell>
                            <TableCell align="left">{data.pos}</TableCell>
                            <TableCell align="left">{data.email}</TableCell>
                            <TableCell align="left">{data.date}</TableCell>
                            <TableCell align="center">
                              <AlertDialogSlide name={data.fullname} />
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
                          count={memberData.length}
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

          <Tab className="pt-4" eventKey="employee" title="บุคลากรภายใน">
            <div className="muitable px-4 pb-5">
              <ThemeProvider theme={theme}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 500 }}
                    aria-label="custom pagination table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">รหัสประจำตัว</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="left">คณะ</TableCell>
                        <TableCell align="left">ตำแหน่ง</TableCell>
                        <TableCell align="left">อีเมล</TableCell>
                        <TableCell align="left">วันที่สมัคร</TableCell>
                        <TableCell align="left">การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberData
                        .filter((data) => {
                          const searchValue = searchQuery.trim().toLowerCase();
                          if (searchValue === "") return true;
                          return (
                            data.code.toString().includes(searchValue) ||
                            data.fname.toLowerCase().includes(searchValue) ||
                            data.lname.toLowerCase().includes(searchValue) ||
                            data.fac.toLowerCase().includes(searchValue) ||
                            data.pos.toLowerCase().includes(searchValue) ||
                            data.email.toLowerCase().includes(searchValue) ||
                            data.date.toLowerCase().includes(searchValue)
                          );
                        })
                        .filter((data) => data.type === "1")
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
                            <TableCell align="center">{data.code}</TableCell>
                            <TableCell align="left">
                              {data.fname} {data.lname}
                            </TableCell>
                            <TableCell align="left">{data.fac}</TableCell>
                            <TableCell align="left">{data.pos}</TableCell>
                            <TableCell align="left">{data.email}</TableCell>
                            <TableCell align="left">{data.date}</TableCell>
                            <TableCell align="center">
                              <AlertDialogSlide name={data.fullname} />
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
                          count={memberData.length}
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

export default AdminUser;
