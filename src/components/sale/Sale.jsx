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


    const invoice = {
      contents: contents,
      gst: (price * 18 / 100).toFixed(1),
      total: price,
      transactionId: "",
      type: type,
      status: "",
    }

    paymentComplete(invoice)

    console.log("payment done")
    setOpen(false)

  }

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
  </>
);
};

export default Sale;
