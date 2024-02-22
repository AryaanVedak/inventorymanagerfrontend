import InventoryContext from './inventoryContext.jsx'
import {useState} from "react";
const InventoryState = (props) => {

  const host = "http://localhost:5001"
  const productInitial = []

  const [product, setProducts] = useState(productInitial)
  const [user, setUser] = useState(productInitial)
  const [currentProduct, setCurrentProduct] = useState(productInitial)
  const [database, setDatabase] = useState(productInitial)
  const [name, setName] = useState(productInitial)
  const [profit, setProfit] = useState(productInitial)

  //Fetch All product
  const fetchProduct = async () => {
    // API Call
    const response = await fetch(`${host}/api/inventory/fetchinventory`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
    });
    const json = await response.json()
    console.log(json)
    setProducts(json[0])
  }

  //Get user
  const getUser = async () => {
     
    // API Call
    const response = await fetch(`${host}/api/auth/getuser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
    });
    const json = await response.json()
    console.log(json)
    setUser(json)
  }

  //Get product by ID
  const getProductById = async (id) => {
     
    // API Call
    const response = await fetch(`${host}/api/inventory/getproductbyid/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
    });
    const json = await response.json()
    console.log(json)
    setCurrentProduct(json)
  }

  //Add a product
  const addProduct = async (data) => {
    console.log("adding a new product")
    const product = [data]
    // setProducts(product.concat(product))

    // API Call
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(`${host}/api/inventory/addproduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
      body: JSON.stringify(product)
    });
  }



  //Delete a product
  const deleteProduct = async (id,data) => {
    const response = await fetch(`${host}/api/inventory/deleteproduct/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM"
      },
      body: JSON.stringify(data)
    });
    console.log(`Deleted product ${id}`)
    let newProducts = product.filter((product) => {return product._id !== id})
    const json = response.json();
    console.log(json)
  }

  // //Edit a product
  // const editProduct = async (id,title,description,tag) => {
  //   // API Call
  //   const response = await fetch(`${host}/api/product/updateproduct/${id}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ1M2UzNTQwODk2NzA2YTcyNzFlZjhkIn0sImlhdCI6MTY4MzIyMjQ5N30.a0dHD5-euIBobRHPuGksac2d3_nPIllk41cdx7js4c4',
  //     },
  //     body: JSON.stringify({title, description, tag})
  //   });
  //   const json = response.json();

  //   // Logic to edit in client
  //   for (let index = 0; index < product.length; index++) {
  //     const element = product[index];
  //     if (element.id === id) {
  //       element.title = title;
  //       element.description = description;
  //       element.tag = tag;
  //     }
  //   }
  // }

  //Fetch All product
  const fetchDatabase = async () => {
    // API Call
    const response = await fetch(`${host}/api/database/fetchdatabase`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
    });
    const json = await response.json()
    console.log(json)
    setDatabase(json[0])
  }

  //Add a product to database
  const addProductToDB = async (data) => {
    console.log("adding a new product to database")
    const product = data
    // setProducts(product.concat(product))

    // API Call
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(`${host}/api/database/addproduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
      body: JSON.stringify(product),
    })
  }

  //Get Product By Code
  const getProductByCode = async (code) => {
    // API Call
    const response = await fetch(`${host}/api/database/getproductbycode/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
    });
    const json = await response.json()
    console.log(json)
    setName(json.name)
  }

  //Add an invoice
  const paymentComplete = async (data) => {
    console.log("adding an invoice to database")
    const invoice = data
    console.log(invoice)
    // setProducts(product.concat(product))

    // API Call
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(`${host}/api/sale/saleinvoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
      body: JSON.stringify(invoice),
    })
  }

  //Get profits
  const getProfits = async () => {
    // API Call
    const response = await fetch(`${host}/api/sale/getprofit`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4MGFjOTQ1ZDk2YWU5ZmUzOTdlN2U5In0sImlhdCI6MTY4NjIwMDYxMH0._RXLrE3g9RTlVC7MU6RMR64iOPkoioIb378qlboLFgM',
      },
    });
    const json = await response.json()
    console.log(json)
    setProfit(json)
  }


  return(
    <InventoryContext.Provider value={{product,name,database,currentProduct,user, profit,getProductById,fetchProduct,getProductByCode,addProduct,addProductToDB,fetchDatabase,getUser,deleteProduct,paymentComplete, getProfits}}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </InventoryContext.Provider>
  )
}

export default InventoryState;