import React, { useState } from "react";
import "../styles/home.css";
import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { Dropdown } from "react-bootstrap";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const Review = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="pagePadding">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="container" style={{ backgroundColor: "yellow" }}>
                <div className="row">
                  <div className="col-9">
                    <Tabs value={value} onChange={handleChange}>
                      <Tab label="ทั้งหมด" id="tab-0" />
                      <Tab label="วิชาเรียน" id="tab-1" />
                      <Tab label="อาจารย์" id="tab-2" />
                      <Tab label="ร้านอาหาร" id="tab-3" />
                      <Tab label="หอพัก" id="tab-4" />
                      <Tab label="สถานที่ฝึกงาน" id="tab-5" />
                    </Tabs>
                  </div>
                  <div className="col">
                    <div className="float-end"></div>
                  </div>
                </div>
              </div>
              <div>
                <TabPanel value={value} index={0}>
                  <div>Content for Tab 1 goes here.</div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <div>Content for Tab 2 goes here.</div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <div>Content for Tab 3 goes here.</div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <div>Content for Tab 4 goes here.</div>
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <div>Content for Tab 5 goes here.</div>
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <div>Content for Tab 6 goes here.</div>
                </TabPanel>
              </div>
            </div>

            <div className="col-md">
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
