import React from 'react';
import './ConnectionBox.css';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { AppBar, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
//import TextField from '@mui/material/TextField';

interface ConnectionBoxProps {
    connectionString: string;
    handleConnect: (connectionString: string) => void;
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(3),
    //     width: 'auto',
    // },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        // [theme.breakpoints.up('md')]: {
        //     width: '20ch',
        // },
    },
}));


function ConnectionBox(props: ConnectionBoxProps) {

    const [constr, setConstr] = React.useState(props.connectionString);

    const handleConnect = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        props.handleConnect(constr);
    };
    return (
        <AppBar position="static" style={{ "marginLeft": "auto", "marginRight": "auto" }}>
            <Toolbar>
                <Typography variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Connection String
                </Typography>
                <Search>
                    <StyledInputBase className="ConnectionStringBox"
                        value={constr} placeholder="Enter Connection String..."
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConstr(event.target.value ?? "")}
                    />
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