import Box from "@mui/material/Box";
import { DataGrid } from '@mui/x-data-grid';
import {styled} from "@mui/material/styles";
import {Card} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import moment from 'moment';
import inventoryContext from "../../context/inventory/inventoryContext.jsx";

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const rows = [
  {
    "_id": 0,
    "code": 0,
    "expiryDate": "",
    "name": "No Data",
    "qty": 0,
  },
];

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const Dashboard = () => {

  const context = useContext(inventoryContext)
  const {product,fetchProduct} = context
  const [invData, setInvData] = useState([])
  const [temp, setTemp] = useState([])
  const [nearExp, setNearExp] = useState([])

  useEffect(() => {
    fetchProduct()
  },[])

  useEffect(() => {
    {product ? setInvData(product) : console.log('no data')}
  },[product])

  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1 ,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1 ,
    },
    {
      field: 'qty',
      headerName: 'Quantity',
      type: 'number',
      flex: 1,
    },
    {
      field: 'expirydate',
      headerName: 'Expiry Date',
      width: 100,
      valueFormatter: params => moment(params?.value).format("DD/MM/YYYY"),
    },
  ];

  useEffect(() => {
    const today = new Date()
    // console.log(today.getMonth())
    // if (invData.length > 0) {
    //   console.log(invData.map(item => moment(today?.value).format("DD-MM-YYYY") > moment(item.expirydate?.value).format("DD-MM-YYYY") ? moment(item.expirydate?.value).format("DD-MM-YYYY") : ""))
    // }
    if (invData.length > 0) {
      setTemp(invData.map(item => {
        // const date = new Date (moment(item.expirydate?.value).format("DD-MM-YYYY"))
        const date = new Date (item.expirydate)
        const diff = date.getMonth() - today.getMonth()
        console.log(`${item.name} = ${diff}`)
        let final
        if (Math.sign(diff) === 1) {
          if (diff < 6) {
            if (today.getFullYear() - date.getFullYear() == 0) {
              final = item
            }
          } else {
              
          }
        }
        return final
        // return diff
        // {diff < 6 ? date : ""}
      }))
    }
  },[invData])

  useEffect(() => {
    const data = temp.filter(item => item != undefined)
    console.log(data)
    setNearExp(data)
  },[temp])

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{backgroundColor: "#F1F3F6", height: '100vh'}}>
      <DrawerHeader />
      <Card style={{padding: '0px 20px 25px 20px'}}>
      <h1>Dashboard </h1>
      <hr/>
        <Card style={{padding: '0px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3 }}>
          <h2>Expiring Products</h2>
          <DataGrid
            rows={nearExp?.length > 0 ? nearExp : rows}
            columns={columns}
            getRowId={(row) => row?._id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{"& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(101,47,157,0.6)",
                color: "rgb(255,255,255)",
                fontSize: 16
              }}}
          />
          {/* <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead style={{backgroundColor:'purple'}}>
                <TableRow>
                  <TableCell style={{color: 'white'}}>Dessert (100g serving)</TableCell>
                  <TableCell style={{color: 'white'}} align="right">Calories</TableCell>
                  <TableCell style={{color: 'white'}} align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell style={{color: 'white'}} align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell style={{color: 'white'}} align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
        </Card>
      </Card>
    </Box>
  )
}

export default Dashboard