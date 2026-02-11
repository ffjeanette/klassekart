import React, { useState } from "react";
import readXlsxFile from "read-excel-file";
import { geocodeAddress } from "../components/MapView";
import { localStorageKeys, lsStudentsDefault, useLocalStorage, type LSStudents } from "../hooks/useLocalStorage";

export type Student = { name: string; address: string; lat?: number; lng?: number; };


const buildFullAddress = (row: any, header: string[], addrCol?: string, zipCol?: string, cityCol?: string) => {
    const parts: string[] = [];
    if (addrCol) parts.push(row[header.indexOf(addrCol)]?.toString() || "");
    if (zipCol) parts.push(row[header.indexOf(zipCol)]?.toString() || "");
    if (cityCol) parts.push(row[header.indexOf(cityCol)]?.toString() || "");
    return parts.join(", ");
  };
  

const useFileUpload = ({
    setStudents
}: {
    setStudents: (students: Student[]) => void;
}) => {
    const [loadingCount, setLoadingCount] = useState(0);

    const [columns, setColumns] = useState<string[]>([]);
    const [nameCol, setNameCol] = useState<string>("");
    const [addressCol, setAddressCol] = useState<string>("");
    const [zipCol, setZipCol] = useState<string | undefined>();
    const [cityCol, setCityCol] = useState<string | undefined>();
    const [parsed, setParsed] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

  const [lsStudents, setLocalStorage] = useLocalStorage<LSStudents>(localStorageKeys.students, lsStudentsDefault);
  const [saveInLocalStorage] = useLocalStorage<boolean>(localStorageKeys.storeInLocalStorage, false);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setParsed(false);

    readXlsxFile(selectedFile).then((rows) => {
      if (!rows.length) return;
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
      const coords = await geocodeAddress(address);
      newStudents.push({ name, address, lat: coords.lat, lng: coords.lng });
      setStudents([...newStudents]);
    }

    setParsed(true);
    setLoading(false);

    if (saveInLocalStorage) {
      setLocalStorage({ students: newStudents, fileName });
    }
  };

  return {
    lsStudents, 
    columns,
    nameCol,
    setNameCol,
    addressCol,
    setAddressCol,
    zipCol,
    setZipCol,
    cityCol,
    setCityCol,
    parsed,
    fileName,
    handleFile,
    handleParse,
    loading,
    loadingCount
  }

}

export default useFileUpload