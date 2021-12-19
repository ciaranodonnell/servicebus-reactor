import React from 'react';

import { InProgressActivityReport } from './ApplicationHooks';

export function StatusBar(props: { statusReport: InProgressActivityReport | undefined }) {

    const lastActivityStatus = props.statusReport;


    function ProgressImage(props: { state: "inProgress" | "completed" | "cancelled" | "failed" }) {

        const style = { width: 20, height: 20 };

        if (props.state === "inProgress") {
            return (<img src="images/inprogress.gif" alt="in progress" style={style} />);
        } else if (props.state === "completed") {
            return (<img src="images/completed.gif" alt="in progress" style={style} />);
        } else if (props.state === "failed") {
            return (<img src="images/failed.gif" alt="in progress" style={style} />);
        } else if (props.state === "cancelled") {
            return (<img src="images/cancelled.png" alt="in progress" style={style} />);
        } else
            return (<></>);
    }


    return (<div className="statusBar">


        {(lastActivityStatus !== undefined) ?
            (
                <>
                    <ProgressImage state={lastActivityStatus.state} key={lastActivityStatus.state} />
                    <span className="statusBarText">{lastActivityStatus.description}</span>
                    {lastActivityStatus !== undefined && lastActivityStatus.total > 0 ?
                        (<span className="statusBarPercent">({lastActivityStatus.done} of {lastActivityStatus.total})</span>)
                        : (<></>)}
                </>)
            :
            (<></>)
        }
    </div>);
}