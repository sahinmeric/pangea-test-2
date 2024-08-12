import { Routes, Route } from 'react-router-dom';
import CampaignDetailDialog from './Pages/Dashboard/Campaigns/campaignsDialog/campaignsDialogMain';
import CampaignDetailDialogNew from './Pages/Dashboard/Campaigns/campaignsDialog/CampaignsDialogMainNew';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<CampaignDetailDialogNew />} />
        <Route path="/home" element={<CampaignDetailDialog />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
