import React from 'react';
import './QueueTopicList.css';
import { PrimaryButton, TextField, Stack, Label, DetailsList } from '@fluentui/react';
import { GroupedList, IGroup } from '@fluentui/react/lib/GroupedList';
import { IColumn, DetailsRow } from '@fluentui/react/lib/DetailsList';
import { Selection, SelectionMode, SelectionZone } from '@fluentui/react/lib/Selection';
import { Toggle, IToggleStyles } from '@fluentui/react/lib/Toggle';
import { useBoolean, useConst } from '@fluentui/react-hooks';

import * as sbm from './AzureServiceBusManager';

interface TopicListProps {
    serviceBus: sbm.AzureServiceBusManager | undefined;
}


interface LoadingData<T> {
    data: T;
    isLoading: boolean;
}

function TopicList(props: TopicListProps) {

    const [selectedQName, setSelectedQName] = React.useState<string>("");
    const [topics, setTopics] = React.useState<LoadingData<sbm.Topic[]>>({ isLoading: true, data: [] });
    const [sb, setSb] = React.useState(props.serviceBus);

    const selection = new Selection();
    selection.setItems(topics.data.map((m) => { return { ...m, "key": m.name } }), true);


    if (props.serviceBus === undefined) {
        return (
            <></>
        );
    } else {
        if (sb !== props.serviceBus) {
            const topicsPromise = props.serviceBus?.getTopics().then((q) => { setTopics({ isLoading: false, data: q }); });
            setSb(props.serviceBus);
        }

        const topicColumns: IColumn[] =
            [
                { key: 'type', name: '', fieldName: 'topicOrQueueLetter', minWidth: 10, maxWidth: 20, isIconOnly: true },
                { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
                { key: 'isPartitioned', name: 'Partitioned', fieldName: 'isPartitioned', minWidth: 10, maxWidth: 20, isResizable: true, onRender: (item: sbm.Topic) => { return <span>{item.isPartitioned ? "✔️" : "❌"}</span> } }
            ];


        const onRenderCell = (
            nestingDepth?: number,
            item?: sbm.Topic,
            itemIndex?: number,
            group?: IGroup,
        ): React.ReactNode => {
            return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
                <DetailsRow
                    columns={topicColumns}
                    groupNestingDepth={nestingDepth}
                    item={item}
                    itemIndex={itemIndex}
                    selection={selection}
                    selectionMode={SelectionMode.multiple}
                    compact={false}
                    group={group}
                />
            ) : null;
        };
        const groups = topics.data.map(t => { return { key: t.name, name: t.name, startIndex: 0, count: 1, isCollapsed: true } });

        return (
            <div className="queueListContainer">
                <Stack>
                    <Label>
                        {topics.isLoading ? "Loading Topics..." : topics.data.length.toString() + " Topics:"}
                    </Label>
                    <GroupedList
                        items={topics.data}
                        onRenderCell={onRenderCell}
                        selection={selection}
                        selectionMode={SelectionMode.multiple}
                        groups={groups}
                        compact={false}
                    />
                </Stack>
            </div>
        );


        return <> </>;
    }
}

export default TopicList;