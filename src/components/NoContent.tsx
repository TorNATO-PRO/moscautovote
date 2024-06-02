import { Add, Close, Upload } from "@mui/icons-material";
import { Button, IconButton, Snackbar, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import NewSessionDialog from "./NewSessionDialog";
import { open } from '@tauri-apps/api/dialog';
import { appDataDir } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";
import React from "react";

type NoContentProps = Readonly<{
  onLoadSession: (sessionData: Session) => void,
  onCreateSession: (categoryName: string) => void,
}>;

/**
 * NoContent defines a react component encapsulating
 * the state of the application where there is no voting session 
 * currently defined, as it either has yet to be defined or has 
 * not been loaded from a previous session state.
 * 
 * @param props The properties of the react component.
 * @returns A NoContent react component. 
 */
function NoContent(props: NoContentProps) {
  const theme = useTheme();

  const [newDialogOpen, setDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleOnLoadSessionClick = async () => {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Event Files',
        extensions: ['json']
      }],
      defaultPath: await appDataDir(),
    });

    if (selected == null) {
      return
    }

    // we can perform this cast since we disabled multiple select.
    const contents = await readTextFile(selected as string);

    const sessionData = JSON.parse(contents);

    const session = parseSession(sessionData);

    if (typeof session === "string") {
      setSnackbarOpen(true);
      setErrorMessage(`Failed to parse file: ${session}`);
    } else {
      props.onLoadSession(session);
    }
  }

  /**
   * ParseSession attempts to parse data into a session, returning
   * a failure message if this operation was not successful.
   * 
   * @param sessionData The data to attempt to parse. At the input
   * boundary this data is null.
   */
  const parseSession = (sessionData: any): Session | string => {
    const isValidEntry = (row: any) => (
      row.owner !== undefined &&
        row.make !== undefined &&
        row.model !== undefined &&
        row.year !== undefined &&
        row.category !== undefined &&
        row.votes !== undefined
    );

    if (sessionData.event === undefined || sessionData.entries === undefined) {
      return "Invalid contents"
    }

    const entries = sessionData.entries as Array<any>;

    if (!entries.every((entry) => isValidEntry(entry))) {
      return "Invalid contents"
    }

    return sessionData as Session
  }

  const handleOnNewSessionClick = () => {
    setDialogOpen(true);
  };

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setSnackbarOpen(false)}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", gap: theme.spacing(10), flexDirection: "column" }}>
      <Typography variant="h3">
        MoscAuto Voter
      </Typography>
      <div style={{ display: "flex", gap: theme.spacing(3), flexDirection: "row" }}>
        <Button variant="outlined" onClick={handleOnLoadSessionClick} startIcon={<Upload />}>
          <Typography style={{ marginTop: theme.spacing(1) }}>Load Event</Typography>
        </Button>
        <Button variant="contained" onClick={handleOnNewSessionClick} startIcon={<Add />}>
          <Typography style={{ marginTop: theme.spacing(1)}}>New Event</Typography>
        </Button>
      </div>
      {newDialogOpen && <NewSessionDialog
        onClose={() => setDialogOpen(false)}
        onCreate={(event) => {
          props.onCreateSession(event)
          setDialogOpen(false)
        }}
      />}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={errorMessage}
        action={snackbarAction}
      />
    </div>
  );
}

export default NoContent;