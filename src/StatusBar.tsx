import React from 'react';

import { InProgressActivityReport } from './ApplicationHooks';
import { ProgressImage } from './ProgressImage';
export function StatusBar(props: { statusReports: InProgressActivityReport[] }) {

    const allActivityReports = props.statusReports;
    const [displayStatus, setDisplayStatus] = React.useState<InProgressActivityReport | undefined>(allActivityReports.length > 0 ? allActivityReports[allActivityReports.length - 1] : undefined);

    if (displayStatus !== undefined && displayStatus.state == "completed") {
        setTimeout(() => setDisplayStatus(undefined), 5000);
    }

    return (<div className="statusBar">


        {(displayStatus !== undefined) ?
            (
                <>
                    <ProgressImage state={displayStatus.state} key={displayStatus.state} />
                    <span className="statusBarText">{displayStatus.description}</span>
                    {displayStatus !== undefined && displayStatus.total > 0 ?
                        (<span className="statusBarPercent">({displayStatus.done} of {displayStatus.total})</span>)
                        : (<></>)}
                </>)
            :
            (<></>)
        }
    </div>);
}