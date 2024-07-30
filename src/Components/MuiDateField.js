import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const MuiDateField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
      colorScheme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  }));

export default MuiDateField