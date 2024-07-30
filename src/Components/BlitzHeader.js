import React from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
} from "@mui/material";
import blitzLogo from './globalAssets/platty.png'
import routes from "../Config/routes";


const BlitzHeader = ({ menuButton, children }) => {
    const navigate = useNavigate();
    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#000 !important",
                color: '#FFF !important'
            }}
        >
            <Toolbar>
                {menuButton}
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' flex={1} maxHeight='100%'>
                    <Box margin={0} flex={1}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="logo"
                            sx={{
                                margin: 0,
                                padding: 0,
                                "&.MuiButtonBase-root:hover": {
                                    bgcolor: "transparent"
                                }
                            }}
                            onClick={() => navigate(routes.home)}
                        >
                            <img
                                src={blitzLogo}
                                alt="logo"
                                style={{ height: "45px" }}
                            />
                        </IconButton>
                    </Box>
                    {children}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default BlitzHeader;
