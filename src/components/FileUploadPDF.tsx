import React from "react";
import { Typography, Box } from "@mui/material";
import type { Student } from "./FileUpload";

import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


type FileUploadPDFProps = {
  setStudents: (students: Student[]) => void;
};

const FileUploadPDF: React.FC<FileUploadPDFProps> = ({ setStudents }) => {
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(" ") + "\n";
    }

    const lines = text.split("\n");
    const studentLines = lines.filter((line) => /\d{4}/.test(line));
    debugger
    const students: Student[] = studentLines.map((line) => {
      const parts = line.trim().split(/\s{2,}|\t/);
      return {
        name: parts[1] ? `${parts[1]}` : "",
        address: parts[3] || "",
      };
    });

    setStudents(students);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Last opp PDF med klasseliste</Typography>
      <input type="file" accept=".pdf" onChange={handleFile} />
    </Box>
  );
};

export default FileUploadPDF;
