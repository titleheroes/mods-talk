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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import "../../styles/login.css";
import picLogin from "../../images/login/admin_login.png";
import icon from "../../images/icon.svg";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../config.js";
import { doc, getDoc } from "firebase/firestore";

const theme = createTheme({
  typography: {
    fontFamily: "Kanit",
  },
});

export default function SignInSide() {
  const matches = useMediaQuery("(min-width:1024px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  let width;
  if (matches) {
    width = "60%";
  } else {
    width = "100%";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      email,
      password,
    });

    let domain = email.substring(email.lastIndexOf("@"));
    console.log("Right Format");
    if (domain === "@mail.kmutt.ac.th" || domain === "@kmutt.ac.th") {
      try {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const isEmailVerified = userCredential.user.emailVerified;
            if (isEmailVerified) {
              const uid = userCredential.user.uid;
              const docRef = doc(db, "admin", uid);
              getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                  window.location.href = "/admin/user";
                } else {
                  alert("คุณไม่ได้เป็น แอดมิน");
                  signOut(auth);
                }
              });
            } else {
              signOut(auth);
              alert("คุณยังไม่ได้ยืนยันอีเมลล์");
              console.log("No Verified");
            }
          })
          .catch((error) => {
            alert("อีเมลหรือพาสเวิร์ดผิด.");
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert(
        "กรุณาล็อคอินด้วยอีเมลสกุลมหาวิทยาลัย @mail.kmutt.ac.th หรือ @kmutt.ac.th"
      );
      console.error("Bruh");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

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
              backgroundImage: `url(${picLogin})`,
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
                        style={{ width: "25%", maxWidth: "60px" }}
                      ></img>{" "}
                      ยินดีต้อนรับเข้าสู่ระบบแอดมิน
                    </Typography>
                  </div>

                  <Typography
                    component="subtitle1"
                    variant="subtitle1"
                    sx={{ mt: 2, color: "#556070", fontWeight: "400" }}
                  >
                    โปรดกรอกรายละเอียดในการเข้าสู่ระบบสำหรับ
                    แอดมินของเว็บไซต์มดส์-ทอล์ค
                  </Typography>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{
                      mt: 1,
                      // backgroundColor: "pink",
                      width: "100%",
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
                        id="email"
                        label="อีเมลสำหรับแอดมิน"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        sx={{
                          width,
                        }}
                        onChange={(e) => setEmail(e.target.value)}
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

                        name="password"
                        label="พาสเวิร์ด"
                        // type="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        sx={{
                          width,
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibilityoutlined"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOutlined />
                                ) : (
                                  <VisibilityOffOutlined />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                      >
                        เข้าสู่ระบบ
                      </Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // backgroundColor: "green",
                      }}
                    >
                      <div
                        className="element.style"
                        style={{
                          width,
                          // backgroundColor: "orange",
                          textAlign: "right",
                        }}
                      >
                        <Link
                          to="/admin/forgetpassword"
                          style={{
                            fontWeight: "600",
                            color: "#132238",
                            textDecorationLine: "underline",
                          }}
                        >
                          ลืมรหัสผ่าน
                        </Link>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>
                  </Box>
                </Box>
              </div>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
