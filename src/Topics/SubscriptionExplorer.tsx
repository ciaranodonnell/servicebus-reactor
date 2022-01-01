import React, { useEffect } from "react";

import './TopicList.css';
import '../App.css';

import { TabControl, TabPanel } from "../TabPanel";
import { SubscriptionProperties } from "./SubscriptionProperties";
import { SubscriptionMessages } from "./SubscriptionMessages";
import { SubscriptionProps } from "./SubscriptionProps";

export function SubscriptionExplorer(props: SubscriptionProps) {
    const subscription = props.subscription;


    return (<div className="subscriptionExplorer" style={{
        maxHeight: "100px", height: "100%"
    }}>
        <h1>Subscription: <span className="subscriptionName">{subscription.name}</span></h1>
        <TabControl onChange={(newIndex) => { }} tabGroupName={"subscriptionExplorer"}       >
            <TabPanel key={subscription.name + "-properties-tab"} title={"Properties"} >
                <SubscriptionProperties {...props} />
            </TabPanel>
            <TabPanel key={subscription.name + "-properties-tab"} title="Messages">
                <SubscriptionMessages {...props} />
            </TabPanel>
        </TabControl>
    </div >);
}