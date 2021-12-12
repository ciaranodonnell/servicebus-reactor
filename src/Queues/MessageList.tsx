import React, { useEffect } from "react";

import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, GridRowsProp, GridValueGetterSimpleParams, MuiEvent } from '@mui/x-data-grid';
import { ReceivedMessage } from "../AzureServiceBus/ReceivedMessage";
import { Queue } from "../AzureServiceBus/Queue";

interface MessageListProps {
    //  messages: ReceivedMessage[] | undefined;
    isLoaded: boolean;
    didError: boolean;
    errorMessage?: string;
    queue: Queue;
}

export function MessageList(props: MessageListProps) {
    const { isLoaded, /*messages,*/ didError, errorMessage, queue } = props;

    const [isSelecting, setIsSelecting] = React.useState(false);

    function getGridColumns(): GridColDef[] {

        const commonProps = { resizable: true, sortable: true, filter: true, width: 200, editable: false };

        const columns: GridColDef[] = [
            {
                field: 'id', headerName: 'Message ID',
                description: 'The unique identifier for the message.',
                ...commonProps,
            },
            {
                field: 'sequenceNumber',
                headerName: 'Seq', description: 'The sequence number of the message within the queue',
                ...commonProps
            },
            {
                field: 'to',
                headerName: 'To',
                description: 'The To property in the message when it was sent. This has to be set by the sender and can be used by subscription filters.',
                ...commonProps
            },
            {
                field: 'enqueuedTimeUtc',
                headerName: 'Enqueued UTC',
                ...commonProps
            },
            {
                field: 'scheduledEnqueuedTimeUtc',
                headerName: 'Scheduled Enqueued UTC',
                ...commonProps
            },
            {
                field: 'body',
                headerName: 'body',
                ...commonProps,
                valueGetter: (params: GridValueGetterSimpleParams<ReceivedMessage>) => {
                    const body = params.row.body ?? "";
                    return body.length > 100 ? body.substr(0, 100) + "..." : body;
                },
            },
            {
                field: 'deliveryCount',
                headerName: 'Delivery Count', description: 'The number of times the message has been delivered to a subscriber.',
                ...commonProps
            },
            {
                field: 'isScheduled',
                headerName: 'Scheduled', description: 'Indicates whether the message is scheduled to be sent.',
                ...commonProps,
            },
        ];
        return columns;
    }
    function getGridData(): GridRowsProp {

        const results = queue.lastReceivedMessages.map(m => {
            return { id: m.messageId, ...m };
        });
        //  console.log("getGridData", results);
        return results;
    }

    function messageDoubleClicked(params: GridRowParams<{ [key: string]: any; }>, event: MuiEvent<React.MouseEvent<HTMLElement, MouseEvent>>, details: GridCallbackDetails) {
        alert(`messageDoubleClicked ${params.row.messageId}`);
    }

    const gridData = getGridData();
    const gridColumns = getGridColumns();
    console.log("MessageList Rendering", gridData, gridColumns, isLoaded);


    if (isLoaded)
        return (<div className="messagesListDiv">
            <DataGrid checkboxSelection={isSelecting}
                onRowDoubleClick={(params, event, details) => { messageDoubleClicked(params, event, details); }}
                columns={gridColumns}
                rows={gridData}
            ></DataGrid>
        </div>);
    else {
        return (<div></div>);
    }
}
