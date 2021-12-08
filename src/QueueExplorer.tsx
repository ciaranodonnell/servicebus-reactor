import React, { useEffect } from "react";

import './QueueExplorer.css';
import { Queue } from "./AzureServiceBusManager";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { couldStartTrivia } from "typescript";

export interface QueueExplorerProps {
    queue: Queue;
}

function GetValueSpan(name: string, value: string | number | undefined): JSX.Element {
    return (
        <>
            <Grid item xs={3}>
                <span className="fieldPrompt">{name}:</span>
            </Grid>
            <Grid item xs={3}>
                {value === undefined ?
                    (<span className="missingValue"> - </span>) :
                    (<span className="value">{value}</span>)
                }
            </Grid>
        </>
    );
}


export function QueueExplorer(props: QueueExplorerProps) {

    const queue = props.queue;

    const [runtimeStateLoaded, setRuntimeStateLoaded] = React.useState<any>(false);

    useEffect(() => {
        setRuntimeStateLoaded(false);
        queue.loadRuntimeValues().then(() => {
            console.log("Loaded runtime state");
            setRuntimeStateLoaded(true);
        });
    }, [queue]);

    return <div className="queueExplorer">
        <h1>{queue.name}</h1>

        <Grid container spacing={2}>
            {GetValueSpan("Maximum Delivery Count", queue.maxDeliveryCount)}
            {GetValueSpan("Forward To", queue.properties.forwardTo)}
            {GetValueSpan("Forward DL To", queue.properties.forwardDeadLetteredMessagesTo)}
            {GetValueSpan("Auto Delete on Idle", queue.properties.autoDeleteOnIdle)}
            {GetValueSpan("Active Messages", queue.activeMessageCount === undefined ? "Loading..." : queue.activeMessageCount)}
            {GetValueSpan("Loaded", runtimeStateLoaded)}
        </Grid>
    </div >;
}