import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

type NewSessionDialogProps = Readonly<{
  onCreate: (categoryName: string) => void,
  onClose: () => void,
}>;

function NewSessionDialog(props: NewSessionDialogProps) {
  const [eventName, setEventName] = useState("");

  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Create Session</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To enable voting, you must first specify an
          event to vote for (i.e. People's Choice, Classic Cars).
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="event-name"
          name="event-name"
          label="Event Name"
          type="text"
          fullWidth
          variant="standard"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={() => props.onCreate(eventName)}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewSessionDialog;