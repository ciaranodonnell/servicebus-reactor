import React, { useState } from 'react';

import { AppBar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Toolbar, Typography } from '@mui/material';
import Button from '@mui/material/Button';

import { AppSettings } from './AppSettings';

export interface ConnectionListDialogProps {
    connectionStringSelected: (connectionString: string) => void;
    isOpen: boolean;
}

export function ConnectionListDialog(props: ConnectionListDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);


    const saveConns = AppSettings.savedConnections;

    const handleDialogClose = () => {
        setIsOpen(false);
    }
    let selectedConnection: "connectionString";
    const selectConnection = () => { props.connectionStringSelected(selectedConnection); }


    return (

        <Dialog
            fullScreen
            open={isOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Connect to Service Bus
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Enter the name for this connection to save it.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Connection Name"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={selectConnection} autoFocus>
                    Select
                </Button>
            </DialogActions>
        </Dialog>

    );
}
