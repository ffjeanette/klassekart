import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Collapse,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import { ExpandLess, ExpandMore, UploadFile } from "@mui/icons-material";

import useFileUpload from "../hooks/useFileUpload";
import { localStorageKeys, useLocalStorage } from "../hooks/useLocalStorage";

export type Student = { name: string; address: string; lat?: number; lng?: number; };

type FileUploadProps = { 
  setStudents: (students: Student[]) => void;
  students: Student[];
  setReferenceStudent: (student: Student | null) => void;
  referenceStudent: Student | null;
 };

const FileUpload: React.FC<FileUploadProps> = ({ setStudents, students,  setReferenceStudent, referenceStudent }) => {
  const {
    columns,
    nameCol,
    addressCol,
    zipCol,
    cityCol,
    parsed,
    fileName,
    loading,
    handleFile,
    handleParse,
    setNameCol,
    setAddressCol,
    setZipCol,
    setCityCol,
    loadingCount
  } = useFileUpload({ setStudents });

  const [expanded, setExpanded] = useState(true);
  const [saveInLocalStorage, setSaveLocalStorage] = useLocalStorage<boolean>(localStorageKeys.storeInLocalStorage, false);

  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack spacing={2}>
      {/* Header + expand/collapse */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ cursor: "pointer" }} onClick={() => setExpanded(prev => !prev)}>
        <Typography variant="h6">Last opp klasseliste</Typography>
        <IconButton size="small">{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Box>

      <Collapse in={expanded}>
        <Stack spacing={2}>
          {/* Steg 1: Velg fil */}
          <Stack
            spacing={2}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              borderLeft: "4px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>Steg 1: Velg fil og kolonner</Typography>
            <Button variant="contained" component="label" startIcon={<UploadFile />} sx={{ alignSelf: "start" }}>
              Velg Excel-fil (.xlsx, .xls)
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleFile} />
            </Button>
            {fileName && <Typography variant="body2">Valgt: <strong>{fileName}</strong></Typography>}

            <FormControlLabel
              control={<Checkbox checked={saveInLocalStorage} onChange={(e) => setSaveLocalStorage(e.target.checked)} />}
              label="Husk dataene på denne enheten"
            />
          </Stack>

          {/* Steg 2: Velg kolonner */}
          {columns.length > 0 && (
            <Stack
              mt={'-16px !important'}
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 0,
                backgroundColor: "#f5f5f5",
                borderLeft: "4px solid",
                borderColor: "primary.main",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>Velg kolonner</Typography>
              <Typography variant="body2" color="text.secondary">
                Velg kolonne som inneholder navn og adresse, så kan elevene vises på kartet.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} columnGap={2} flexWrap="wrap" alignItems="center">
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel shrink>Navn</InputLabel>
                  <Select size="small" value={nameCol} disabled={loading} onChange={(e) => setNameCol(e.target.value)}>
                    {columns.map((col) => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel shrink>Adresse</InputLabel>
                  <Select size="small" value={addressCol} disabled={loading} onChange={(e) => setAddressCol(e.target.value)}>
                    {columns.map((col) => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel shrink>Postnummer (valgfritt)</InputLabel>
                  <Select size="small" value={zipCol || ""} disabled={loading} onChange={(e) => setZipCol(e.target.value)}>
                    <MenuItem value="">Ingen</MenuItem>
                    {columns.map((col) => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel shrink>Sted (valgfritt)</InputLabel>
                  <Select size="small" value={cityCol || ""} disabled={loading} onChange={(e) => setCityCol(e.target.value)}>
                    <MenuItem value="">Ingen</MenuItem>
                    {columns.map((col) => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                  </Select>
                </FormControl>

                <Button variant="contained" color="success" onClick={handleParse} disabled={loading}>
                  {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                  Last inn elever
                </Button>
              </Stack>
            </Stack>
          )}

        {(loading || parsed || !!students?.length) && (
          <Stack
            spacing={1}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              borderLeft: "4px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>Steg 2: Velg elev</Typography>
            <Typography variant="body2" color="text.secondary">
              Velg hvilken elev du vil bruke som referanse for kart og liste.
            </Typography>
            <FormControl sx={{ minWidth: 220 }}>
                      <InputLabel id="referenceStudent">Velg elev</InputLabel>
                      <Select
                        size="small"
                        labelId="referenceStudent"
                        value={referenceStudent?.name || students?.[0]?.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setReferenceStudent(students.find((s) => s.name === val) || null);
                        }}
                      >
                        {sortedStudents.map((s) => (
                          <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                        ))}
                      </Select>
                      <Typography variant="caption" color="text.secondary">
                        Brukes som utgangspunkt for kart og liste
                      </Typography>
                    </FormControl>

                    {loadingCount > 0 && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={20} />
                        <Typography variant="body2">Venter på koordinater ({loadingCount})…</Typography>
                      </Stack>
                    )}
          </Stack>
        )}

        </Stack>
      </Collapse>
    </Stack>
  );
};

export default FileUpload;
