import React, { useEffect } from "react";

import './QueueExplorer.css';
import { Queue } from "./AzureServiceBus/AzureServiceBusManager";
//import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
//import Tab from '@mui/material/Tab';

import Box from '@mui/material/Box';
import { formatBytesForPresentation, ifBooleanThenYesNoOtherwiseValue } from "./AppUtils";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterSimpleParams } from '@mui/x-data-grid';
import { ReceivedMessage } from "./AzureServiceBus/ReceivedMessage";
import { TabControl, TabPanel } from "./TabPanel";
export interface QueueExplorerProps {
    queue: Queue;
}


class PeekMessagesList {
    isLoaded: boolean;
    isLoading: boolean;
    didError: boolean;
    constructor() {
        this.isLoaded = false;
        this.isLoading = false;
        this.didError = false;
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

function getValueOrLoading(value: string | number | undefined): string | number {
    return value === undefined ? "Loading..." : value;
}



function getGridColumns() {
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Message ID', width: 90 },
        {
            field: 'sequenceNumber',
            headerName: 'Seq',
            width: 100,
            editable: false,
            resizable: true,
        },
        {
            field: 'to',
            headerName: 'To',
            width: 100,
            editable: false,
            resizable: true,
        },
        {
            field: 'enqueuedTimeUtc',
            headerName: 'Enqueued UTC',
            width: 110,
            editable: false,
            resizable: true,
        },
        {
            field: 'scheduledEnqueuedTimeUtc',
            headerName: 'Scheduled Enqueued UTC',
            width: 110,
            editable: false,
            resizable: true,
        },
        {
            field: 'body',
            headerName: 'body',
            width: 110,
            editable: false,
            resizable: true,
            valueGetter: (params: GridValueGetterSimpleParams<ReceivedMessage>) => {
                const body = params.row.body ?? "";
                return body.length > 100 ? body.substr(0, 100) + "..." : body;
            },
        },
        {
            field: 'deliveryCount',
            headerName: 'Delivery Count',
            width: 110,
            editable: false,
            resizable: true,
        },
        {
            field: 'isScheduled',
            headerName: 'Scheduled',
            width: 110,
            editable: false,
        },
    ];
    return columns;
}

export function QueueExplorer(props: QueueExplorerProps) {

    console.log("QueueExplorer rendering");

    const queue = props.queue;

    const [runtimeStateLoaded, setRuntimeStateLoaded] = React.useState<any>(false);
    const [messageList, setMessageList] = React.useState(new PeekMessagesList());




    useEffect(() => {
        setRuntimeStateLoaded(false);
        queue.loadRuntimeValues().then(() => {
            console.log("Loaded queue runtime state");
            setRuntimeStateLoaded(true);
        });
    }, [queue]);


    function doPeekMessages(queue: Queue): PeekMessagesList {
        const list = new PeekMessagesList();
        list.isLoading = true;
        setMessageList(list);

        queue.peekMessages(10).then(messages => {
            console.log("Peeked messages: " + messages.length);
        }).catch(err => {
            console.log("Peeked messages err:" + err);
            list.didError = true;
        }).finally(() => {
            console.log("Peeked messages finally");
            const newList: PeekMessagesList = { isLoaded: true, isLoading: false, didError: list.didError };
            setMessageList(newList);
        });

        return list;
    }

    function getGridData(): GridRowsProp {
        const results = queue.lastReceivedMessages.map(m => {
            return { id: m.messageId, ...m };
        });
        console.log("getGridData: " + Object.entries(results[0]));
        return results;
    }

    return (<div className="queueExplorer">
        <h1>Queue: <span className="queueName">{queue.name}</span></h1>
        <TabControl onChange={(newIndex) => { }} tabGroupName={"queueExplorer"}       >
            <TabPanel key={queue.name + "-properties-tab"} title={"Properties"} >
                <div>
                    <Box>
                        <h2>Queue Properties</h2>
                        <Grid container spacing={2}>
                            {GetValueSpan("Maximum Delivery Count", queue.maxDeliveryCount)}
                            {GetValueSpan("Forward To", queue.properties.forwardTo)}
                            {GetValueSpan("Forward DL To", queue.properties.forwardDeadLetteredMessagesTo)}
                            {GetValueSpan("Auto Delete on Idle", queue.properties.autoDeleteOnIdle)}
                            {GetValueSpan("Requires Sessions", ifBooleanThenYesNoOtherwiseValue(queue.requiresSession))}
                        </Grid>
                    </Box>
                    <Box>
                        <h2>Runtime Properties</h2>
                        <Grid container spacing={2}>
                            {GetValueSpan("Total Messages", getValueOrLoading(queue.totalMessageCount))}
                            {GetValueSpan("Size", getValueOrLoading(formatBytesForPresentation(queue.sizeInBytes)))}

                            {GetValueSpan("Active Messages", getValueOrLoading(queue.activeMessageCount))}
                            {GetValueSpan("Dead Lettered Messages", getValueOrLoading(queue.deadLetterMessageCount))}

                            {GetValueSpan("Transfer Messages", getValueOrLoading(queue.transferMessageCount))}
                            {GetValueSpan("Dead Transfer Messages", getValueOrLoading(queue.transferDeadLetterMessageCount))}

                        </Grid>
                    </Box>

                </div>
            </TabPanel>
            <TabPanel key={queue.name + "-properties-tab"} title="Messages">
                <div>
                    <h2>Messages</h2>
                    <Box >
                        <Button
                            onClick={() => doPeekMessages(queue)}
                        >Peek Messages</Button>
                        {messageList.isLoaded ? (
                            <div style={{ height: '500px' }}>
                                <DataGrid
                                    columns={getGridColumns()}
                                    rows={getGridData()}
                                ></DataGrid>
                            </div>
                        ) : (<div></div>)}
                    </Box>
                </div>
            </TabPanel>
        </TabControl>
    </div >);
}