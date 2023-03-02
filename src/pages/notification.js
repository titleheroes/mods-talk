import React, { useState } from "react";
import "../styles/notification.css";
import { Tabs, Tab, Dropdown, ListGroup } from "react-bootstrap";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { classes } from "istanbul-lib-coverage";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import { pink } from "@mui/material/colors";

const Review = () => {
  //Search Bar
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  //-----------

  //Sorting
  const [selectedOption, setSelectedOption] = useState("ทั้งหมด");

  const handleOptionSelect = (optionName) => {
    setSelectedOption(optionName);
  };
  //-----------

  return (
    <div className="page">
      <div className="row">
        <div className="col-md vertLine">
          <div className="left-content">
            <span className="qTitle">การแจ้งเตือน</span>
            <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
              <Tab className="pt-4" eventKey="all" title="ทั้งหมด">
                <div>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem alignItems="flex-start center">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              className="notiName"
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              วรรณดา แม็กซิมอฟ
                            </Typography>
                            &nbsp; &nbsp;
                            <Typography
                              className="notiText"
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              ได้ถูกใจต่อโพสต์
                            </Typography>
                            &nbsp; &nbsp;
                            <Typography
                              className="notiPost"
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              วิชานี้ GEN231 ดีมั้ยครับ อยากฟังรีวิจากพี่ๆ ครับ
                            </Typography>
                          </React.Fragment>
                        }
                        secondary= {
                          <Typography className="notiTime">
                             5 นาทีที่ผ่านมา
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </div>
              </Tab>

              <Tab className="pt-4" eventKey="no-ans" title="การตอบกลับ">
               
               <div>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem alignItems="flex-start center">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              className="notiName"
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              วรรณดา แม็กซิมอฟ
                            </Typography>
                            &nbsp; &nbsp;
                            <Typography
                              className="notiText"
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              ได้แสดงความคิดเห็นต่อโพสต์
                            </Typography>
                            &nbsp; &nbsp;
                            <Typography
                              className="notiPost"
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              วิชานี้ GEN231 ดีมั้ยครับ อยากฟังรีวิจากพี่ๆ ครับ
                            </Typography>
                          </React.Fragment>
                        }
                        secondary= {
                          <Typography className="notiTime">
                             10 นาทีที่ผ่านมา
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className="col-md-4">
          <div className="d-grid mx-auto right-content ">
            <button
              type="button"
              class="btn ask-button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              เริ่มต้นถามคำถาม
            </button>
            {/* <!-- Modal --> */}
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Modal title
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">...</div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="button" class="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tips ">
              <div class="row tipsTitle">
                <div class="col ">เคล็ดลับเครื่องมือ</div>

                <div class="col-2 close-button">
                  <img
                    className=""
                    src={require("../images/question/cross.svg").default}
                    alt=""
                  />
                </div>
              </div>

              <p className="tipsContent">
                {" "}
                คุณสามารถเริ่มถามคำถามจากปุ่มด้านบนนี้ หรือ
                ถ้าสงสัยเกี่ยวกับรายวิชา หอพัก สิ่งต่างๆ
                สามารถค้นหาสิ่งที่คุณอยากรู้ได้ที่แถบด้านล่างนี้เลย
              </p>
            </div>

            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาคำถาม"
              ></input>
            </div>

            <div className="search-tips">
              <text className="search-tips" id="s1">
                คลิก
              </text>
              <img
                className="search-icon"
                id="2"
                src={require("../images/question/search.svg").default}
                alt=""
              />

              <text className="search-tips" id="s2">
                และพิมพ์เกี่ยวกับสิ่งที่คุณอยากรู้เพื่อค้นหาคำถาม
                ที่ใกล้เคียงหรือหาคำตอบไปด้วยกัน
              </text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
