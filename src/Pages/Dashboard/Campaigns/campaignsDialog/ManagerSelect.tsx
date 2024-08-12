import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { CampaignManager } from "./types";

interface ManagerSelectProps {
  managers: CampaignManager[];
  currentManager: CampaignManager;
  setCurrentManager: (manager: CampaignManager) => void;
}

const ManagerSelect: React.FC<ManagerSelectProps> = ({
  managers,
  currentManager,
  setCurrentManager,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedManager = managers.find(
      (manager) => manager.name === event.target.value
    );
    if (selectedManager) {
      setCurrentManager(selectedManager);
    }
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 240 }}>
      <InputLabel id="label-managers">Manager</InputLabel>
      <Select
        labelId="label-managers"
        value={currentManager?.name || ""}
        onChange={handleChange}
        label="Manager"
      >
        {managers.map((manager) => (
          <MenuItem key={manager.email} value={manager.name}>
            {manager.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ManagerSelect;
