import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Box,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import client from "../../../API";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import { styled } from '@mui/material/styles';
import { StyledTableRow } from "../../../Utils/styledcell";

const Column = styled(Box)`
  flex: 1;
  padding: 1rem;
  box-sizing: border-box;
`;

const StyledGraphContainer = styled(Box)`
  max-width: 600px;
  margin: 20px;
  overflow: hidden;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #666;
`;

const RecentUpdatesBanner = styled(Box)`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
`;

const ActionCardGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const StyledYouTubeContainer = styled(Box)`
  border: 1px solid #666;
  border-radius: 10px;
  padding: 10px;
  margin: 20px 0;
`;

const Dashboard = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const [dataView, setDataView] = useState("campaigns");
  const [tabView, setTabView] = useState("table");
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [accountBalance, setAccountBalance] = useState("Loading...");
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    companyId: "",
    companyName: "",
    id: ""  // Add user ID field
  });
  const [companyName, setCompanyName] = useState("");
  const [creditline, setCreditline] = useState("Loading...");
  const [aggregateChartData, setAggregateChartData] = useState([]);

  const fetchHandler = {
    creators: useMutation(() => client.creators.listManager(userInfo.companyName), {
      onSuccess: (data) => setCreators(data.creators || []),
      onError: (error) => console.error("Error fetching creators:", error),
    }),
    campaigns: useMutation(client.campaigns.list, {
      onSuccess: (data) => setCampaigns(data),
      onError: (error) => console.error("Error fetching campaigns:", error),
    }),
    payouts: useMutation(client.payouts.list, {
      onSuccess: (data) => setPayouts(data.payouts || []),
      onError: (error) => console.error("Error fetching payouts:", error),
    }),
    invoices: useMutation(client.invoices.list, {
      onSuccess: (data) => setInvoices(data.invoices || []),
      onError: (error) => console.error("Error fetching invoices:", error),
    }),
  };

  useEffect(() => {
    if (isMounted) {
      fetchHandler[dataView].mutate();
    }
  }, [isMounted, dataView]);

  const handleDataViewChange = (event, newValue) => {
    setDataView(newValue);
  };

  const handleTabViewChange = (event, newValue) => {
    setTabView(newValue);
  };

  const ActionCard = ({ title, description, buttonText, route }) => (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(route)}>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );

  const tableHeaders = {
    creators: ["Creator", "TikTok", "Instagram", "YouTube", "Manager", "Email", "Date Added"],
    campaigns: [
      "Name",
      "Campaign Sum",
      "Proposal Date",
      "Brief",
      "Campaign Status",
    ],
    payouts: ["Creator ID", "Amount", "Payout Date", "BlitzPay", "Status"],
    invoices: ["Campaign/Creator", "Amount Due", "Status"],
  };

  const renderTableData = () => {
    const dataSets = { creators, campaigns, payouts, invoices };
    const data = dataSets[dataView] || [];
    return data.map((item, index) => (
      <StyledTableRow key={index}>
        {tableHeaders[dataView].map((header) => (
          <TableCell key={header}>
            {item[header.toLowerCase().replace(/\s/g, "_")]}
          </TableCell>
        ))}
      </StyledTableRow>
    ));
  };

  const { mutate: fetchUserInfo } = useMutation(client.users.fetchUser, {
    onSuccess: (data) => {
      const { first_name, last_name, company_name, id } = data;
      setUserInfo({
        firstName: first_name,
        lastName: last_name,
        companyName: company_name,
        id  // Set user ID from the user info
      });
      setCompanyName(company_name);
    },
    onError: (error) => {
      console.error("Error fetching user or company info:", error);
    },
  });

  const { mutate: fetchCompanyData } = useMutation(client.companies.listFetch, {
    onSuccess: (data) => {
      if (data && data.balance !== undefined && data.credit_line !== undefined) {
        setAccountBalance(`$${parseFloat(data.balance).toFixed(2)}`);
        setCreditline(
          data.credit_line
            ? `$${parseFloat(data.credit_line).toFixed(2)}`
            : "No Credit Line Established"
        );
      } else {
        console.error("Received data is not in the expected format:", data);
        setAccountBalance("Data format error");
        setCreditline("Data format error");
      }
    },
    onError: (error) => {
      console.error("Error fetching company data:", error);
      setAccountBalance("Error loading balance");
      setCreditline("Error loading credit line");
    },
  });

  useEffect(() => {
    isMounted && fetchUserInfo();
    fetchCompanyData();
  }, [isMounted]);

  const renderAggregateChart = () => (
    <StyledGraphContainer>
      <LineChart width={500} height={300} data={aggregateChartData}>
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </StyledGraphContainer>
  );

  const renderYouTubeVideos = () => (
    <StyledYouTubeContainer>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/c71osU3gK64"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/2KHaklKQJLc"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </StyledYouTubeContainer>
  );

  return (
    <>
      <Typography variant="h5" gutterBottom marginBlockStart={2} marginInlineStart={2}>Welcome to Blitz - Dashboard</Typography>

      <Column>
        <ActionCardGrid>
          <ActionCard
            title="Create a Campaign"
            description="Start a new campaign to engage creators and expand your outreach."
            buttonText="Create"
            route="/search"
          />
          <ActionCard
            title="View Campaigns"
            description="Review and manage your existing campaigns."
            buttonText="View"
            route="/campaigns"
          />
          <ActionCard
            title="Add A Creator"
            description="Generate your unique Signup link to have creators onboard seamlessly."
            buttonText="Generate Link"
            route={`/creatorsignup/${userInfo.companyName}`}
          />
          <ActionCard
            title="Make a Payout"
            description="Issue payments to your creators quickly and securely."
            buttonText="Pay"
            route="/blitzpay"
          />
          <ActionCard
            title="Earn By Sharing"
            description="Get a commission for sharing our platform with a friend!"
            buttonText="Share"
            route={`/requestaccess/${userInfo.id}`}
          />
        </ActionCardGrid>
        <Paper elevation={1} sx={{ overflowX: 'auto', maxWidth: '100%' }}>
          <Paper elevation={3} square={true} sx={{position:'sticky', left:0}}>
            <Tabs value={tabView} onChange={handleTabViewChange}>
              <Tab label="Table" value="table" />
              <Tab label="Usage" value="usage" />
              <Tab label="Tutorials" value="tutorials" />
            </Tabs>
          </Paper>
          {tabView === "table" && (
            <>
              <Paper elevation={3} square={true} sx={{position:'sticky', left:0}}>
                <Tabs value={dataView} onChange={handleDataViewChange}>
                  <Tab label="Creators" value="creators" />
                  <Tab label="Campaigns" value="campaigns" />
                  <Tab label="Payouts" value="payouts" />
                  <Tab label="Invoices" value="invoices" />
                </Tabs>
              </Paper>

              <Paper elevation={2} sx={{width:'fit-content'}}>
                <Table sx={{marginBlockStart:2}}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders[dataView].map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTableData()}</TableBody>
                </Table>
              </Paper>

            </>
          )}
          {tabView === "usage" && (
            <>
              <Typography variant="h6">Aggregate Usage</Typography>
              {renderAggregateChart()}
            </>
          )}
          {tabView === "tutorials" && (
            <>
              <Typography variant="h6">Watch Tutorials</Typography>
              {renderYouTubeVideos()}
            </>
          )}
        </Paper>
      </Column>
      <RecentUpdatesBanner>
        {/* <RecentUpdates /> */}
      </RecentUpdatesBanner>
    </ >
  );
};

export default Dashboard;
