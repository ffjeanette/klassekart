import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import FileUpload, { type Student } from "./components/FileUpload";
import MapView from "./components/MapView";
import NearbyList from "./components/NearbyList";
import PrivacyInfo from "./components/PrivacyInfo";
import { localStorageKeys, lsStudentsDefault, useLocalStorage, type LSStudents } from "./hooks/useLocalStorage";
import { theme } from "./theme";

const App: React.FC = () => {
  const [view, setView] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [referenceStudent, setReferenceStudent] = useState<Student | null>(null);

  const [lsStudents] = useLocalStorage<LSStudents>(localStorageKeys.students, lsStudentsDefault);

  useEffect(() => {
    if (!students.length && lsStudents?.students?.length) {
      setStudents(lsStudents.students);
    }
  }, [referenceStudent]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Tittel + Tabs */}
          <Box>
            <Typography variant="h4">Klassekart</Typography>
            <Tabs value={view} onChange={(_, newValue) => setView(newValue)} textColor="primary" indicatorColor="primary">
              <Tab label="Kart" />
              <Tab label="I nærheten" />
            </Tabs>
          </Box>

          {/* Card rundt FileUpload + Velg elev */}
          <Card>
            <CardContent>
              <Stack spacing={3}>
                {/* File upload */}
                <FileUpload setStudents={setStudents} students={students} referenceStudent={referenceStudent} setReferenceStudent={setReferenceStudent} />                
              </Stack>
            </CardContent>
          </Card>

          {/* Privacy info */}
          <PrivacyInfo setStudents={setStudents} />

          {/* Kart / NearbyList */}
          <Box>
            {view === 0 && (
              <Card>
                <CardContent>
                  <MapView students={students} reference={referenceStudent} />
                </CardContent>
              </Card>
            )}
            {view === 1 && (
              <Card>
                <CardContent>
                  <NearbyList
                    students={students.filter((s) => s.name !== referenceStudent?.name)}
                    reference={referenceStudent}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default App;
