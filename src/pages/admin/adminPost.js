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


function createData(id, code, fullname, faculty, major,email,regis_date,manage) {
    return { id, code, fullname, faculty, major,email,regis_date,manage };
  }

  const rows = [
    createData('0001', 61090500444, 'เมริสา อินทรเกียรติ', 'คณะวิทยาศาสตร์', 'วิทยาการคอมพิวเตอร์ประยุกต์','chanai.prommabuth@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0002', 61090525421, 'เมริสา อินทรเกียรติ', 'คณะวิทยาศาสตร์', 'วิทยาการคอมพิวเตอร์ประยุกต์','saaira.ma@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0003', 61090521566, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','saaira.ma@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0004', 61090502156, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','saaira.ma@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0005', 61090500445, 'ธนารีย์ อรุณรุ่ง', 'คณะวิทยาศาสตร์', 'สถิติ','saaira.ma@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0006', 61090500447, 'ธนารีย์ อรุณรุ่ง', 'คณะวิทยาศาสตร์', 'สถิติ','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0007', 61090500442, 'ธนารีย์ อรุณรุ่ง', 'คณะวิทยาศาสตร์', 'วิทยาการคอมพิวเตอร์ประยุกต์','laila.aaa@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0010', 61090500562, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0010', 61090500562, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0010', 61090500562, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0010', 61090500562, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0010', 61090500562, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),
    createData('0010', 61090500562, 'แก้วขวัญ ปิติทัศน์', 'คณะวิทยาศาสตร์', 'คณิตศาสตร์','justin.piti@mail.kmutt.ac.th','15/10/2022','c'),

   
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
          
            
            

            <Tabs defaultActiveKey="all" className="Qtabs pt-4 px-4">
              <Tab className="pt-4 " eventKey="all" title="ทั้งหมด">

              <div className='muitable px-4 pb-5'> 

              <ThemeProvider theme={theme}>
              <TableContainer className='' component={Paper}>


                <Table sx={{ minWidth: 650 }} aria-label="a dense table"> {/*add [size="small"] this line to dense*/}

                    <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="left">รหัสนักศึกษา</TableCell>
                        <TableCell align="left">ชื่อ-นามสกุล</TableCell>
                        <TableCell align="left">คณะ</TableCell>
                        <TableCell align="left">สาขา</TableCell>
                        <TableCell align="left">อีเมล</TableCell>
                        <TableCell align="left">วันที่สมัคร</TableCell>
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
                        <TableCell align="left">{row.code}</TableCell>
                        <TableCell align="left">{row.fullname}</TableCell>
                        <TableCell align="left">{row.faculty}</TableCell>
                        <TableCell align="left">{row.major}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.regis_date}</TableCell>
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
                eventKey="student"
                title="นักศึกษา"
              >
                

               
              </Tab>


              <Tab
                className="pt-4"
                eventKey="employee"
                title="บุคลากรภายใน"
              >
                

               
              </Tab>



            </Tabs>



        </div>


    </div>
    
  )
}

export default adminPost