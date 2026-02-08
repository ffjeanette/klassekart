import React, { useState } from "react";
import {
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from "@mui/material";
import readXlsxFile from "read-excel-file";
import UploadIcon from "@mui/icons-material/Upload";
import { geocodeAddress } from "./MapView";

export type Student = {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
};

type FileUploadProps = {
  setStudents: (students: Student[]) => void;
};

const buildFullAddress = (
  row: any,
  header: string[],
  addrCol?: string,
  zipCol?: string,
  cityCol?: string
) => {
  const parts: string[] = [];
  if (addrCol) parts.push(row[header.indexOf(addrCol)]?.toString() || "");
  if (zipCol) parts.push(row[header.indexOf(zipCol)]?.toString() || "");
  if (cityCol) parts.push(row[header.indexOf(cityCol)]?.toString() || "");
  return parts.join(", ");
};

const FileUpload: React.FC<FileUploadProps> = ({ setStudents }) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [nameCol, setNameCol] = useState<string>("");
  const [addressCol, setAddressCol] = useState<string>("");
  const [zipCol, setZipCol] = useState<string | undefined>();
  const [cityCol, setCityCol] = useState<string | undefined>();
  const [parsed, setParsed] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setParsed(false);

    readXlsxFile(selectedFile).then((rows) => {
      if (rows.length === 0) return;
      const header = rows[0] as string[];
      setColumns(header);

      if (!nameCol) setNameCol(header.find((h) => /navn/i.test(h)) || header[0]);
      if (!addressCol) setAddressCol(header.find((h) => /adresse/i.test(h)) || header[1]);
      if (!zipCol) setZipCol(header.find((h) => /postnr|postkode/i.test(h)));
      if (!cityCol) setCityCol(header.find((h) => /sted|by|kommune/i.test(h)));
    });
  };

  const handleParse = async () => {
    if (!file || !nameCol || !addressCol) return;
  
    setLoading(true);
  
    const rows = await readXlsxFile(file);
    const header = rows[0] as string[];
    const dataRows = rows.slice(1);
  
    const newStudents: Student[] = [];
  
    for (const row of dataRows) {
      const name = row[header.indexOf(nameCol)]?.toString() || "";
      const address = buildFullAddress(row, header, addressCol, zipCol, cityCol);
  
      // Hent koordinater for hver elev
      const coords = await geocodeAddress(address);
      const student: Student = { name, address, lat: coords.lat, lng: coords.lng };
  
      newStudents.push(student);
  
      // Oppdater state etter hver elev → MapView oppdateres live
      setStudents([...newStudents]);
    }
  
    setParsed(true);
    setLoading(false);
  };
  

  return (
    <Box sx={{ my: 2 }}>
      {fileName ? (
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Lastet opp: {fileName}
        </Typography>
      ) : (
        <Button
          variant="contained"
          component="label"
          color="primary"
          startIcon={<UploadIcon />}
          sx={{ borderRadius: 3, py: 1.5, px: 3, fontWeight: 600 }}
        >
          Last opp Excel-fil (.xlsx, .xls)
          <input type="file" hidden accept=".xlsx, .xls" onChange={handleFile} />
        </Button>
      )}



      {!parsed && columns.length > 0 && (
        <>
        <Typography variant="body2" sx={{ mb: 2, fontWeight:"bold", color: "HighlightText" }}>
          Steg 2: Filen kan ha litt forskjellig oppsett. 
        </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "HighlightText" }}>

          Velg hvilken kolonne som inneholder navn, adresse osv., så kan vi vise elevene på kartet.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel shrink>Navn kolonne</InputLabel>
            <Select disabled={loading} size="small" value={nameCol} onChange={(e) => setNameCol(e.target.value)} label="Navn kolonne" required>
              {columns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel shrink>Adresse kolonne</InputLabel>
            <Select disabled={loading} size="small" value={addressCol} onChange={(e) => setAddressCol(e.target.value)} label="Adresse kolonne" required>
              {columns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel shrink>Postnr kolonne (valgfritt)</InputLabel>
            <Select disabled={loading}  size="small" value={zipCol || ""} onChange={(e) => setZipCol(e.target.value)} label="Postnr kolonne (valgfritt)">
              <MenuItem value="">Ingen</MenuItem>
              {columns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="cityCol">Sted kolonne (valgfritt)</InputLabel>
            <Select disabled={loading} size="small" labelId="cityCol" value={cityCol || ""} label="Sted kolonne (valgfritt)" onChange={(e) => setCityCol(e.target.value)}>
              <MenuItem value="">Ingen</MenuItem>
              {columns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained"
          color="primary" onClick={handleParse} disabled={loading}>
            {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
            Last inn elever
          </Button>
        </Box></>
      )}
    </Box>
  );
};

export default FileUpload;
