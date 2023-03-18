import React from 'react'
import "../../styles/admin.css";
import Sidebar from "../../components/sidebar/sidebar";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';

import { createTheme, ThemeProvider } from '@mui/material';
const theme = createTheme({
    typography: {
    
    

      fontFamily: [
        'Kanit', 'sans-serif'
      ].join(','),
    },});


function createData(id, msg, fullname,post_date,post_status,report_count) {
    return { id, msg, fullname, post_date,post_status,report_count };
  }

  const rows = [
    createData('0001', 'เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร...', 'เมริสา อินทรเกียรติ','15/10/2022','อนุมัติโพสต์แล้ว','10'),
    createData('0002', 'เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร...', 'เมริสา อินทรเกียรติ','15/10/2022','อนุมัติโพสต์แล้ว','5'),
    createData('0003', 'ที่ถามเพราะหิวแสงหรอ ที่ถามเพราะหิวแสงหรอ ที่ถามเพราะหิวแสงหรอ ที่ถามเพราะหิวแสงหรอ', 'แก้วขวัญ ปิติทัศน์', '15/10/2022','รอการอนุมัติ','6'),
    createData('0004', 'อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี', 'แก้วขวัญ ปิติทัศน์', '15/10/2022','อนุมัติโพสต์แล้ว','0'),
    createData('0005', 'เบื่อว่ะ เรียนไปได้อะไรเลย เบื่อว่ะ เรียนไปได้อะไรเลย เบื่อว่ะ เรียนไปได้อะไรเลย', 'ธนารีย์ อรุณรุ่ง', '15/10/2022','รอการอนุมัติ','7'),
    createData('0006', 'อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี อยากได้การบ้านเยอะๆ ก็เอา ผมหนี', 'ธนารีย์ อรุณรุ่ง','15/10/2022','อนุมัติโพสต์แล้ว','2'),
    createData('0007', 'เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร เรียนไปก็มีแต่ทำให้เกรดตก แย่โคตร...', 'ธนารีย์ อรุณรุ่ง', '15/10/2022','อนุมัติโพสต์แล้ว','18'),
    

   
  ];



const adminPost = () => {
  return (
    <div className='adminpage'>
        <Sidebar/>
        <div className="adminhome">
            
                <div className='admin-title pt-3'>
                    <div className='text-title'>
                        <h3 className='px-4 admin-title'>จัดการโพสต์</h3> 
                    </div>

                    <div className="searchbox ms-4">
                        <SearchIcon/>
                        <input className='searchInput ps-3' type="text" placeholder='ค้นหา...' />
                    </div>

                </div>
          
            
            

            <Tabs defaultActiveKey="post" className="Qtabs pt-4 px-4">
              <Tab className="pt-4 " eventKey="post" title="อนุมัติโพสต์">

              <div className='muitable px-4 pb-5'> 

              <ThemeProvider theme={theme}>
              <TableContainer className='' component={Paper}>


                <Table sx={{ minWidth: 650 }} aria-label="a dense table"> {/*add [size="small"] this line to dense*/}

                    <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="left">ข้อความ</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="left">วันที่โพสต์</TableCell>
                        <TableCell align="left">สถานะโพสต์</TableCell>
                        <TableCell align="left">การจัดการ</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell align="center" component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell align="left">{row.msg}</TableCell>
                        <TableCell align="left">{row.fullname}</TableCell>
                        <TableCell align="left">{row.post_date}</TableCell>
                        <TableCell align="left"><h style={{color: row.post_status === 'อนุมัติโพสต์แล้ว' ? "#17BF5F" : "#f7be3a"}}>{row.post_status}</h></TableCell>
                        <TableCell align="center"><button className='deleteUserButton'><DeleteOutlineIcon/></button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    </Table>
                </TableContainer>

              </ThemeProvider>

              
              
              </div>

                
              </Tab>

              <Tab
                className="pt-4"
                eventKey="report"
                title="การรายงาน"
              >
                
                <div className='muitable px-4 pb-5'> 

              <ThemeProvider theme={theme}>
              <TableContainer className='' component={Paper}>


                <Table sx={{ minWidth: 650 }} aria-label="a dense table"> {/*add [size="small"] this line to dense*/}

                    <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="left">ข้อความ</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="center">จำนวนครั้งที่โดนรายงาน</TableCell>
                        <TableCell align="left">วันที่โพสต์</TableCell>
                        <TableCell align="left">สถานะโพสต์</TableCell>
                        <TableCell align="center">การจัดการ</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell align="center" component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell align="left">{row.msg}</TableCell>
                        <TableCell align="left" className="table-text"><h className="table-text">{row.fullname}</h></TableCell>
                        <TableCell align="center">{row.report_count}</TableCell>
                        <TableCell align="left">{row.post_date}</TableCell>
                        <TableCell align="left" ><h className="table-text" style={{color: row.post_status === 'อนุมัติโพสต์แล้ว' ? "#17BF5F" : "#f7be3a"}}>{row.post_status}</h></TableCell>
                        <TableCell align="center"><button className='deleteUserButton'><DeleteOutlineIcon/></button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    </Table>
                </TableContainer>

              </ThemeProvider>

              
              
              </div>


               
              </Tab>

            </Tabs>



        </div>


    </div>
    
  )
}

export default adminPost