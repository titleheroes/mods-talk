import * as React from "react";
import { useState, useEffect } from "react";
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
// import picLogin from "../../images/login/pic-login.png";
import picSignup from "../../images/login/pic-signup.png";
import icon from "../../images/icon.svg";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { auth } from "../../config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <div>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        className="css-og50xi-MuiTypography-root"
        style={{ fontFamily: "Kanit", color: "#132238" }}
        {...props}
      >
        มีบัญชีผู้ใช้งานแล้วใช่หรือไม่? &nbsp;
        <Link
          to="/login"
          style={{
            fontWeight: "600",
            color: "#132238",
            textDecorationLine: "underline",
          }}
        >
          เข้าสู่ระบบที่นี่
        </Link>
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        className="css-og50xi-MuiTypography-root pt-3"
        style={{ fontFamily: "Kanit", color: "#132238" }}
        {...props}
      >
        <Link
          to="/"
          style={{
            fontWeight: "600",
            color: "#132238",
            textDecorationLine: "underline",
          }}
        >
          กลับสู่หน้าหลัก
        </Link>
      </Typography>
    </div>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: "Kanit",
  },
});

export default function SignUp() {
  const matches = useMediaQuery("(min-width:1024px)");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  let width;
  if (matches) {
    width = "60%";
  } else {
    width = "100%";
  }

  const validatePassword = () => {
    if (password.length < 6) {
      setConfirmPasswordError("พาสเวิร์ดจำเป็นต้องมีมากกว่า 6 ตัวอักษร");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("พาสเวิร์ดไม่ตรงกัน");
    } else {
      setConfirmPasswordError("");
    }
  };

  useEffect(() => {
    validatePassword();
  }, [password, confirmPassword]);

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
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            sendEmailVerification(userCredential.user)
              .then(() => {
                console.log("emai-sent");
                navigate("/authenticate", { state: { email: email } });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert(
        "จำกัดสิทธิ์อีเมลสกุล @mail.kmutt.ac.th หรือ @kmutt.ac.th เท่านั้นที่ใช้ในการสมัคร"
      );
    }
  };

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
                      สร้างบัญชีผู้ใช้งาน
                    </Typography>
                  </div>

                  <Typography
                    component="subtitle1"
                    variant="subtitle1"
                    className="descWidth"
                    sx={{ mt: 2, color: "#556070", fontWeight: "400" }}
                  >
                    จำกัดสิทธิ์อีเมลสกุล @mail.kmutt.ac.th หรือ @kmutt.ac.th
                    เท่านั้นที่ใช้ในการสมัคร
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
                        label="อีเมลมหาวิทยาลัย"
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
                        value={password}
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
                                onClick={() => {
                                  setShowPassword(!showPassword);
                                  validatePassword();
                                }}
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
                      <TextField
                        margin="normal"
                        // required
                        name="confirmpassword"
                        label="ยืนยันพาสเวิร์ด"
                        // type="password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        id="confirmpassword"
                        autoComplete="current-password"
                        sx={{
                          width,
                        }}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          validatePassword();
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibilityoutlined"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
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
                      {confirmPasswordError && <p>{confirmPasswordError}</p>}
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
                        disabled={confirmPasswordError}
                        sx={{ mt: 3, mb: 2 }}
                        style={{
                          backgroundColor: "#F04E22",
                          width,
                          height: "3em",
                        }}
                      >
                        สมัครสมาชิก
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
                      <div class="line" style={{ width }}>
                        <span class="text-inside-line">
                          <Typography component="body3" variant="body3">
                            or
                          </Typography>
                        </span>
                      </div>
                    </div>

                    <Copyright sx={{ mt: 5 }} />
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
