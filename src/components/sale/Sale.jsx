import Box from "@mui/material/Box";
import Button from '@mui/joy/Button';
import { Grid, Hidden } from "@mui/material";
import { styled } from "@mui/material/styles";
import inventoryContext from "../../context/inventory/inventoryContext.jsx";
import Card from '@mui/joy/Card';
import {useContext, useEffect, useState} from "react";
import Switch from '@mui/joy/Switch';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import InstaMode from "./InstaMode.jsx";
import IndividualMode from "./IndividualMode.jsx";
import Typography from '@mui/joy/Typography';
import CardContent from '@mui/joy/CardContent';
import Modal from '@mui/joy/Modal';
import Sheet from '@mui/joy/Sheet';
import ModalClose from '@mui/joy/ModalClose';
import Input from '@mui/joy/Input';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from "jspdf";
import moment from "moment";
import numWords from "num-words";


const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ItemCard = ({ item, handleClickMinus, handleClickPlus }) => {

  const [hoveredMinus, setHoveredMinus] = useState(false);
  const [hoveredPlus, setHoveredPlus] = useState(false);
  const [open, setOpen] = useState(false);

  const squareStyle = {
    backgroundColor: hoveredMinus ? '#0B6BCB' : 'transparent',
    color: hoveredMinus ? 'white' : 'black',
    cursor: 'pointer',
    display: 'inline-block',
    width: '30px', 
    height: '30px', 
    borderRadius: '5px',
    borderWidth: 'thin',
    border: 'solid', 
    textAlign: 'center',
    lineHeight: '30px', 
  };

  const plusStyle = {
    backgroundColor: hoveredPlus ? '#0B6BCB' : 'transparent',
    color: hoveredPlus ? 'white' : 'black',
    cursor: 'pointer',
    display: 'inline-block',
    width: '30px', 
    height: '30px', 
    borderWidth: 'thin',
    border: 'solid',
    borderRadius: '5px', 
    textAlign: 'center',
    lineHeight: '30px', 
  };

  const handleMouseEnterMinus = () => {
    setHoveredMinus(true);
  };

  const handleMouseLeaveMinus = () => {
    setHoveredMinus(false);
  };

  const handleMouseEnterPlus = () => {
    setHoveredPlus(true);
  };

  const handleMouseLeavePlus = () => {
    setHoveredPlus(false);
  };

  return (
    <Card variant="soft">
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={7}>
          <CardContent>
            <Typography level="title-md">{item.name}</Typography>
          </CardContent>
        </Grid>
        <Grid item xs={1}>
          <span
            onMouseEnter={handleMouseEnterMinus}
            onMouseLeave={handleMouseLeaveMinus}
            onClick={() => handleClickMinus(item.code)}
            style={squareStyle}
          >
            -
          </span>
        </Grid>
        <Grid item xs={1}>
          <Typography level="title-md" style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {item.quantity}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <span
            onMouseEnter={handleMouseEnterPlus}
            onMouseLeave={handleMouseLeavePlus}
            onClick={() => handleClickPlus(item.code)}
            style={plusStyle}
          >
            +
          </span>
        </Grid>
        <Grid item xs={2}>
          <h3 style={{textAlign: 'center'}}>&#8377;{item.total}</h3>
        </Grid>
      </Grid>
    </Card>
  );
};

const Sale = () => {
  const context = useContext(inventoryContext);
  const { product, fetchProduct, paymentComplete } = context;
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [custNo, setCustNo] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [custFound, setCustFound] = useState(undefined);
  const [payment, setPayment] = useState(false);
  const [open, setOpen] = useState(false);
  const [bill, setBill] = useState();
  const [content, setContent] = useState([]);
  const [userData, setUserData] = useState({
    name: "Aryaan",
    email: "aryaan@gmail.com",
    phoneNumber: "123456789"
  });
  const [complete, setComplete] = useState(false);

  const host = "http://localhost:5001"

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    console.log(items)
  }, [items]);

  const getSelectedData = (data) => {
    console.log(data)
    if (items.length > 0) {
      const foundItem = items.find(obj => obj.code === data.code);
      let d = {...data, quantity: 1, total: data.mrp}
      if (foundItem) {
        setItems(items.map(obj =>
          obj.name === data.name ? { ...obj, quantity: obj.quantity + d.quantity, total: obj.mrp * (obj.quantity + 1) } : obj
        ));
      } else {
        setItems(prevItems => [...prevItems, d]);
      }
    } else {
      setItems([{...data, quantity: 1, total: data.mrp}])
    }
    
  };

  const handleClickMinus = (code) => {
    setItems(items.map(obj => 
      obj.code == code ? {...obj, quantity: obj.quantity - 1, total: obj.mrp * (obj.quantity - 1)} : obj  
    ))
    console.log('Clicked Minus!');
  };

  const handleClickPlus = (code) => {
    setItems(items.map(obj => 
      obj.code == code ? {...obj, quantity: obj.quantity + 1,  total: obj.mrp * (obj.quantity + 1) } : obj  
    ))
    console.log('Clicked Plus!');
  };

  const handletotal = (item) => {
    let price = 0;
    item.map(product => {
      price += product.total;
    })
    return price
  }

  const completePayment = (type) => {

    let price = 0;
    items.map(product => {
      price += product.total;
    })

    // Convert the array of objects to the desired format
    const contents = items.map(item => ({
      _id: item._id,
      productName: item.name,
      productCode: item.code,
      price: item.total.toString(),
      qty: item.quantity.toString(),
      total: item.total.toString()
    }));

    setContent(contents)

    const T = parseInt(price) + parseInt((price * 18 / 100).toFixed(1))
    console.log("Total: ",T)

    const invoice = {
      contents: contents,
      gst: (price * 18 / 100).toFixed(1),
      taxable: price,
      total: T,
      transactionId: "",
      type: type,
      status: "incomplete",
      customer: userData
    }

    setBill(invoice)
    paymentComplete(invoice)

    console.log("payment done")
    setOpen(false)
    setPayment(false)
  }

  useEffect(() => {
    if (bill && bill.gst) {
      generatePDF();
    }
  }, [bill]);

  const searchCustomer = async() => {
    if(custNo) {
      // API Call
      const response = await fetch(`${host}/api/sale/getuser/${custNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
        },
      });

      if(response.status == 200) {
        const resp = await response.json()
        setUserData(resp)
        console.log("Data present")
        console.log(resp)
        setPayment(true)
        setCustFound(true)
      } else if (response.status == 400) {
        console.log("Data not present")
        setCustFound(false)
      }
    }
  }

  useEffect(() => {
    if (custFound == true) {
      setShowAddCustomer(false)
    } else if (custFound == false) {
      setShowAddCustomer(true)
    }
  }, [custFound])

  const insertCustomer = async() => {
    if (name && custNo && email) {
      const response = await fetch(`${host}/api/customer/addcustomer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
        },
        body: JSON.stringify({
          name: name,
          phoneNumber: custNo,
          email: email
        }),
      });
      if(response.status == 200) {
        const resp = await response.json()
        console.log("Data Sent Successfully")
        console.log(resp)
        setPayment(true)
      } else if (response.status == 400) {
        console.log("Data Exists")
      }
    }
  }

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
  }

return (
  <>
    <Box
    component="main"
    sx={{ flexGrow: 1, p: 3 }}
    style={{ backgroundColor: '#F1F3F6', height: '100vh' }}
  >
      <DrawerHeader />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card style={{ padding: "0px 20px 25px 20px", height: "85vh", overflow: "scroll" }}>
            <Grid container spacing={1} alignItems="center" style={{marginTop: 30}} >
              <Grid item xs={8} ><h1 style={{margin: 0}}>Sale</h1></Grid>
              <Grid item xs={4} >
                <FormControl
                  orientation="horizontal"
                  sx={{ width: 300, justifyContent: 'space-between' }}
                >
                  <div>
                    <FormLabel>Select Mode</FormLabel>
                    <FormHelperText sx={{ mt: 0 }}>Insta Mode or Individual Mode</FormHelperText>
                  </div>  
                  <Switch checked={checked} onChange={(event) => setChecked(event.target.checked)} />
                </FormControl>
              </Grid>
            </Grid>
            {checked? <IndividualMode data={product} onDataReceived={getSelectedData}/> : <InstaMode data={product} onCodeReceived={getSelectedData}/>}
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card style={{ padding: '0px 20px 25px 20px', height: '65vh', overflow: "scroll" }}>
            <h1>Contents</h1>
              {items.map((item) => (
                <ItemCard
                  key={item.code}
                  item={item}
                  handleClickMinus={handleClickMinus}
                  handleClickPlus={handleClickPlus}
                />
              ))}
            {/* <Divider variant="middle" />
            <h2>Total</h2> */}
          </Card>
          <Card style={{ padding: '15px 20px 25px 20px', height: '19vh', marginTop: "10px", justifyContent: "center", }}>
            <div >
              <h1 style={{display: "inline-block", marginRight: "50%", marginBottom: 0}}>Total</h1>
              <h1 style={{display: "inline-block", marginTop: 10, marginBottom: 0}}>&#8377;{handletotal(items)}</h1>
            </div>
            <Button style={{marginTop: 0}} variant="solid" color="primary" onClick={() => setOpen(true)}>Checkout</Button>
          </Card>
        </Grid>
    </Grid>
  </Box>
  <Modal
    aria-labelledby="modal-title"
    aria-describedby="modal-desc"
    open={open}
    onClose={() => setOpen(false)}
    // style={{height: '50%' }}
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
  >
    <Sheet
      variant="outlined"
      sx={{
        maxWidth: 500,
        borderRadius: 'md',
        p: 3,
        boxShadow: 'lg',
      }}
    >
      <ModalClose variant="plain" sx={{ m: 1 }} />
      <Typography
        component="h2"
        id="modal-title"
        level="h4"
        textColor="inherit"
        fontWeight="lg"
        mb={1}
      >
        Checkout
      </Typography>
      {!showAddCustomer ? 
        (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={10}>
              <Input placeholder="Phone Number" onChange={(e) => setCustNo(e.target.value)} value={custNo} required/>
            </Grid>
            <Grid item xs={2}>
              <Button
                color="primary"
                disabled={false}
                onClick={() => searchCustomer()}
                size="md"
                variant="solid"
              >
                <SearchIcon/>
              </Button>
            </Grid>
          </Grid>
        ):
        (
          <>
            <Input placeholder="Name" onChange={(e) => setName(e.target.value)} required style={{marginBottom: 10}}/>
            <Input placeholder="Phone Number" onChange={(e) => setCustNo(e.target.value)} required style={{marginBottom: 10}}/>
            <Input placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required style={{marginBottom: 10}}/>
            <Button onClick={() => insertCustomer()}>Add Customer</Button>
          </>
        )
      }
      {payment ? (
        <>
          <br/>
          <Button size="lg" variant="outlined" style={{marginRight: "5px"}} onClick={() => completePayment("cash")}>Cash</Button>
          <Button size="lg" variant="outlined" style={{marginRight: "5px"}} onClick={() => completePayment("upi")}>UPI</Button>
          <Button size="lg" variant="outlined" style={{marginRight: "5px"}} onClick={() => completePayment("debit card")}>Debit Card</Button>
        </>
      ) : (
        <></>
      )}
    </Sheet>
  </Modal>

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
                  {/* <tr>
                    <th style={{borderLeft: "1px solid black"}}>Rate</th>
                    <th>Amount</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr> */}
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
                <p>Amount Chargable(in words): {toTitleCase(numWords(bill.total))} Only.</p>
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
  </>
);
};

export default Sale;
