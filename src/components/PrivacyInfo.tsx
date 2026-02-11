import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Collapse,
  IconButton
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  localStorageKeys,
  lsStudentsDefault,
  useLocalStorage,
  type LSStudents
} from "../hooks/useLocalStorage";
import type { Student } from "./FileUpload";

type Props = {
  setStudents: (students: Student[]) => void;
};

const PrivacyInfo: React.FC<Props> = ({ setStudents }) => {
  const [expanded, setExpanded] = useState(true);

  const [lsStudents, , removeItem] =
    useLocalStorage<LSStudents>(
      localStorageKeys.students,
      lsStudentsDefault
    );

  const [, setSaveLocalStorage] =
    useLocalStorage<boolean>(
      localStorageKeys.storeInLocalStorage,
      false
    );

  const handleClearStoredData = () => {
    removeItem();
    setStudents([]);
    setSaveLocalStorage(false);
  };

  return (
    <Box
      sx={{
        my: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Typography variant="subtitle1">
          <b>Personvern</b>
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Collapsible content */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" gutterBottom>
            Filen du laster opp brukes kun her på denne siden.
            Ingenting blir sendt videre eller lagret noe annet sted.
            Når du lukker siden, forsvinner alt automatisk.
          </Typography>

          <Typography variant="body2">
            Vil du slippe å laste opp filen på nytt neste gang?
            Da kan du krysse av under, så husker nettleseren dataene
            på denne maskinen.
          </Typography>

          {lsStudents.students?.length && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Har du tidligere valgt å huske dataene på denne
                enheten? Du kan når som helst slette dem igjen.
              </Typography>

              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={handleClearStoredData}
                sx={{ mt: 1 }}
              >
                Slett lagrede data
              </Button>
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PrivacyInfo;
