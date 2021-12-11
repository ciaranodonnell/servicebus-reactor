import React, { useEffect } from "react";

import { DataGrid, GridColDef, GridRowsProp, GridValueGetterSimpleParams } from '@mui/x-data-grid';
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

    function getGridColumns(): GridColDef[] {
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
    function getGridData(): GridRowsProp {

        const results = queue.lastReceivedMessages.map(m => {
            return { id: m.messageId, ...m };
        });
        //  console.log("getGridData", results);
        return results;
    }

    const gridData = getGridData();
    const gridColumns = getGridColumns();
    console.log("MessageList Rendering", gridData, gridColumns, isLoaded);
    if (isLoaded)
        return (<div style={{ height: '500px' }}>
            <DataGrid
                columns={gridColumns}
                rows={gridData}
            ></DataGrid>
        </div>);
    else {
        return (<div></div>);
    }
}
