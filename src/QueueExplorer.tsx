import React, { useEffect } from "react";

import './QueueExplorer.css';
import { Queue } from "./AzureServiceBus/AzureServiceBusManager";
//import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { FormatBytesForPresentation } from "./AppUtils";
export interface QueueExplorerProps {
    queue: Queue;
}

function IfBooleanThenYesNoOtherwiseValue(value: any): any {
    if (value === true || value === false) {
        return value ? "Yes" : "No";
    } else {
        return value;
    }
}

function GetValueSpan(name: string, value: string | number | boolean | undefined): JSX.Element {
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

function ValueOrLoading(value: string | number | undefined): string | number {
    return value === undefined ? "Loading..." : value;
}

export function QueueExplorer(props: QueueExplorerProps) {

    const queue = props.queue;

    const [runtimeStateLoaded, setRuntimeStateLoaded] = React.useState<any>(false);

    useEffect(() => {
        setRuntimeStateLoaded(false);
        queue.loadRuntimeValues().then(() => {
            console.log("Loaded queue runtime state");
            setRuntimeStateLoaded(true);
        });
    }, [queue]);

    return <div className="queueExplorer">
        <h1>Queue: <span className="queueName">{queue.name}</span></h1>
        <Box>
            <h2>Queue Properties</h2>
            <Grid container spacing={2}>
                {GetValueSpan("Maximum Delivery Count", queue.maxDeliveryCount)}
                {GetValueSpan("Forward To", queue.properties.forwardTo)}
                {GetValueSpan("Forward DL To", queue.properties.forwardDeadLetteredMessagesTo)}
                {GetValueSpan("Auto Delete on Idle", queue.properties.autoDeleteOnIdle)}
                {GetValueSpan("Requires Sessions", IfBooleanThenYesNoOtherwiseValue(queue.requiresSession))}
            </Grid>
        </Box>
        <Box>
            <h2>Runtime Properties</h2>
            <Grid container spacing={2}>
                {GetValueSpan("Total Messages", ValueOrLoading(queue.totalMessageCount))}
                {GetValueSpan("Dead Lettered Messages", ValueOrLoading(FormatBytesForPresentation(queue.sizeInBytes)))}

                {GetValueSpan("Active Messages", ValueOrLoading(queue.activeMessageCount))}
                {GetValueSpan("Dead Lettered Messages", ValueOrLoading(queue.deadLetterMessageCount))}

                {GetValueSpan("Transfer Messages", ValueOrLoading(queue.transferMessageCount))}
                {GetValueSpan("Dead Transfer Messages", ValueOrLoading(queue.transferDeadLetterMessageCount))}

            </Grid>
        </Box>
    </div >;
}