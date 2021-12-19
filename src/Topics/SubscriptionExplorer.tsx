import React, { useEffect } from "react";

import { formatBytesForPresentation, ifBooleanThenYesNoOtherwiseValue, convertTimespanToString } from "../AppUtils";

import './TopicList.css';
import '../App.css';

import { Subscription } from "../AzureServiceBus/AzureServiceBusManager";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";

import { TabControl, TabPanel } from "../TabPanel";
import { MessageList } from "../Queues/MessageList";

import { InProgressActivityReport, ApplicationProps } from "../ApplicationHooks";

export interface SubscriptionExplorerProps extends ApplicationProps {
    subscription: Subscription;
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



function ActiveMessageDetails(props: { subscription: Subscription }) {
    const subscription = props.subscription;
    return (<
        Grid container spacing={2}>
        {GetValueSpan("Total Messages", getValueOrLoading(subscription.totalMessageCount))}

        {GetValueSpan("Active Messages", getValueOrLoading(subscription.activeMessageCount))}
        {GetValueSpan("Dead Lettered Messages", getValueOrLoading(subscription.deadLetterMessageCount))}

        {GetValueSpan("Transfer Messages", getValueOrLoading(subscription.transferMessageCount))}
        {GetValueSpan("Dead Transfer Messages", getValueOrLoading(subscription.transferDeadLetterMessageCount))}

    </Grid>);
}




function MessageTaskButtons(props: { subscription: Subscription, reportActivity: (report: InProgressActivityReport) => void }) {
    const subscription = props.subscription;
    const reportActivity = props.reportActivity;
    function sendDLQBackToTopic() {
        subscription.sendDLQBackToTopic(
            (done, of) => {
                reportActivity(new InProgressActivityReport("subSendDLQBack", `Sending DQL back to Topic ${subscription.topicName}`,
                    "inProgress", done, of));
                console.log("sendDLQBackToTopic done some");
            }
        ).then(() => {
            console.log("Sent DLQ messages back to topic");
            reportActivity(new InProgressActivityReport("subSendDLQBack", `Sending DQL back to Topic ${subscription.topicName}`,
                "completed", 0, 0));
        }).catch(err => {
            console.log("Sent DLQ messages back to topic err:" + err);
            reportActivity(new InProgressActivityReport("subSendDLQBack", `Sending DQL back to Topic ${subscription.topicName}`,
                "failed", 0, 0));
        });
    }

    return (<div><Button className={"actionButton"}
        variant="contained"
        onClick={() => sendDLQBackToTopic()}
    >Resend all DLQ</Button>
    </div >);
}

export function SubscriptionExplorer(props: SubscriptionExplorerProps) {

    const subscription = props.subscription;
    const outerReportActivity = props.hooks.reportActivity;
    const [runtimeStateLoaded, setRuntimeStateLoaded] = React.useState<any>(false);
    const [messageList, setMessageList] = React.useState(new PeekMessagesList());
    const [doingOperation, setDoingOperation] = React.useState({ isDoing: false, done: 0, of: 0 });


    function reportActivity(report: InProgressActivityReport) {

        setDoingOperation({ isDoing: report.state == "inProgress", done: report.done, of: report.total });

        if (outerReportActivity !== undefined) outerReportActivity(report);
    }

    // Load the runtime state for the subscription and then update the UI
    useEffect(() => {
        setRuntimeStateLoaded(false);
        subscription.loadRuntimeValues().then(() => {
            console.log("Loaded subscription runtime state");
            setRuntimeStateLoaded(true);
        });
    }, [subscription]);


    function doPeekMessages(subscription: Subscription): PeekMessagesList {
        const list = new PeekMessagesList();
        list.isLoading = true;
        setMessageList(list);

        subscription.peekMessages(10).then(messages => {
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

    function doPeekDLQ(subscription: Subscription): PeekMessagesList {
        const list = new PeekMessagesList();
        list.isLoading = true;
        setMessageList(list);

        reportActivity(new InProgressActivityReport("peekDLQ", `Peeking the DLQ for Subscription '${subscription.name}'`, "inProgress", 0, 0));
        subscription.peekDLQ(10).then(messages => {
            reportActivity(new InProgressActivityReport("peekDLQ", `Peeking the DLQ for Subscription '${subscription.name}'`, "completed", 0, 0));
        }).catch(err => {
            reportActivity(new InProgressActivityReport("peekDLQ", `Peeking the DLQ for Subscription '${subscription.name}'`, "failed", 0, 0));
            list.didError = true;
        }).finally(() => {
            const newList: PeekMessagesList = { isLoaded: true, isLoading: false, didError: list.didError };
            setMessageList(newList);
        });

        return list;
    }


    return (<div className="subscriptionExplorer">
        <h1>Subscription: <span className="subscriptionName">{subscription.name}</span></h1>
        <TabControl onChange={(newIndex) => { }} tabGroupName={"subscriptionExplorer"}       >
            <TabPanel key={subscription.name + "-properties-tab"} title={"Properties"} >
                <div className="subscriptionPropertiesTabPanelDiv">
                    <Box>
                        <h2>Subscription Properties</h2>
                        <Grid container spacing={2}>
                            {GetValueSpan("Maximum Delivery Count", subscription.maxDeliveryCount)}
                            {GetValueSpan("Forward To", subscription.properties.forwardTo)}
                            {GetValueSpan("Forward DL To", subscription.properties.forwardDeadLetteredMessagesTo)}
                            {GetValueSpan("Auto Delete on Idle", convertTimespanToString(subscription.properties.autoDeleteOnIdle))}
                            {GetValueSpan("Requires Sessions", ifBooleanThenYesNoOtherwiseValue(subscription.requiresSession))}
                        </Grid>
                    </Box>
                    <Box>
                        <h2>Runtime Properties</h2>
                        <ActiveMessageDetails subscription={subscription} />
                    </Box>

                </div>
            </TabPanel>
            <TabPanel key={subscription.name + "-properties-tab"} title="Messages">
                <ActiveMessageDetails subscription={subscription} />
                <div className="messagesTabPanelDiv">
                    <h2>Messages</h2>
                    <Box className="messagesBox"  >
                        <Button
                            variant="contained"
                            onClick={() => doPeekMessages(subscription)}
                        >Peek Messages</Button>
                        <Button
                            variant="contained"
                            onClick={() => doPeekDLQ(subscription)}
                        >Peek DLQ</Button>

                        <MessageTaskButtons subscription={subscription} reportActivity={reportActivity} />
                        <MessageList
                            didError={messageList.didError}
                            isLoaded={messageList.isLoaded}
                            queue={subscription} />
                    </Box>
                </div>
                {
                    doingOperation.isDoing ? (<div id={"isDoingOp"}>Doing Operation: {doingOperation.done} of {doingOperation.of}</div>)
                        : <></>}
            </TabPanel>
        </TabControl>
    </div >);
}