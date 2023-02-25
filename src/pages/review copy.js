import React, { useState } from "react";
import "../styles/review.css";
import { Tab, Tabs, Box, Select, MenuItem } from "@mui/material";
import { Dropdown } from "react-bootstrap";

function TabPanel(props) {
  const { children, value, index, sorting, ...other } = props;

  const sortedChildren = React.Children.toArray(children).sort((a, b) => {
    if (sorting === "asc") {
      return a.props.label.localeCompare(b.props.label);
    } else if (sorting === "desc") {
      return b.props.label.localeCompare(a.props.label);
    } else {
      return 0;
    }
  });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{sortedChildren}</Box>}
    </div>
  );
}

const Review = ({ onSearch }) => {
  //Tab and Sorting
  const [value, setValue] = useState(0);
  const [sorting, setSorting] = useState("none");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSortChange = (event) => {
    setSorting(event.target.value);
  };
  //-----------

  //Search Bar
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  //-----------

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div>
                <div className="row">
                  <div className="col-10">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="simple tabs example"
                    >
                      <Tab label="ทั้งหมด" id="tab-0" />
                      <Tab label="วิชาเรียน" id="tab-1" />
                      <Tab label="อาจารย์" id="tab-2" />
                      <Tab label="ร้านอาหาร" id="tab-3" />
                      <Tab label="หอพัก" id="tab-4" />
                      <Tab label="สถานที่ฝึกงาน" id="tab-5" />
                    </Tabs>
                  </div>
                  <div className="col-2">
                    <Select
                      className="float-end"
                      value={sorting}
                      onChange={handleSortChange}
                      sx={{ ml: 2 }}
                      label="Sort"
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </div>
                </div>

                <TabPanel value={value} index={0} sorting={sorting}>
                  {
                    <div className="row">
                      <div className="col-9">
                        <div className="body">
                          <span style={{ paddingRight: "1rem" }}>Prof</span>
                          วรรณดา แม็กซิมอฟ
                          <span style={{ paddingLeft: "1rem" }}>
                            4 วันที่ผ่านมา
                          </span>
                          <div style={{ paddingLeft: "1rem" }}></div>
                        </div>
                        <div>
                          <div className="homeHeader2">
                            วิชานี้ GEN231 ดีมั้ยครับ อยากฟังรีวิวจากพี่ๆ ครับ
                          </div>
                          <div className="text-limit body">
                            ผมเรียนอยู่ ปี 3 ภาควิชาคณิตศาสตร์ครับ
                            อยากทราบความเห็นของพี่ๆ ที่เรียนวิชานี้ปีที่แล้วครับ
                            ว่ามันดีไม่ดีอย่าง ไร มันดึงเกรดเยอะมั้ยครับ
                            พอดีไม่อยากให้เกรดตกครับผม
                          </div>
                          <div className="row" style={{ paddingTop: "1rem" }}>
                            <div className="col-2">
                              <div className="rectangle-container">
                                <div className="rectangle-border">
                                  <div className="rectangle-text">GEN231</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-10">
                              <div className="float-end">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <span style={{ paddingRight: "0.5rem" }}>
                                      <img
                                        src={
                                          require("../images/icon/chat.svg")
                                            .default
                                        }
                                        alt="chat svg"
                                      />
                                    </span>
                                    <span style={{ paddingRight: "1rem" }}>
                                      12
                                    </span>
                                    <span style={{ paddingRight: "0.5rem" }}>
                                      <img
                                        src={
                                          require("../images/icon/like.svg")
                                            .default
                                        }
                                        alt="like svg"
                                      />
                                    </span>
                                    <span style={{ paddingRight: "1rem" }}>
                                      512
                                    </span>
                                  </div>
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
                                      <span style={{ color: "black" }}>
                                        &bull;&bull;&bull;
                                      </span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                      <Dropdown.Item href="#">
                                        Option 1
                                      </Dropdown.Item>
                                      <Dropdown.Item href="#">
                                        Option 2
                                      </Dropdown.Item>
                                      <Dropdown.Item href="#">
                                        Option 3
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col">
                        <img
                          src={require("../images/example/1x1.png")}
                          alt="ex_1x1"
                          className="img-fluid float-end"
                        />
                      </div>
                      <div style={{ paddingTop: "1rem" }}>
                        <hr />
                      </div>
                    </div>
                  }
                </TabPanel>
                <TabPanel value={value} index={1} sorting={sorting}>
                  {<div>Part 2</div>}
                </TabPanel>
                <TabPanel value={value} index={2} sorting={sorting}>
                  {<div>Part 3</div>}
                </TabPanel>
                <TabPanel value={value} index={3} sorting={sorting}>
                  {<div>Part 4</div>}
                </TabPanel>
                <TabPanel value={value} index={4} sorting={sorting}>
                  {<div>Part 5</div>}
                </TabPanel>
                <TabPanel value={value} index={5} sorting={sorting}>
                  {<div>Part 6</div>}
                </TabPanel>
              </div>
            </div>
            <div className="col-md-1">
              <div className="vertical-line"></div>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="button"
                onClick=""
                style={{ width: "100%" }}
              >
                เริ่มต้นการเขียนโพสต์
              </button>
              <div style={{ paddingTop: "3rem" }}>
                <div className="search-container">
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                  />
                  <div className="search-icon">
                    <div>
                      <span>
                        <img
                          src={require("../images/icon/like.svg").default}
                          alt="like svg"
                        />
                      </span>
                      <span>hello</span>
                    </div>
                  </div>
                </div>
              </div>

              <img
                src={require("../images/home/main.png")}
                alt="main page png"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
