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
// import picLogin from "../../images/login/pic-login.png";
import picSignup from "../../images/login/admin_login.png";
// import icon from "../../images/icon.svg";
import mailrun from "../../images/mail.svg";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

import { Link, useLocation } from "react-router-dom";

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
      <br></br>
      <br></br>
      <Link
        to="/admin/login"
        style={{
          fontWeight: "600",
          color: "#132238",
          textDecorationLine: "underline",
        }}
      >
        กลับสู่หน้าล็อคอิน
      </Link>
    </Typography>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: "Kanit",
  },
});

export default function ForgetPassSent() {
  const location = useLocation();
  const email = location.state?.email;

  console.log(email);

  const matches = useMediaQuery("(min-width:1024px)");

  let width;
  if (matches) {
    width = "60%";
  } else {
    width = "100%";
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
                  <img
                    className="mailWidth"
                    src={mailrun}
                    alt="icon svg"
                    // style={{ width: "25%" }}
                  ></img>
                  <br></br>
                  <div>
                    <Typography
                      component="h5"
                      variant="h5"
                      sx={{ fontWeight: "600" }}
                    >
                      ขั้นตอนการกู้รหัสผ่าน
                    </Typography>
                  </div>

                  <Typography
                    component="subtitle1"
                    variant="subtitle1"
                    className="descWidth"
                    sx={{ mt: 2, color: "#556070", fontWeight: "400" }}
                  >
                    ระบบได้ส่งขั้นตอนการกู้รหัสไปยังอีเมลของท่านแล้ว
                    กรุณากดยืนยันที่อีเมล
                  </Typography>

                  <Box
                    component="form"
                    noValidate
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
                      <div>
                        <Typography
                          component="h6"
                          variant="h6"
                          className="testmail"
                          sx={{ fontWeight: "bold" }}
                        >
                          <br></br>
                          {/* apichaya.pleng@mail.kmutt.ac.th */}
                          {email}
                        </Typography>
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
