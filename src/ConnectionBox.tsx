import React from 'react';
import './ConnectionBox.css';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { AppBar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';

import ListIcon from '@mui/icons-material/List';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ConnectionListDialog } from './ConnectionListDialog';
import { env } from 'process';

import { AppSettings } from './AppSettings';

interface ConnectionBoxProps {
    connectionString: string;
    handleConnect: (connectionString: string) => void;
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
}));
const ConnectionStringInputBox = styled(TextField)(({ theme }) => ({
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    color: 'white',
    '& label.Mui-focused': {
        color: 'white',
        width: '100%',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'light-grey', color: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'grey', color: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white', color: 'white',
        },
    },
}));


function ConnectionBox(props: ConnectionBoxProps) {

    const [constr, setConstr] = React.useState(props.connectionString);

    const handleConnect = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        props.handleConnect(constr);
    };

    const [showEnterNameDialog, setShowEnterNameDialog] = React.useState<boolean>(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setShowEnterNameDialog(true);
    };
    const handleClose = () => {
        setShowEnterNameDialog(false);
    };


    const saveConns = AppSettings.savedConnections;

    const connectionStringSelected = (value: string) => {
        setConstr(value);
        handleClose();
    }


    return (
        <AppBar position="static" style={{ "marginLeft": "auto", "marginRight": "auto", "color": "white" }}>
            <Toolbar>
                <Typography variant="h6"
                    noWrap component="div"
                    sx={{ display: { xs: 'none', sm: 'block' }, color: 'white' }}>
                    Connection String
                </Typography>
                <Search>
                    <ConnectionStringInputBox
                        className="ConnectionStringBox"
                        fullWidth
                        variant="outlined"
                        color='info'
                        value={constr} placeholder="Enter Connection String..."
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConstr(event.target.value ?? "")} />
                </Search>
                <IconButton
                    size="large"
                    onClick={handleMenuClick}
                    color="inherit"
                >
                    <ListIcon />
                </IconButton>
                <IconButton
                    size="large"
                    onClick={handleConnect}
                    color="inherit"
                >
                    <CheckIcon />
                </IconButton>
            </Toolbar>

            <ConnectionListDialog isOpen={showEnterNameDialog} connectionStringSelected={connectionStringSelected} />
        </AppBar>


    );
}

export default ConnectionBox;
