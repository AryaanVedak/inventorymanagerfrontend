import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import {Button, Card, Grid, TextField} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import inventoryContext from "../../context/inventory/inventoryContext.jsx";
import { DataGrid } from '@mui/x-data-grid';
// import moment from 'moment';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from "@mui/material/IconButton";
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Database = () => {
  const [invData, setInvData] = useState([])
  const context = useContext(inventoryContext)
  const {database,fetchDatabase,addProductToDB} = context
  const [databaseName, setdatabaseName] = useState()
  const [databaseCode, setdatabaseCode] = useState()
  // const [deleteID, setDeleteID] = useState()
  const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchDatabase()
  },[])

  useEffect(() => {
    {database ? setInvData(database) : console.log('no data')}
  },[database])

  useEffect(() => {
    console.log(invData)
  },[invData])

  // const handleDelete = () => {
  //   deletedatabase(deleteID)
  //   setDeleteID("")
  // }

  const handleAdd = () => {
    const data = {
      name: databaseName,
      code: databaseCode,
    }
    console.log(data)
    addProductToDB(data)
    setdatabaseName("")
    setdatabaseCode("")
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1 ,
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1 ,
    },
    // {
    //   field: '',
    //   headerName: '',
    //   type: 'number',
    //   renderCell: (params) => {
    //     const handleDelete = () => {
    //       console.log(params.row._id)
    //       setDeleteID(params.row._id)
    //       handleClickOpen()
    //     }
    //     return (
    //       <>
    //         <IconButton aria-label="refresh" onClick={handleDelete}  style={{color: 'red'}}>
    //           <DeleteOutlineRoundedIcon />
    //         </IconButton>
    //       </>
    //     )
    //   }
    // },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{backgroundColor: "#F1F3F6", height: '100vh'}}>
      <DrawerHeader />
      <Card style={{padding: '0px 20px 25px 20px'}}>
        <h1>Database </h1>
        <hr/>
        <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2 }}>
          <Grid container alignItems="center">
            <Grid md={4}>
              <h2>All Registered databases</h2>
            </Grid>
            <Grid md={8} align="right" >
              <IconButton aria-label="refresh" onClick={() => fetchDatabase()}>
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
          <h2>Add To database</h2>
          <Box sx={{ border: 1, borderRadius: '16px' }}>
          <Grid container alignItems="center">
            <Grid md={5}>
              <div style={{padding: 10}}>
                <TextField style={{marginTop: 5}} id="outlined-basic" label="Code" variant="outlined" value={databaseCode} fullWidth onChange={(e) => setdatabaseCode(e.target.value)} required/>
              </div>
            </Grid>
            <Grid md={5}>
              <div style={{padding: 10}}>
                <TextField style={{marginTop: 5}} id="outlined-basic" label="Name" variant="outlined" value={databaseName} fullWidth onChange={(e) => setdatabaseName(e.target.value)}/>
              </div>
            </Grid>
            <Grid md={2}>
              <div style={{padding: 10}}>
                <Button variant="contained" onClick={handleAdd} sx={{boxShadow: 3}}>Add To database</Button>
              </div>
            </Grid>
          </Grid>
          </Box>
        </Card>
      </Card>

      {/* Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are You Sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You want to Delete this database
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={() => {
            // handleDelete();
            handleClose();
          }} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Database