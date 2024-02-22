import Button from '@mui/joy/Button';
import { Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useState, useRef } from 'react';

const InstaMode = ({data, onCodeReceived}) => {

  const [code, setCode] = useState();

  const inputCode = useRef(null);

  const handleData = () => {
    console.log(data)
    if(code){
      const item = data.find(obj => obj.code == code)
      console.log(item)
      onCodeReceived(item);
    }
    setCode("")
    inputCode.current.focus();
  }

  return (
    <>
      <h2 style={{ marginBottom: 0, marginLeft: 10 }}>Insta Add</h2>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={10}>
          <div style={{padding: 10}}>
            <TextField inputRef={inputCode} style={{marginTop: 5}} id="outlined-basic" value={code} label="Code" variant="outlined" fullWidth onChange={(e) => setCode(e.target.value)} required/>
          </div>
        </Grid>
        <Grid item xs={2}>
          <div style={{padding: 10}}>
            <Button style={{ width: "100%" }} onClick={handleData}> Add </Button>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default InstaMode;