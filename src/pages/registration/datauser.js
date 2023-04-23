import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import "../../styles/login.css";
import picSignup from "../../images/login/pic-signup.png";
import icon from "../../images/icon.svg";

import { auth, db } from "../../config.js";
import { Navigate, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const theme = createTheme({
  typography: {
    fontFamily: "Kanit",
  },
});

export default function DataUser() {
  const matches = useMediaQuery("(min-width:1024px)");
  const currentUser = auth.currentUser;
  const currentUserId = currentUser && currentUser.uid;
  const navigate = useNavigate();

  const [fullname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [studentid, setId] = useState("");
  const [faculty, setFac] = useState("");
  const [position, setPos] = useState("");
  const [types, setType] = useState("");
  const currentUserEmail = currentUser && currentUser.email;

  let width;
  if (matches) {
    width = "60%";
  } else {
    width = "100%";
  }

  async function createData(userID, userData) {
    try {
      const userRef = doc(db, "member", userID);
      await setDoc(userRef, userData);
      console.log("Member document with custom ID written with ID: ", userID);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      id: studentid,
      email: currentUserEmail,
      fname: fullname,
      lname: lastname,
      fac: faculty,
      pos: position,
      type: types,
      profile:
        "https://media.discordapp.net/attachments/718002735475064874/1091706761792200794/user.png",
    };
    createData(currentUserId, data)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(data);
  };

  const handleChange = (event) => {
    setFac(event.target.value);
  };

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="all">
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={false}
            md={7}
            sx={{
              backgroundImage: `url(${picSignup})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div className="boxCenter">
              <div className="container">
                <Box
                  sx={{
                    my: 8,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography
                      component="h5"
                      variant="h5"
                      sx={{ fontWeight: "600" }}
                    >
                      <img
                        className=""
                        src={icon}
                        alt="icon svg"
                        style={{ width: "25%" }}
                      ></img>{" "}
                      ลงทะเบียนผู้ใช้งาน
                    </Typography>
                  </div>
                  <div style={{ width: "100%" }}>
                    <Tabs
                      defaultActiveKey="student"
                      className="pt-4"
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Tab
                        className="pt-4"
                        eventKey="student"
                        title="นักศึกษา"
                        style={{ width: "100%" }}
                      >
                        <Box
                          component="form"
                          noValidate
                          onSubmit={handleSubmit}
                          sx={{
                            mt: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="firstname"
                              label="ชื่อ"
                              name="firstname"
                              autoComplete="firstname"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setFname(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="lastname"
                              label="นามสกุล"
                              name="lastname"
                              autoComplete="lastname"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setLname(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="idstudent"
                              label="รหัสนักศึกษา"
                              name="id"
                              autoComplete="id"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setId(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                mt: 2,
                                width,
                              }}
                            >
                              <FormControl
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <InputLabel
                                  id="demo-simple-select-label float-end"
                                  sx={{}}
                                >
                                  คณะ
                                </InputLabel>
                                <Select
                                  sx={{
                                    width: "100%",
                                  }}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={faculty}
                                  label="Faculty"
                                  onChange={handleChange}
                                >
                                  <MenuItem value={"วิศวกรรมศาสตร์"}>
                                    วิศวกรรมศาสตร์
                                  </MenuItem>
                                  <MenuItem
                                    value={"ครุศาสตร์อุตสาหกรรมและเทคโนโลยี"}
                                  >
                                    ครุศาสตร์อุตสาหกรรมและเทคโนโลยี
                                  </MenuItem>
                                  <MenuItem value={"วิทยาศาสตร์"}>
                                    วิทยาศาสตร์
                                  </MenuItem>
                                  <MenuItem
                                    value={"สถาบันวิทยาการหุ่นยนต์ภาคสนาม"}
                                  >
                                    สถาบันวิทยาการหุ่นยนต์ภาคสนาม
                                  </MenuItem>
                                  <MenuItem
                                    value={"สถาปัตยกรรมศาสตร์และการออกแบบ"}
                                  >
                                    สถาปัตยกรรมศาสตร์และการออกแบบ
                                  </MenuItem>
                                </Select>
                              </FormControl>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              ></div>
                            </Box>
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="position"
                              label="สาขา"
                              name="position"
                              autoComplete="position"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setPos(e.target.value)}
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              style={{
                                backgroundColor: "#F04E22",
                                width,
                                height: "3em",
                              }}
                              onClick={(e) => setType("0")}
                            >
                              ลงทะเบียน
                            </Button>
                          </div>
                        </Box>
                      </Tab>
                      <Tab
                        className="pt-4"
                        eventKey="teacher"
                        title="บุคลากรภายใน"
                      >
                        <Box
                          component="form"
                          noValidate
                          onSubmit={handleSubmit}
                          sx={{
                            mt: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="firstname"
                              label="ชื่อ"
                              name="firstname"
                              autoComplete="firstname"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setFname(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="lastname"
                              label="นามสกุล"
                              name="lastname"
                              autoComplete="lastname"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setLname(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="idstudent"
                              label="รหัสประจำตัว"
                              name="id"
                              autoComplete="id"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setId(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                mt: 2,
                                width,
                              }}
                            >
                              <FormControl
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <InputLabel
                                  id="demo-simple-select-label float-end"
                                  sx={{}}
                                >
                                  คณะ
                                </InputLabel>
                                <Select
                                  sx={{
                                    width: "100%",
                                  }}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={faculty}
                                  label="Faculty"
                                  onChange={handleChange}
                                >
                                  <MenuItem value={"วิศวกรรมศาสตร์"}>
                                    วิศวกรรมศาสตร์
                                  </MenuItem>
                                  <MenuItem
                                    value={"ครุศาสตร์อุตสาหกรรมและเทคโนโลยี"}
                                  >
                                    ครุศาสตร์อุตสาหกรรมและเทคโนโลยี
                                  </MenuItem>
                                  <MenuItem value={"วิทยาศาสตร์"}>
                                    วิทยาศาสตร์
                                  </MenuItem>
                                  <MenuItem
                                    value={"สถาบันวิทยาการหุ่นยนต์ภาคสนาม"}
                                  >
                                    สถาบันวิทยาการหุ่นยนต์ภาคสนาม
                                  </MenuItem>
                                  <MenuItem
                                    value={"สถาปัตยกรรมศาสตร์และการออกแบบ"}
                                  >
                                    สถาปัตยกรรมศาสตร์และการออกแบบ
                                  </MenuItem>
                                </Select>
                              </FormControl>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              ></div>
                            </Box>
                          </div>
                          <div
                            className="mt-2"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              margin="normal"
                              // required
                              id="position"
                              label="ตำแหน่ง"
                              name="position"
                              autoComplete="position"
                              autoFocus
                              sx={{
                                width,
                              }}
                              onChange={(e) => setPos(e.target.value)}
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              style={{
                                backgroundColor: "#F04E22",
                                width,
                                height: "3em",
                              }}
                              onClick={(e) => setType("1")}
                            >
                              ลงทะเบียน
                            </Button>
                          </div>
                        </Box>
                      </Tab>
                    </Tabs>
                  </div>
                </Box>
              </div>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
