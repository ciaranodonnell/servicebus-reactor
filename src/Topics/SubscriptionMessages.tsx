import { Box, Button } from "@mui/material";
import React from "react";
import { InProgressActivityReport } from "../ApplicationHooks";
import { ReceivedMessage, Subscription } from "../AzureServiceBus/AzureServiceBusManager";
import { MessageList } from "../Queues/MessageList";
import { ActiveMessageDetails } from "./ActiveMessageDetails";
import { MessageDetails } from "./MessageDetails";
import { SubscriptionProps } from "./SubscriptionProps";


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


export function SubscriptionMessages(props: SubscriptionProps) {

    const subscription = props.subscription;
    const reportActivity = props.hooks.reportActivity;
    const [messageList, setMessageList] = React.useState(new PeekMessagesList());
    const [selectedMessage, setSelectedMessage] = React.useState<ReceivedMessage | undefined>();

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

        return (<div>
            {(subscription.deadLetterMessageCount ?? 0) > 0 ? (
                <Button className={"actionButton"}
                    variant="contained"
                    onClick={() => sendDLQBackToTopic()}
                >Resend all DLQ</Button>) : (<></>)}
        </div >);
    }



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


    return (<>   <ActiveMessageDetails subscription={subscription} />
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
                    queue={subscription}
                    messageSelected={(message) => { setSelectedMessage(message); }}
                />

                {selectedMessage ? (<MessageDetails message={selectedMessage} hooks={props.hooks} />) : (<></>)}

            </Box>
        </div>
    </>);
}