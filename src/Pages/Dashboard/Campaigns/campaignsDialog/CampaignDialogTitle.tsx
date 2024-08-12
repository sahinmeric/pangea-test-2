import React from "react";
import { Stack, Typography, TextField, Box } from "@mui/material";
import { formatIdealDueDate } from "./utils";
import { Campaign } from "./types";

interface CampaignDialogTitleProps {
  campaign: Campaign;
  poNumber: string;
  setPoNumber: (poNumber: string) => void;
}

const CampaignDialogTitle: React.FC<CampaignDialogTitleProps> = ({
  campaign,
  poNumber,
  setPoNumber,
}) => {
  return (
    <Stack>
      <Stack alignItems="center" justifyContent="flex-start" direction="column">
        <Typography variant="h5">CAMPAIGN DETAILS</Typography>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          label="PO Number"
          required
          value={poNumber}
          onChange={() => {}}
          size="small"
          sx={{ maxWidth: 150 }}
        />
      </Box>
      <Stack spacing={1}>
        <Typography variant="body2">
          <strong>Name:</strong> {campaign?.name}
        </Typography>
        <Typography variant="body2">
          <strong>Due date: </strong>
          {formatIdealDueDate(campaign?.ideal_duedate)}
        </Typography>
        <Typography variant="body2">
          <strong>Manager:</strong> {campaign?.campaign_manager?.name}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {campaign?.campaign_manager?.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CampaignDialogTitle;
