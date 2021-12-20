import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';

export function RefreshButton(props: { clicked: () => void }) {
    return (<IconButton aria-label="refresh section">
        <RefreshIcon />
    </IconButton>)
}