import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Button, Card, Grid, TextField } from "@mui/material";
import inventoryContext from "../../context/inventory/inventoryContext.jsx";
import { useContext, useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from "jspdf";
import moment from "moment";
import numWords from "num-words";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import GSTBarChart from "./GSTBarChart.jsx";
import MonthlyIncomeBarChart from "./MonthlyIncomeBarChart.jsx";


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Analytics = () => {

  const context = useContext(inventoryContext)
  const {profit,invoices,analysis,getProfits,getAllInvoices,updateStatus,analyseInvoices} = context
  const [invoiceData, setInvoiceData] = useState([]);
  const [bill, setBill] = useState([]);
  const [content, setContent] = useState([]);
  const [download, setDownload] = useState(false);
  const [userData, setUserData] = useState({
    name: "Aryaan",
    email: "aryaan@gmail.com",
    phoneNumber: "123456789"
  });

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      field: 'gst',
      headerName: 'GST',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      editable: true,
      renderCell: (params) => {

        const [selectedStatus, setSelectedStatus] = useState(params.value || '');

        const handleChange = (event) => {
          const newStatus = event.target.value;
          setSelectedStatus(newStatus);
          console.log({ status: newStatus });
          updateStatus( params.row._id, event.target.value)
          // You can use the `updateStatus` function here passing `newStatus` and `params.row._id`
        };
        return (
          <>
            <Select 
              placeholder="Select Status"
              value={selectedStatus}
              onChange={handleChange}
            >
              <MenuItem value="complete">Complete</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
              <MenuItem value="issue">Issue</MenuItem>
            </Select>
          </>
        )
      }
    },
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      width: 250,
      editable: true,
    },
    {
      field: 'customerPhoneNumber', // New field for customer phone number
      headerName: 'Customer Phone Number',
      width: 200,
      renderCell: (params) => {
        return params.row.customer && params.row.customer.phoneNumber;
      }
    },
    {
      field: '',
      headerName: '',
      type: 'number',
      width: 50,
      renderCell: (params) => {
        const assignBill = () => {
          setUserData(params.row.customer)
          setContent(params.row.contents)
          setBill(params.row)
          setDownload(true)
        }
        return (
          <>
            <IconButton aria-label="refresh" onClick={assignBill}  style={{color: 'red'}}>
              <DownloadIcon/>
            </IconButton>
          </>
        )
      }
    }
  ];
  
  const rows = [
    { id: 1, invoiceId: '', total: '', gst: 0, type: '', status: '', transactionId: '',  },
  ];

  useEffect(() => {
    getProfits()
    getAllInvoices()
  }, [])
  
  useEffect(() => {
    console.log(bill)
    { bill !== undefined && download === true ? (
        generatePDF()
      ) : console.log("No Invoices!")
    }
  }, [bill])

  useEffect(() => {
    {invoices ? setInvoiceData(invoices) : console.log('no data')}
  }, [invoices])

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  // const finalTotal = toTitleCase(numWords(total))

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#bill"), {
      callback: function (pdf) {
        const pageCount = doc.internal.getNumberOfPages();
        console.log(pageCount)
        doc.deletePage(pageCount)
        pdf.save("bill.pdf")
      }
    })
    console.log("download")
    setBill(undefined)
    setDownload(false)
  }

  useEffect(() => {
    analyseInvoices();
  },[])

  useEffect(() => {
    console.log(analysis)
  },[analysis])

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{backgroundColor: "#F1F3F6", height: '100vh'}}>
      <DrawerHeader />
      <Card style={{padding: '0px 20px 25px 20px'}}>
        <h1>Analytics </h1>
        <hr/>
        <Grid container spacing={2}>
          <Grid item xs={4} style={{ height: 300, paddingBottom: 20  }}>
            <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: profit.total - profit.profit - profit.gst, label: 'Product Cost' },
                      { id: 1, value: profit.profit, label: 'Profit' },
                      { id: 2, value: profit.gst, label: 'GST' },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
              }}>Finances</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} style={{ height: 300, paddingBottom: 20 }}>
            <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                marginTop: 10,
                fontSize: 28
              }}>Total</Typography>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 30,
                fontSize: 64,
                color: "green"
              }}>&#8377; {profit.total}</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} style={{ height: 300, paddingBottom: 20 }}>
            <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                marginTop: 10,
                fontSize: 28
              }}>Today's Revenue</Typography>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 30,
                fontSize: 64,
                color: "green"
              }}>&#8377; {analysis && analysis.todayTotalRevenue}</Typography>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4} style={{ paddingBottom: 20 }}>
            <Card style={{padding: '25px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <GSTBarChart transactions={invoices && invoices}/>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 5,
                fontSize: 16
              }}>GST Data by Month</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} style={{ paddingBottom: 20 }}>
            <Card style={{padding: '25px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <MonthlyIncomeBarChart transactions={invoices && invoices}/>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 5,
                fontSize: 16
              }}>Earnings by Month</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} style={{ paddingBottom: 20 }}>
            <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                marginTop: 10,
                fontSize: 28
              }}>Most Bought Product</Typography>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 40,
                fontSize: 38,
                justifyContent: "center",
                color: "#1976D2"
              }}>{analysis && analysis.mostBoughtProduct}</Typography>
            </Card>
            {/* <Card style={{padding: '10px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "48%" }}>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                marginTop: 10,
                fontSize: 28
              }}>Most Bought Product</Typography>
              <Typography style={{
                fontWeight: "bold",
                fontFamily: 'Poppins',
                textAlign: "center",
                marginTop: 40,
                fontSize: 38,
                justifyContent: "center",
                color: "#1976D2"
              }}>{analysis && analysis.mostBoughtProduct}</Typography>
            </Card> */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ paddingBottom: 20 }}>
            <Card style={{padding: '25px 20px 25px 20px'}} sx={{ borderRadius: '16px',  boxShadow: 3, marginTop: 2, height: "100%" }}>
              <DataGrid
                rows={invoiceData}
                columns={columns}
                getRowId={(row) => row?._id}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                sx={{"& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgba(101,47,157,0.6)",
                  color: "rgb(255,255,255)",
                  fontSize: 16
                }}}
                // checkboxSelection
                disableRowSelectionOnClick
              />
            </Card>
          </Grid>
        </Grid>
        <br/>
      </Card>
      {/* Invoice */}
      {bill ? (
        <Card style={{
          margin: 20,
          display: 'none'
        }}>
          <div className="wholePrintBody page-break" id="bill" style={{marginBottom: 0}}>
            <header style={{marginTop: 125}}>
              <div className="allBorder">
                <section className="leftSection ">
                  <p style={{margin: 5, fontSize: 14, fontWeight: 'bold'}}>OMKAR CREATIONS</p>
                  <p className="address" style={{margin: 5}}>
                    A-401 Prakriti Aprt, M.S. Road, Mittal Park,<br/>
                    Raghunath Nagar, Thane(W),<br/>
                    Dist.Thane-400604,Maharashtra
                  </p>
                  <p style={{margin: 5}}>
                    <b>Mob</b>
                    <label className="ph_no">8779674027</label>
                  </p>
                </section>
                <section className="rightSection ">
                  <table style={{margin: 5}}>
                    <tr>
                      <td>Invoice No.</td>
                      <td>
                        <label>Bill No</label>
                      </td>
                    </tr>
                    <tr>
                      <td>Date</td>
                      <td>
                        <label>{moment(new Date()).format('DD/MM/YYYY')}</label>
                      </td>
                    </tr>
                    <tr>
                      <td>GST No.</td>
                      <td>
                        <label>27AFFPV7912N1ZP</label>
                      </td>
                    </tr>
                  </table>
                </section>
                <div className="clearfix"></div>
              </div>
            </header>
            <br/>
            <main>
              <section className="medicalDetails allBorder">
                <div>
                  <div style={{margin: 5, fontSize: 14, fontWeight: 'bold'}}>BUYER</div>
                  <div style={{fontWeight: 'bold', fontSize: 14, marginLeft: 5}}>{userData.name}</div>
                  <div className="buyer-address" style={{marginLeft: 5}}>
                    {userData.email}<br/>
                    {userData.phoneNumber}<br/>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </section>
              <section className="itemDetailSection allBorder">
                <div>
                  <table cellSpacing="0" className="billProductDetailsTable bottomBorder">
                    <thead>
                      <tr>
                        <th rowSpan="2" colSpan="2">Sr. No.</th>
                        <th rowSpan="2" colSpan="5">Description</th>
                        <th rowSpan="2" colSpan="2">HSN Code</th>
                        <th rowSpan="2" colSpan="4">Rate</th>
                        <th rowSpan="2" colSpan="2">Quantity</th>
                        <th rowSpan="2" colSpan="4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.map((product, index) => (
                        <tr key={index}>
                          <td colSpan="2" style={{ borderBottom: '1px solid black' }}>{index + 1}</td>
                          <td colSpan="5" style={{ borderBottom: '1px solid black' }}><b>{product.productName}</b><br/>{product.productCode}</td>
                          <td colSpan="2" style={{ borderBottom: '1px solid black' }}></td>
                          <td colSpan="4" style={{ borderBottom: '1px solid black', textAlign: "right"}}>{product.price}</td>
                          <td colSpan="2" style={{ borderBottom: '1px solid black', textAlign: "center" }}>{product.qty}</td>
                          <td colSpan="4" style={{ borderBottom: '1px solid black', textAlign: "right"}}>{product.price * product.qty}</td>
                        </tr>
                      ))}
                      
                      <tr>
                        <th colSpan="11"></th>
                        <th colSpan="4" style={{border: "1px solid black", borderBottom: "0px"}}>Taxable Amount</th>
                        <th colSpan="4" style={{border: "1px solid black", borderBottom: "0px", fontSize: "10px", textAlign: "right"}}>{bill.taxable}</th>
                      </tr>
                      <tr>
                        <th colSpan="11"></th>
                        <th colSpan="4" style={{border: "1px solid black", borderBottom: "0px"}}>GST 18%</th>
                        <th colSpan="4" style={{border: "1px solid black", borderBottom: "0px", fontSize: "10px", textAlign: "right"}}>{bill.gst}</th>
                      </tr>
                      <tr>
                        <th colSpan="11"></th>
                        <th colSpan="4" style={{border: "1px solid black", borderBottom: "0px"}}>Total</th>
                        <th colSpan="4" style={{border: "1px solid black", borderBottom: "0px", fontSize: "10px", textAlign: "right"}}>{bill.total}</th>
                      </tr>
                    </tbody>

                  </table>
                  <p>Amount Chargable(in words): {toTitleCase(numWords(bill.total))}</p>
                </div>
                <div className="terminology topBorder">
                  <div>
                    <table className="terminologyLeftTable">
                      <h3 className="bank-details">Bank Details</h3>
                      <tr>
                        <td>Bank:</td>
                        <td colSpan={2}>Punjab & Sind Bank</td>
                      </tr>
                      <tr>
                        <td>Account No:</td>
                        <td colSpan={2}>1256985621245</td>
                      </tr>
                      <tr>
                        <td>Branch</td>
                        <td colSpan={2}>Thane Branch</td>
                      </tr>
                      <tr>
                        <td>IFSC Code</td>
                        <td colSpan={2}>PSB00045</td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td colSpan={2}>Tulsi Shyam Teen Hath Naka, Thane(W), 400604</td>
                      </tr>
                    </table>
                    <table className="terminologyRightTable">
                      <p className="sign">
                        Omkar Creations <br/>
                        Authorized Signatory
                      </p>
                    </table>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </section>
            </main>
            <p style={{marginTop: 0}}>Declaration: * No Complaint regarding this bill will be entertained if not noticed in writing within 7 days.</p>
          </div>
        </Card>
        ) : (
        <></>
        )
      }
    </Box>
  )
}

export default Analytics;