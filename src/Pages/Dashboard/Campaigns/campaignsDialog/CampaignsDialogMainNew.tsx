import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssetsTab from "./AssetsTab";
import Conversations from "./conversations/Conversationtab";
import TimelineTab from "./TimelineTab";
import Tools from "./ToolsTab";
import OverviewTab from "./OverviewTab";
import CampaignDialogTitle from "./CampaignDialogTitle";
import { Campaign, CampaignManager, Creator } from "./types";
import { campaign, timelineEvents } from "./mockData";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

interface CampaignDetailDialogNewProps {
  openDialog?: boolean;
  handleCloseDialog: () => void;
  setDialogContent: (content: Campaign) => void; // Update type to Campaign
  creatorsToRemove?: Creator[]; // Update type to Creator[]
  setCreatorsToRemove: (creators: Creator[]) => void; // Update type to Creator[]
  blitzAutoCampaign: Campaign; // Update type to Campaign
  fetchCampaigns: () => void;
  managers: CampaignManager[]; // Update type to CampaignManager[]
  isTcc?: boolean;
  currentUserId: number;
}

const CampaignDetailDialogNew: React.FC<CampaignDetailDialogNewProps> = ({
  openDialog = true,
  handleCloseDialog,
  setDialogContent,
  creatorsToRemove = [],
  blitzAutoCampaign,
  managers,
  isTcc = true,
  currentUserId,
}) => {
  const dialogContent: Campaign = campaign;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [newPrices, setNewPrices] = useState<Record<string, any>>({});
  const [poNumber, setPoNumber] = useState<string>("PO-123456");
  const [isChanging, setChanging] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [currentManager, setCurrentManager] = useState<
    CampaignManager | undefined
  >(dialogContent?.campaign_manager);
  const [toggleManager, setToggleManager] = useState<boolean>(false);
  const [newAgencyRate, setNewAgencyRate] = useState<Record<string, any>>({});
  const isDraft = campaign?.campaign_status === "Draft";
  const isLaunched = campaign?.campaign_status === "Launched";
  const isAgency =
    campaign?.agency === true && campaign?.user_id === currentUserId;
  const totalCampaignSum = campaign?.campaign_sum || 0;
  const totalCreators = campaign?.creators?.length || 0;
  const creatorExpenseSum =
    campaign?.creators?.reduce((acc, creator) => acc + creator.price, 0) || 0;

  // Mock functions to replace actual implementations for simplicity
  const handleCreatorFieldChange = () => {};
  const toggleCreatorRemoval = () => {};
  const OnEditTimelineField = (
    targetIndex: number,
    target: string,
    value: any
  ) => {
    console.log("Edit Timeline Field", targetIndex, target, value);
  };
  const AddTimelineEvent = (creator: string) => {
    console.log("Add Timeline Event", creator);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="xl"
      fullWidth
      fullScreen={!isDesktop}
      scroll="paper"
      keepMounted={false}
    >
      <DialogTitle>
        <CampaignDialogTitle
          campaign={campaign}
          poNumber={poNumber}
          setPoNumber={setPoNumber}
        />
        <Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="campaign details tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                overflow: "visible",
                "& .MuiTab-root": {
                  fontSize: "1.1rem",
                },
              }}
            >
              <Tab label="OVERVIEW" />
              <Tab label="ASSETS" />
              <Tab label="TOOLS" />
              <Tab label="CONVERSATIONS" />
              <Tab label="TIMELINE" />
            </Tabs>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TabPanel value={tabIndex} index={0}>
          <OverviewTab
            campaignData={campaign}
            creatorsToRemove={creatorsToRemove}
            toggleCreatorRemoval={toggleCreatorRemoval}
            handleCreatorFieldChange={handleCreatorFieldChange}
            newPrices={newPrices}
            newAgencyRate={newAgencyRate}
            isAgency={isAgency}
            blitzAutoCampaign={blitzAutoCampaign}
            isDraft={isDraft}
            isLaunched={isLaunched}
            totalCampaignSum={totalCampaignSum}
            totalCreators={totalCreators}
            creatorExpenseSum={creatorExpenseSum}
            currentManager={currentManager}
            setCurrentManager={setCurrentManager}
            toggleManager={toggleManager}
            setToggleManager={setToggleManager}
            managers={managers}
            isTcc={isTcc}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <AssetsTab
            campaignDetails={dialogContent}
            onUpdate={setDialogContent}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Tools campaignDetails={dialogContent} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <Conversations creators={dialogContent?.creators} />
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <TimelineTab
            campaignDetails={dialogContent}
            onEditField={OnEditTimelineField}
            onCreateRow={AddTimelineEvent}
          />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignDetailDialogNew;
