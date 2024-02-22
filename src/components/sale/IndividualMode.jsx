import Button from '@mui/joy/Button';
import { Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import {useState} from "react";
import CardContent from '@mui/joy/CardContent';

const IndividualMode = ({data, onDataReceived }) => {

  const [value, setValue] = useState('')

  const handleClick = (data) => {
    onDataReceived(data)
  }

  return (
    <>
      <h2 style={{ marginBottom: 0, marginLeft: 10 }}>Individual Add</h2>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
        <div style={{padding: 10}}>
            <TextField style={{marginTop: 5}} id="outlined-basic" label="Name" variant="outlined" value={value} fullWidth onChange={e => setValue(e.target.value)} required/>
        </div>
        </Grid>
      </Grid>
      {data
        .filter(item => {
        if (!value) return true
        if (item.name.includes(value) && item.qty > 0) {
            return true
        }
        })
        .map(item => (
        <Card variant="soft">
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={10}>
              <CardContent>
              <Typography level="title-md">{item.name}</Typography>
              </CardContent>
            </Grid>
            <Grid item xs={2}>
              <Button style={{ width: "100%" }} onClick={() => handleClick(item)}>Add</Button>
            </Grid>
          </Grid>
        </Card>
        ))
      }
    </>
  )
}

export default IndividualMode;