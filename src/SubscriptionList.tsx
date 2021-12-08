import React from 'react';
import './QueueTopicList.css';
import { PrimaryButton, TextField, Stack, Label, DetailsList } from '@fluentui/react';
import { GroupedList, IGroup } from '@fluentui/react/lib/GroupedList';
import { IColumn, DetailsRow } from '@fluentui/react/lib/DetailsList';
import { Selection, SelectionMode, SelectionZone } from '@fluentui/react/lib/Selection';
import { Toggle, IToggleStyles } from '@fluentui/react/lib/Toggle';
import { useBoolean, useConst } from '@fluentui/react-hooks';



import * as sbm from './AzureServiceBusManager';

interface SubscriptionListProps {
    serviceBus: sbm.AzureServiceBusManager;
}


export function SubscriptionList(props: SubscriptionListProps) {

    return (
        <div className="subscriptions">
        </div>);
}
