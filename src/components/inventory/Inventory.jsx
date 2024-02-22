import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import {Button, Card, Grid, TextField} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import inventoryContext from "../../context/inventory/inventoryContext.jsx";
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from "xlsx";



const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Inventory = () => {
  const [invData, setInvData] = useState([])
  const context = useContext(inventoryContext)
  const {name,product,currentProduct,user,getProductById,fetchProduct,addProduct,getUser,getProductByCode,deleteProduct} = context
  const [productName, setProductName] = useState()
  const [productCode, setProductCode] = useState()
  const [productQuantity, setProductQuantity] = useState()
  const [productCostPrice, setProductCostPrice] = useState()
  const [productMRP, setProductMRP] = useState()
  const [productExpiryDate, setProductExpiryDate] = useState(null)
  const [delQty, setDelQty] = useState()
  const [delCode, setDelCode] = useState()
  const [delName, setDelName] = useState()
  const [delPrice, setDelPrice] = useState()
  const [delReason, setDelReason] = useState()
  const [deleteID, setDeleteID] = useState()
  const [delUser, setDelUser] = useState()
  const [add, setAdd] = useState(false)
  const [addButton, setAddButton] = useState(true)
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setDelName(null)
      setDelCode(null)
      setDelPrice(null)
      setDelQty(null)
  };

  useEffect(() => {
    fetchProduct()
  },[])

  useEffect(() => {
    console.log("Me: ",product)
    {product ? setInvData(product) : console.log('no data')}
  },[product])

  useEffect(() => {
    if(currentProduct) {
      setDelName(currentProduct.name)
      setDelCode(currentProduct.code)
      setDelPrice(currentProduct.mrp)
      setDelQty(currentProduct.qty)
      getUser()
    } else {
      console.log('No Data!')
    }
  },[currentProduct])

  useEffect(() => {
    if(user) {
      setDelUser(user.name)
    }
  },[user])

  useEffect(() => {
    if(delPrice) {
      setOpen(true)
    }
  },[delPrice])

  useEffect(() => {
    console.log(invData)
  },[invData])

  const handleDelete = () => {
    const data = {
      "employeeName": delUser,
      "productName": delName,
      "productCode": delCode,
      "price": delPrice,
      "reason": delReason,
      "qty": delQty,
      "destructionDate": moment().format()
    }
    deleteProduct(deleteID, data)
    setDeleteID("")
  }

  const handleAdd = () => {
    const data = {
      name: productName,
      code: productCode,
      qty: productQuantity,
      costprice: productCostPrice,
      mrp: productMRP,
      expirydate: productExpiryDate,
    }
    console.log(data)
    addProduct(data)
    setProductName("")
    setProductCode("")
    setProductQuantity("")
    setProductCostPrice("")
    setProductMRP("")
    setProductExpiryDate("")
    setAddButton(true)
    setAdd(false)
  }

  useEffect(() => {
    let pName = name
    console.log(name)
    // const pName = name.name
    setProductName(pName)
    pName = undefined   
  },[name])

  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      width: 100,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1 ,
    },
    {
      field: 'costprice',
      headerName: 'Buying Price',
      type: 'number',
      flex: 1,
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      type: 'number',
      flex: 1,
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
      flex: 1,
      valueFormatter: params => moment(params?.value).format("DD/MM/YYYY"),
    },
    {
      field: '',
      headerName: '',
      type: 'number',
      renderCell: (params) => {
        const handleDelete = () => {
          console.log(params.row._id)
          getProductById(params.row._id)
          setDeleteID(params.row._id)
        }
        return (
          <>
            <IconButton aria-label="refresh" onClick={handleDelete}  style={{color: 'red'}}>
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </>
        )
      }
    },
  ];

  const excelDownload = () => {
    const wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(invData);
    XLSX.utils.book_append_sheet(wb,ws,"Sheet1")
    XLSX.writeFile(wb,"inventory.xlsx")
}

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{backgroundColor: "#F1F3F6", height: '100vh'}}>
      <DrawerHeader />
      <Card style={{padding: '0px 20px 25px 20px'}}>
        <h1>Inventory </h1>
        <hr/>
        <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2 }}>
          <Grid container alignItems="center">
            <Grid md={4}>
              <h2>All Products</h2>
            </Grid>
            <Grid md={7}></Grid>
            <Grid md={1} align="right" >
            <IconButton aria-label="refresh" onClick={() => excelDownload()}>
                <FileDownloadIcon />
              </IconButton>
              <IconButton aria-label="refresh" onClick={() => fetchProduct()}>
                <RefreshIcon />
              </IconButton>
            </Grid>
          </Grid>
          <DataGrid
            rows={invData}
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
        </Card>
        <Card style={{padding: '0px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2 }}>
          <h2>Add Product</h2>
          <Box sx={{ border: 1, borderRadius: '16px' }}>

            <Grid container alignItems="center">
              <Grid md={8}>
                <div style={{padding: 10}}>
                  <TextField style={{marginTop: 5}} id="outlined-basic" label="Product Code" variant="outlined" value={productCode} fullWidth onChange={(e) => {setProductCode(e.target.value); console.log(e.target.value)}} required/>
                </div>
              </Grid>
              <Grid md={4}>
                <div style={{padding: 10}}>
                  {addButton && <Button variant="contained" onClick={() => {setAdd(true); setAddButton(false); {productCode && getProductByCode(productCode)}}}>Add Product</Button>}
                </div>
              </Grid>
            </Grid>

            { add && <>
              <Grid container alignItems="center">
                <Grid md={4}>
                  <div style={{padding: 10}}>
                    <TextField style={{marginTop: 5}} id="outlined-basic" label="Product Name" variant="outlined" value={productName} fullWidth onChange={(e) => setProductName(e.target.value)} required/>
                  </div>
                </Grid>
                <Grid md={4}>
                  <div style={{padding: 10}}>
                    <TextField style={{marginTop: 5}} id="outlined-basic" label="Product Quantity" variant="outlined" value={productQuantity} type='number' fullWidth onChange={(e) => setProductQuantity(e.target.value)}/>
                  </div>
                </Grid>
                <Grid md={4}>
                  <div style={{padding: 10}}>
                    <TextField style={{marginTop: 5}} id="outlined-basic" label="Buying Price" variant="outlined" value={productCostPrice} type='number' fullWidth onChange={(e) => setProductCostPrice(e.target.value)}/>
                  </div>
                </Grid>
              </Grid>

              <Grid container alignItems="center">
                <Grid md={4}>
                  <div style={{padding: 10}}>
                    <TextField style={{marginTop: 5}} id="outlined-basic" label="MRP " variant="outlined" value={productMRP} type='number' fullWidth onChange={(e) => setProductMRP(e.target.value)}/>
                  </div>
                </Grid>
                <Grid md={4}>
                  <div style={{padding: 10}}>
                    <TextField style={{marginTop: 5}} id="outlined-basic" label="Expiry Date" variant="outlined" value={productExpiryDate} fullWidth onChange={(e) => setProductExpiryDate(e.target.value)}/>
                  </div>
                </Grid>
                <Grid md={4}>
                  <div style={{padding: 10}}>
                    {!addButton && <Button variant="contained" onClick={handleAdd}>Add Product</Button>}
                  </div>
                </Grid>
              </Grid>
            </>}
            {/* <Grid container>
              <Grid md={12} align="right">
                <div style={{padding: 10}}>
                  <Button variant="contained" onClick={handleAdd}>Add Product</Button>
                </div>
              </Grid>
            </Grid> */}
          </Box>
        </Card>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Product Removal"}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
          </DialogContentText> */}
          <TextField  id="outlined-read-only-input" defaultValue={delCode} label="Product Code" variant="outlined" onChange={(e) => setDelCode(e.target.value)} style={{marginBottom: '10px', marginTop: '5px'}} InputProps={{readOnly: true}}/>
          <TextField  id="outlined-basic-read-only-input" defaultValue={delName} label="Product Name" variant="outlined" onChange={(e) => setDelName(e.target.value)} style={{marginLeft: '10px', marginBottom: '10px', marginTop: '5px'}} InputProps={{readOnly: true}}/><br/>
          <TextField  id="outlined-basic-read-only-input" defaultValue={delPrice} label="Price" variant="outlined" onChange={(e) => setDelPrice(e.target.value)} InputProps={{readOnly: true}}/>
          <TextField required error={err} id="outlined-basic" defaultValue={delQty} label="Qty" variant="outlined" onChange={(e) => setDelQty(e.target.value)} style={{marginLeft: '10px', marginBottom: '10px'}}/><br/>
          <TextField required error={err} id="outlined-basic" defaultValue={delReason} label="Reason" variant="outlined" onChange={(e) => setDelReason(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={() => {
            if (delQty && delReason) {
              handleDelete();
              handleClose();
            } else {
              setErr(true)
            }
          }} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Inventory