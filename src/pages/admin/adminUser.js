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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

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

function AlertDialogSlide(name) {
  const [open, setOpen] = React.useState(false);
  const username = name;
  const handleClickOpen = () => {
    setOpen(true);
    console.log(username);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button className="deleteUserButton" onClick={handleClickOpen}>
        <DeleteOutlineIcon />
      </button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"ยืนยันการลบบัญชีผู้ใช้"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            คุณแน่ใจหรือไม่ที่จะทำการลบบัญชีผู้ใช้นี้ ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="cancelDelButton" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button className="confirmDelButton" onClick={handleClose}>
            ยืนยันลบบัญชีผู้ใช้
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// function createData(
//   id,
//   code,
//   fullname,
//   faculty,
//   major,
//   email,
//   regis_date,
//   manage
// )

// {

//   return { id, code, fullname, faculty, major, email, regis_date, manage };
// }

// const rows = [
//   createData(
//     "0001",
//     61090500444,
//     "เมริสา อินทรเกียรติ",
//     "คณะวิทยาศาสตร์",
//     "วิทยาการคอมพิวเตอร์ประยุกต์",
//     "chanai.prommabuth@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0002",
//     61090525421,
//     "เมริสา อินทรเกียรติ",
//     "คณะวิทยาศาสตร์",
//     "วิทยาการคอมพิวเตอร์ประยุกต์",
//     "saaira.ma@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0003",
//     61090521566,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "saaira.ma@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0004",
//     61090502156,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "saaira.ma@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0005",
//     61090500445,
//     "ธนารีย์ อรุณรุ่ง",
//     "คณะวิทยาศาสตร์",
//     "สถิติ",
//     "saaira.ma@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0006",
//     61090500447,
//     "ธนารีย์ อรุณรุ่ง",
//     "คณะวิทยาศาสตร์",
//     "สถิติ",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0007",
//     61090500442,
//     "ธนารีย์ อรุณรุ่ง",
//     "คณะวิทยาศาสตร์",
//     "วิทยาการคอมพิวเตอร์ประยุกต์",
//     "laila.aaa@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0010",
//     61090500562,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0011",
//     61090500562,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0012",
//     61090500562,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0013",
//     61090500562,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0014",
//     61090500562,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
//   createData(
//     "0015",
//     61090500562,
//     "แก้วขวัญ ปิติทัศน์",
//     "คณะวิทยาศาสตร์",
//     "คณิตศาสตร์",
//     "justin.piti@mail.kmutt.ac.th",
//     "15/10/2022",
//     "c"
//   ),
// ];

const AdminUser = ({ userData }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - memberData.length) : 0;

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
                        <TableCell align="left">การจัดการ</TableCell>
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
