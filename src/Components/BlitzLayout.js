import React, { useState } from 'react';
import Navbar from './Navbar/NavBar';
import { Box, Toolbar, IconButton } from '@mui/material';
import { drawerWidth } from '../Utils/constants';
import useIsDesktop from '../Hooks/useIsDesktop';
import BlitzHeader from './BlitzHeader';
import MenuIcon from '@mui/icons-material/Menu';

const BlitzLayout = ({children, containerStyle={}}) => {
    const isDesktop = useIsDesktop();
    const [isOpen, setIsOpen] = useState(false);

    const CloseDrawer = () =>{
        console.log("Clossing dialog.");
        setIsOpen(false);
    }

    return (
        <>
            <Navbar isDesktop={isDesktop} isOpen={isOpen} onClose={()=>setIsOpen(false)}></Navbar>
            {!isDesktop && <>
                <BlitzHeader menuButton={
                    <IconButton edge="start" onClick={()=>setIsOpen(true)} sx={{color:'#FFF'}}>
                        <MenuIcon />
                    </IconButton>
                }></BlitzHeader>
                <Toolbar></Toolbar>
            </>}
            <Box
                id='TopPageContainer'
                sx={{
                    ...containerStyle,
                    minWidth: {
                        xs: '100%',
                        md: `calc(100% - ${drawerWidth})`,
                    },
                    marginInlineStart: {
                        xs: 0,
                        md: drawerWidth
                    }
                }}>
                    {children}
                </Box>
        </>
    );
};

export default BlitzLayout;
