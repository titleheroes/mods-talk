import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "../styles/login.css";
import picLogin from "../images/login/pic-login.png";
import icon from "../images/icon.svg";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      className="css-og50xi-MuiTypography-root"
      style={{ fontFamily: "Kanit", color: "#132238" }}
      {...props}
    >
      ยังไม่ได้ลงทะเบียนใช่หรือไม่? &nbsp;
      <Link color="inherit" href="https://mui.com/" sx={{ fontWeight: "600" }}>
        ลงทะเบียนที่นี่
      </Link>
    </Typography>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: "Kanit",
  },
});

export default function SignInSide() {
  const matches = useMediaQuery("(min-width:1024px)");

  let width;
  if (matches) {
    width = "60%";
  } else {
    width = "100%";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
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
                      style={{ width: "25%" }}
                    ></img>{" "}
                    ยินดีต้อนรับกลับ,
                  </Typography>
                </div>

                <Typography
                  component="subtitle1"
                  variant="subtitle1"
                  sx={{ mt: 2, color: "#556070", fontWeight: "400" }}
                >
                  ยินดีต้อนรับกลับ! นักศึกษาและบุคลากร มจธ.
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
                        href="#"
                        variant="body2"
                        color="#132238"
                        className="hover-forget"
                        // underline="hover"
                        style={{ width }}
                      >
                        {"ลืมรหัสผ่าน"}
                      </Link>
                    </div>
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
