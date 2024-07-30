import { ListItemButton } from '@mui/material';
import React from 'react';
import { Link as RouterLink} from "react-router-dom";

const ListItemLink = ({ to, children }) => {
    return (
        <ListItemButton component={RouterLink} to={to}>
            {children}
        </ListItemButton>
    );
};

export default ListItemLink;