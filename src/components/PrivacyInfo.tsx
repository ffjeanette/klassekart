import React from "react";
import { Box, Typography } from "@mui/material";

const PrivacyInfo: React.FC = () => (
  <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
    <Typography variant="subtitle1"><b>Personvern</b></Typography>
    <Typography variant="body2">
      Data behandles kun i nettleseren din og lagres ikke. Når du lukker siden, forsvinner all informasjon.
    </Typography>
  </Box>
);

export default PrivacyInfo;
