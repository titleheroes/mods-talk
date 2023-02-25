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

import "../../styles/login.css";
import picSignup from "../../images/login/pic-signup.png";
import icon from "../../images/icon.svg";

const theme = createTheme({
  typography: {
    fontFamily: "Kanit",
  },
});

export default function DataUser() {
  const matches = useMediaQuery("(min-width:1024px)");
  const [faculty, setFaculty] = React.useState("");

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

  const handleChange = (event) => {
    setFaculty(event.target.value);
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
                        id="firstname"
                        label="ชื่อ"
                        name="firstname"
                        autoComplete="firstname"
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
                        id="lastname"
                        label="นามสกุล"
                        name="lastname"
                        autoComplete="lastname"
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
                        id="idstudent"
                        label="รหัสนักศึกษา"
                        name="idstudent"
                        autoComplete="idstudent"
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
                      <Box>

                        <FormControl sx={{ display: "flex", justifyContent: "space-around", flexDirection: "row"}}>
                          <InputLabel id="demo-simple-select-label">
                            คณะ
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={faculty}
                            label="Faculty"
                            onChange={handleChange}
                          >
                            <MenuItem value={10}>คณะวิศวกรรมศาสตร์</MenuItem>
                            <MenuItem value={20}>
                              คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี
                            </MenuItem>
                            <MenuItem value={30}>คณะวิทยศาสตร์</MenuItem>
                            <MenuItem value={40}>
                              สถาบันวิทยาการหุ่นยนต์ภาคสนาม
                            </MenuItem>
                            <MenuItem value={50}>
                              คณะสถาปัตยกรรมศาสตร์และการออกแบบ
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
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
                        ลงทะเบียน
                      </Button>
                    </div>
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
