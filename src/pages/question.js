import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';

import "../styles/question.css";
import { color } from "@mui/system";

const Question = () => {
  return (
    <div className="page">
      <div className="row">
        <div className="col-md vertLine">
          <div className="left-content">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">มดส์-ทอล์ค</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  ถาม-ตอบ
                </li>
              </ol>
            </nav>

            <span className="qTitle">ถาม-ตอบ</span>
            <Tabs defaultActiveKey="all" className="Qtabs pt-4 ">
              <Tab className="pt-4 " eventKey="all" title="ทั้งหมด">
                <div>
                  <p className="poster-name pb-3">ผู้ไม่ประสงค์ออกนาม</p>
                  <p className="pb-2">
                    ผมสงสัยครับ รบกวนผู้รู้ตอบผมทีว่า วิทยคอมของคณะ IT
                    กับคณะวิทย์ต่างกันยังไงครับ
                  </p>
                  <div className="post-detail row">
                    <div className="col-9">
                      <p className="post-date">10 มกราคม 2565</p>
                    </div>

                    <div className="col menu-group">
                      <div className="row">
                        <div className="col sub-menu">
                          <a href="" className="post-comment">
                            <img className="menu-pic"
                              src={
                                require("../images/question/chat_1.svg").default
                              }
                              alt=""
                            />
                            <text>10</text>
                            

                          </a>

                        </div>

                        <div className="col-2 sub-menu menu-dropdown">

                        <Dropdown>
      <Dropdown.Toggle variant="link" id="question-dropdown">
      <img
                            className="menu-dropdown"
                            src={
                              require("../images/question/three_dots.svg")
                                .default
                            }
                            alt=""
                          />
                        
      </Dropdown.Toggle>

      <Dropdown.Menu >
        <Dropdown.Item href="#/action-1">Report Post</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Delete Post</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu >
    </Dropdown>    
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab
                className="pt-5"
                eventKey="no-ans"
                title="คำถามที่ไม่มีคำตอบ"
              >
                ่าาาาาา
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className="col-md-4">


          <div className="d-grid mx-auto right-content ">

            <button type="button"  class="btn ask-button" data-bs-toggle="modal" data-bs-target="#exampleModal">เริ่มต้นถามคำถาม</button>
            {/* <!-- Modal --> */}
          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  ...
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>




            <div className="tips ">

            <div class="row tipsTitle">

              <div class="col ">
                เคล็ดลับเครื่องมือ
              </div>
                          

              <div class="col-2 close-button">
              <img
                    className=""
                    src={
                      require("../images/question/cross.svg")
                        .default
                    }
                    alt=""
                />
              </div>             
            </div>


              
             
              

              <p className="tipsContent">     คุณสามารถเริ่มถามคำถามจากปุ่มด้านบนนี้ 
                หรือ ถ้าสงสัยเกี่ยวกับรายวิชา หอพัก สิ่งต่างๆ
                สามารถค้นหาสิ่งที่คุณอยากรู้ได้ที่แถบด้านล่างนี้เลย
              </p>
              
              </div>
              
              <div className="search-box">
                <input type="text" className="form-control" placeholder="ค้นหาคำถาม" ></input>
              </div>

              <div className="search-tips">
                <text className="search-tips" id="s1" >คลิก</text>
                <img
                    className="search-icon"
                    id="2"
                    src={
                      require("../images/question/search.svg")
                        .default
                    }
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

export default Question;
