import React from 'react';
import './ConnectionBox.css';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { AppBar, TextField, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import { Warning } from '@mui/icons-material';
//import TextField from '@mui/material/TextField';

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
                    {/*
                    <TextField
                        className="ConnectionStringBox"
                        fullWidth
                        variant="outlined"
                        value={constr} placeholder="Enter Connection String..."
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConstr(event.target.value ?? "")}
                    />
    */}
                </Search>
                <IconButton
                    size="large"
                    onClick={handleConnect}
                    color="inherit"
                >
                    <CheckIcon />
                </IconButton>
            </Toolbar>
        </AppBar>


    );
}

export default ConnectionBox;


/*        <Stack horizontal className="ConnectionBox">
            <Label>
                Connection String:
            </Label>
placeholder="Enter connection string here"
                <StyledInputBase

                    inputProps={{ 'aria-label': 'connection string' }}
                />
            <PrimaryButton onClick={handleConnect}>Connect</PrimaryButton>

        </Stack>
*/