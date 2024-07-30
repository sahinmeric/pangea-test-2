import React, { useState, useEffect, useRef } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from "@mui/material";


const AlertDialog = ({ alertState, fullWidth=true, maxWidth='sm' }) => {
    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={alertState.isOpen}
            onClose={alertState.onClose}>
            <DialogTitle>{alertState.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {alertState.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {alertState.buttonTwo && <Button onClick={alertState.onClose} color="secondary">
                    {alertState.buttonTwo}
                </Button>}
                <Button onClick={alertState.onAccept} color="primary">
                    {alertState.buttonOne}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog