import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';

export function RefreshButton(props: { clicked: () => void }) {
    const clicked = props.clicked ?? (() => { });

    return (<IconButton aria-label="refresh section" onClick={(event) => clicked()}>
        <RefreshIcon />
    </IconButton >)
}