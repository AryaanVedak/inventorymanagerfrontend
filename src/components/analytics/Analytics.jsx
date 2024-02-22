import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Button, Card, Grid, TextField } from "@mui/material";
import inventoryContext from "../../context/inventory/inventoryContext.jsx";
import { useContext, useEffect, useState } from "react";
import Typography from '@mui/material/Typography';


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
  const {profit,getProfits} = context

  useEffect(() => {
    getProfits()
  }, [])

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
                      { id: 0, value: profit.total - profit.profit, label: 'Product Cost' },
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
                fontSize: 64
              }}>&#8377; {profit.total}</Typography>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}

export default Analytics;