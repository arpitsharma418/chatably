import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import axios from "axios";
import Cookies from "js-cookie";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async(event) => {
    const token = Cookies.get("token");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    await axios.post(`https://chatably.onrender.com/api/conversation`,{email},{
      withCredentials: true,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      handleClose();
    }).catch((error) => {
      console.log(error);
    })
    handleClose();
  };

  return (
    <React.Fragment>
      <AddIcCallIcon onClick={handleClickOpen} className='cursor-pointer'/>
      {/* <p onClick={handleClickOpen}>Connect</p> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Connect</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email ID you want to connect with.
            <div>After connecting, Please refresh the page.</div>
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}