import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Heading from "./Heading";
import { ExitToAppOutlined, ImportExport } from "@mui/icons-material";
import { useState } from "react";
import NewEntryDialog from "./NewEntryDialog";

type EventPageProps = Readonly<{
  currentSession: Session,
  onCurrentSessionChange: (session: Session) => void,
  onExportSession: (session: Session) => void,
  onExitSession: () => void,
}>;

type Row = Readonly<{
  id: number,
  owner: string,
  make: string,
  model: string,
  year: number,
  category: string,
  votes: number,
}>;


const entryToRow = (entry: VoteEntry, idx: number): Row => {
  return {
    id: idx,
    owner: entry.owner,
    make: entry.make,
    model: entry.model,
    year: entry.year,
    category: entry.category,
    votes: entry.votes
  }
}

const rowToEntry = (row: Row,): VoteEntry => {
  return {
    owner: row.owner,
    make: row.make,
    model: row.model,
    year: row.year,
    category: row.category,
    votes: row.votes
  }
}

const columns: GridColDef<Array<Row>[number]>[] = [
  {
    field: "owner",
    headerName: "Owner",
    editable: true,
    flex: 1,
  },
  {
    field: "make",
    headerName: "Make",
    editable: true,
    flex: 1,
  },
  {
    field: "model",
    headerName: "Model",
    editable: true,
    flex: 1
  },
  {
    field: "year",
    headerName: "Year",
    editable: true,
    flex: 1
  },
  {
    field: "category",
    headerName: "Category",
    editable: true,
    flex: 1
  },
  {
    field: "votes",
    headerName: "Votes",
    editable: true,
    flex: 1
  }
]

const rowEqual = (row: Row) => (entry: VoteEntry) => (
  entry.category === row.category && 
  entry.make === row.make && 
  entry.model === row.model && 
  entry.year === row.year && 
  entry.owner === row.owner &&
  entry.votes === row.votes
)

/*
 * EventPage defines the default event page encapsulating
 * the state of the application where there is a voting
 * session currently in session.
 *
 * @param props The properties of the react component.
 * @returns An EventPage react component.
 */
function EventPage(props: EventPageProps) {
  const theme = useTheme();

  const [entryDialogOpen, setEntryDialogOpen] = useState(false);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const actionButtons = (
    <div style={{ display: "flex", gap: theme.spacing(3) }}>
      <Button color="warning" variant="outlined" startIcon={<ExitToAppOutlined />} onClick={() => props.onExitSession()}>
        <Typography style={{ marginTop: theme.spacing(1)}}>Exit Event</Typography>
      </Button>
      <Button color="primary" variant="contained" startIcon={<ImportExport />} onClick={() => props.onExportSession(props.currentSession)}>
        <Typography style={{ marginTop: theme.spacing(1)}}>Export Event</Typography>
      </Button>
    </div>
  );

  const onCreateEntry = (entry: VoteEntry) => {
    const entryToUpdate = (e: VoteEntry): boolean => (
      entry.category === e.category && 
      entry.make === e.make && 
      entry.model === e.model && 
      entry.year === e.year && 
      entry.owner === e.owner
    );

    const oldEntry = props.currentSession.entries.find(entryToUpdate);
    
    if (oldEntry) {
      const update = props.currentSession.entries.filter((e) => !entryToUpdate(e));
      const newEntry = {
        ...entry,
        votes: oldEntry.votes + entry.votes
      }

      const session = {
        ...props.currentSession,
        entries: [...update, newEntry]
      }

      props.onCurrentSessionChange(session)

      return
    }

    const session = {
      ...props.currentSession,
      entries: [...props.currentSession.entries, entry]
    }

    props.onCurrentSessionChange(session)
  }

  const onDeleteEntries = () => {
    const entriesToDelete = rowSelectionModel.map((id) => id as number);
    const currentRows = props.currentSession.entries.map((e, idx) => entryToRow(e, idx));
    const newRows = currentRows.filter((row) => !entriesToDelete.includes(row.id))

    props.onCurrentSessionChange({
      ...props.currentSession,
      entries: newRows.map(rowToEntry)
    })

    setRowSelectionModel([]);
  } 

  return (
    <div style={{ height: "100vh" }}>
      <Heading
        heading={props.currentSession.event}
        children={actionButtons}
      />
      <div style={{ margin: theme.spacing(3), display: "flex", gap: theme.spacing(3) }}>
        <Button color="primary" variant="contained" onClick={() => setEntryDialogOpen(true)}>
          <Typography style={{ marginTop: theme.spacing(1)}}>New Entry</Typography>
        </Button>
        <Button color="secondary" variant="contained" onClick={() => onDeleteEntries()}>
          <Typography style={{ marginTop: theme.spacing(1)}}>Delete Entries</Typography>
        </Button>
      </div>
      <Box sx={{ height: '70%', width: '95%', margin: theme.spacing(3) }}>
        <DataGrid
          rows={props.currentSession.entries.map((entry, idx) => entryToRow(entry, idx))}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              }
            }
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          processRowUpdate={(newRow: Row, oldRow: Row) => {
            const votes: number = parseInt(`${newRow.votes}`);
            const year: number = parseInt(`${newRow.year}`);

            if (isNaN(votes) || isNaN(year)) {
              return oldRow
            }

            const oldRowIndex = props.currentSession.entries.findIndex((row) => rowEqual(oldRow)(row));

            if (oldRowIndex !== -1) {
              const entries = props.currentSession.entries;
              entries[oldRowIndex] = {
                owner: newRow.owner,
                year: year,
                make: newRow.make,
                model: newRow.model,
                category: newRow.category,
                votes: votes
              }

              props.onCurrentSessionChange({
                ...props.currentSession,
                entries
              })
            }

            const newParsedRow = {
              id: newRow.id,
              owner: newRow.owner, 
              year: year,
              votes: votes,
              make: newRow.make,
              model: newRow.model,
              category: newRow.category,
            }

            return newParsedRow
          }}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(rowSelectionModel) => {
            setRowSelectionModel(rowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      </Box>
      {entryDialogOpen && (
        <NewEntryDialog
          onClose={() => setEntryDialogOpen(false)}
          onCreate={onCreateEntry}
        />
      )}
    </div>
  );
}

export default EventPage;