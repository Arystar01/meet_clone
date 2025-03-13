import React from 'react'
import { Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
const AddEvent = ({openCalender, setopenCalender}) => {
  return (
    <div>
        
        <Dialog open={open} onClose={()=>setopenCalender(false)}>
            <DialogContent>
                <DialogTitle>Add Event</DialogTitle>
                <DialogContentText>
                    <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Event Name"
                    type="text"

                    fullWidth
                    variant="standard"
                    />

                    
                  </DialogContentText>


            </DialogContent>
        </Dialog>
      
    </div>
  )
}

export default AddEvent
