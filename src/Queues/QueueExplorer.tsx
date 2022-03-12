import React, { useEffect } from "react";

import { formatBytesForPresentation, ifBooleanThenYesNoOtherwiseValue, convertTimespanToString } from "../AppUtils";

import './QueueExplorer.css';
import { Queue, ReceivedMessage } from "../AzureServiceBus/AzureServiceBusManager";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";

import { TabControl, TabPanel } from "../TabPanel";
import { MessageList } from "./MessageList";
import { MessageList2 } from "./MessageList2";
import { MessageInputDialog } from "../MessageInputDialog";

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





export function QueueExplorer(props: QueueExplorerProps) {

    const queue = props.queue;

    const [runtimeStateLoaded, setRuntimeStateLoaded] = React.useState<any>(false);
    const [messageList, setMessageList] = React.useState(new PeekMessagesList());

    const [isSendingMessage, setIsSendingMessage] = React.useState(false);

    // Load the runtime state for the queue and then update the UI
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


    return (<div className="queueExplorer">
        <h1>Queue: <span className="queueName">{queue.name}</span></h1>
        <TabControl onChange={(newIndex) => { }} tabGroupName={"queueExplorer"}       >
            <TabPanel key={queue.name + "-properties-tab"} title={"Properties"} >
                <div className="queuePropertiesTabPanelDiv">
                    <Box>
                        <h2>Queue Properties</h2>
                        <Grid container spacing={2}>
                            {GetValueSpan("Maximum Delivery Count", queue.maxDeliveryCount)}
                            {GetValueSpan("Forward To", queue.properties.forwardTo)}
                            {GetValueSpan("Forward DL To", queue.properties.forwardDeadLetteredMessagesTo)}
                            {GetValueSpan("Auto Delete on Idle", convertTimespanToString(queue.properties.autoDeleteOnIdle))}
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
                <div className="messagesTabPanelDiv">
                    <h2>Messages</h2>
                    <Box className="messagesBox"  >
                        <Button
                            variant="contained"
                            onClick={() => doPeekMessages(queue)}
                        >Peek Messages</Button>

                        <MessageList didError={messageList.didError} isLoaded={messageList.isLoaded}
                            queue={queue} />
                    </Box>
                </div>
            </TabPanel>
        </TabControl>

        <MessageInputDialog
            destination={queue}
        />

    </div >);
}