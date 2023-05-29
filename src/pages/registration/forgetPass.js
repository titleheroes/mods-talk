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
import picLogin from "../../images/login/pic-login.png";
import icon from "../../images/icon.svg";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config.js";

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
        ต้องการกลับไปเข้าสู่ระบบ &nbsp;
        <Link
          to="/login"
          style={{
            fontWeight: "600",
            color: "#132238",
            textDecorationLine: "underline",
          }}
        >
          คลิกที่นี่
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

export default function ForgetPass() {
  const matches = useMediaQuery("(min-width:1024px)");

  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  let width;
  if (matches) {
    width = "60%";
  } else {
    width = "100%";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      sendPasswordResetEmail(auth, email).then(() => {
        navigate("/forgetpassword/sent", { state: { email: email } });
      });
    } catch (error) {
      console.error(error);
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
                      กู้รหัสผ่าน
                    </Typography>
                  </div>

                  <Typography
                    component="subtitle1"
                    variant="subtitle1"
                    sx={{ mt: 2, color: "#556070", fontWeight: "400" }}
                  >
                    กรอกอีเมลมหาวิทยาลัย แล้วกด "ต่อไป" เพื่อกู้รหัสผ่าน
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
                        ต่อไป
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
