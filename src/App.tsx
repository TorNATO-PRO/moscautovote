import { save } from '@tauri-apps/api/dialog';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import NoContent from "./components/NoContent";
import { useState } from "react";
import EventPage from "./components/EventPage";
import { appDataDir } from '@tauri-apps/api/path';
import { writeTextFile } from '@tauri-apps/api/fs';

const moscautoTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  spacing: 4,
});

function App() {
  const [session, setSession] = useState<Session | undefined>(undefined);

  const handleExportSession = async (currentSession: Session) => {
    const filePath = await save({
      filters: [{
        name: "Event Files",
        extensions: ['json']
      }],
      defaultPath: await appDataDir(),
    });

    if (filePath === null) {
      return
    }

    await writeTextFile(filePath, JSON.stringify(currentSession))
  };

  return (
    <ThemeProvider theme={moscautoTheme}>
      <CssBaseline />
      {session === undefined && (
        <NoContent
          onCreateSession={(event) => setSession({ event, entries: [] })}
          onLoadSession={(session) => setSession(session)}/>
      )}
      {session !== undefined && (
        <EventPage
          currentSession={session}
          onCurrentSessionChange={setSession}
          onExitSession={() => setSession(undefined)}
          onExportSession={handleExportSession}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
