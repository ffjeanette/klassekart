import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import FileUpload, { Student } from "./components/FileUpload";
import MapView from "./components/MapView";
import NearbyList from "./components/NearbyList";
import PrivacyInfo from "./components/PrivacyInfo";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
    background: { default: "#f4f6f8", paper: "#fff" },
    text: { primary: "#1a1a1a", secondary: "#555" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: { fontWeight: 600, marginBottom: "1rem" },
    body1: { fontSize: "1rem" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: "none", padding: "6px 16px" } } },
    MuiSelect: { styleOverrides: { root: { minWidth: 150 } } },
  },
});

const App: React.FC = () => {
  const [view, setView] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [referenceStudent, setReferenceStudent] = useState<Student | null>(null);
  const [loadingCount, setLoadingCount] = useState(0);

  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4">Klassekart</Typography>
          <Tabs value={view} onChange={(_, newValue) => setView(newValue)}>
            <Tab label="Kart" />
            <Tab label="I nærheten" />
          </Tabs>
        </Box>

        <PrivacyInfo />

        <Card elevation={3} sx={{ p: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Last opp klasseliste
            </Typography>
            <FileUpload setStudents={setStudents} />

            {students.length > 0 && (
              <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel id="referenceStudent">Velg elev</InputLabel>
                  <Select
                    size="small"
                    labelId="referenceStudent"
                    label="Velg elev"
                    value={referenceStudent?.name || students[0].name}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) setReferenceStudent(null);
                      else setReferenceStudent(students.find((s) => s.name === val) || null);
                    }}
                  >
                    {/*<MenuItem value="">Skien sentrum</MenuItem>*/}
                    {sortedStudents.map((s) => (
                      <MenuItem key={s.name} value={s.name}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="textSecondary">
                    Brukes som utgangspunkt for kart og liste
                  </Typography>
                </FormControl>

                {loadingCount > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">Venter på koordinater ({loadingCount})…</Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mt: 2 }}>
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
      </Container>
    </ThemeProvider>
  );
};

export default App;
