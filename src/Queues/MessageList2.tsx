import React, { useEffect } from "react";

import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'

import { Queue, ReceivedMessage } from "../AzureServiceBus/AzureServiceBusManager";

interface MessageListProps {
    //  messages: ReceivedMessage[] | undefined;
    isLoaded: boolean;
    didError: boolean;
    errorMessage?: string;
    queue: Queue;
}

export function MessageList2(props: MessageListProps) {
    const { isLoaded, /*messages,*/ didError, errorMessage, queue } = props;

    const [isSelecting, setIsSelecting] = React.useState(false);

    function getGridColumns(): any[] {

        const commonProps = {
            minWidth: 100, defaultFlex: 1, headerAlign: 'center'
        };

        const columns: any[] = [
            {
                name: 'id',
                header: 'Message ID',
                description: 'The unique identifier for the message.',
                ...commonProps,
            },
            {
                name: 'sequenceNumber',
                header: 'Seq', description: 'The sequence number of the message within the queue',
                ...commonProps
            },
            {
                name: 'to',
                header: 'To',
                description: 'The To property in the message when it was sent. This has to be set by the sender and can be used by subscription filters.',
                ...commonProps
            },
            {
                name: 'enqueuedTimeUtc',
                header: 'Enqueued UTC',
                ...commonProps
            },
            {
                name: 'scheduledEnqueuedTimeUtc',
                header: 'Scheduled Enqueued UTC',
                ...commonProps
            },
            {
                name: 'body',
                header: 'body',
                ...commonProps,

            },
            {
                name: 'deliveryCount',
                header: 'Delivery Count', description: 'The number of times the message has been delivered to a subscriber.',
                ...commonProps
            },
            {
                name: 'isScheduled',
                header: 'Scheduled', description: 'Indicates whether the message is scheduled to be sent.',
                ...commonProps,
            },
        ];
        return columns;
    }


    const gridData = queue.lastReceivedMessages;
    const gridColumns = getGridColumns();
    console.log("MessageList Rendering", gridData, gridColumns, isLoaded);


    if (isLoaded)
        return (<div className="messagesListDiv">
            <ReactDataGrid
                theme="default-light"
                idProperty="messageId"
                columns={gridColumns}
                dataSource={gridData}
            ></ReactDataGrid>
        </div>);
    else {
        return (<div></div>);
    }
}
