import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../../API"; // Ensure this is the correct path
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Chip,
    Paper
} from "@mui/material";
import routes from "../../../../Config/routes.js";
import CampaignsContainers from "./creatorContainers.js";
import blitzLogo from "../../../../Components/globalAssets/platty.png";
import CRMDialog from "../../../Misc/crmComponents/crmPopup.js";

const AgencyDetailsPage = () => {
    const { manager } = useParams();
    const [creators, setCreators] = useState(null);
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState("pretty"); // "list" or "pretty"
    const [showCRMDialog, setShowCRMDialog] = useState(true);

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const data = await client.creators.listManager(manager);
                //console.log(data.creators);
                setCreators(data.creators);

            } catch (err) {
                console.error('Failed to fetch creators:', err);
            }
        };
        fetchCreators();
    }, []);

    const handleCloseCRMDialog = () => {
        setShowCRMDialog(false);
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    if (!creators) {
        return (
            <Typography
                sx={{
                    width: "100vw",
                    height: "100vh",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Loading campaign details...
            </Typography>
        );
    }

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: "#000" }}>
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="logo"
                            onClick={() => navigate(routes.campaigns)}
                        >
                            <img
                                src={blitzLogo}
                                alt="logo"
                                style={{ width: "120px", height: "50px" }}
                            />
                        </IconButton>
                    </Box>
                    <Box
                        display="flex"
                        flexGrow={1}
                        justifyContent="center"
                        style={{ flexGrow: 2 }}
                    >
                        {/* Navigation items here */}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ margin: 4 }}>
                <Box
                    sx={{
                        margin: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Agency Roster Presented by: {manager}
                        </Typography>
                        <Button color="inherit" onClick={() => handleViewChange("list")}>
                        See in List
                        </Button>
                        <Button color="inherit" onClick={() => handleViewChange("pretty")}>
                            Make it Pretty
                        </Button>
                    </div>
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6">Creators</Typography>
                {viewMode === "list" ? (
                    <Paper height={1}>
                    <List>
                        {creators.map((creator, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}>
                                <Divider></Divider>
                                <ListItemText
                                    primary={creator.creator ?? ""}
                                    secondary={`Following: ${creator.following ?? 0}`}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}>{creator.youtube && (
                                        <Chip
                                        label={`Youtube followers: ${creator.youtube ?? 0}`}
                                        color="primary"
                                        />
                                    )}
                                    {creator.instagram && (
                                        <Chip
                                        label={`Instagram followers: ${creator.instagram ?? 0}`}
                                        color="primary"
                                        />
                                    )}
                                    {creator.tiktok && (
                                        <Chip
                                        label={`Tiktok followers: ${creator.tiktok ?? 0}`}
                                        color="primary"
                                        />
                                    )}
                                    {creator.youtube_link && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                        <a
                                            href={creator.youtube_link ?? ""}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on Youtube
                                        </a>
                                    </Typography>
                                    )}
                                    {creator.instagram_link && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                        <a
                                            href={creator.instagram_link ?? ""}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on Instagram
                                        </a>
                                    </Typography>
                                    )}
                                    {creator.tiktok_link && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                        <a
                                            href={creator.tiktok_link ?? ""}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on Tiktok
                                        </a>
                                    </Typography>
                                    )}
                                    
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    </Paper>
                ) : (
                    // Prettified view using the CampaignsContainers component
                    <CampaignsContainers
                        creators={creators}
                    />
                )}
            </Box>
            {showCRMDialog && (
                <CRMDialog
                    isOpen={showCRMDialog}
                    handleClose={handleCloseCRMDialog}
                    origin={`${manager} - roster`} // Passing dynamic origin based on fetched creator details
                />
            )}
        </>
    );
};

export default AgencyDetailsPage;
