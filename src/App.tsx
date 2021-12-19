import { Box } from '@mui/system';
import React from 'react';
import { useEffect } from 'react';

import './App.css';

import * as sbm from './AzureServiceBus/AzureServiceBusManager';

import ConnectionBox from './ConnectionBox';
import { InProgressActivityReport } from './InProgressTaskReport';
import { ServiceBusDetails } from './ServiceBusDetails';

function App() {

  const [serviceBus, setServiceBus] = React.useState<sbm.AzureServiceBusManager | undefined>(undefined);
  const [namespace, setNamespace] = React.useState<string>("");
  const [lastActivityStatus, setLastActivityStatus] = React.useState<InProgressActivityReport | undefined>(undefined);

  useEffect(() => {
    document.title = `ServiceBus-Reactor ${namespace === undefined || namespace.length == 0 ? "" : " - " + namespace}`
  }, [serviceBus]);

  function reportActivity(report: InProgressActivityReport) {
    setLastActivityStatus(report);
    if (report.state == "completed") {
      setTimeout(() => setLastActivityStatus(undefined), 5000);
    }
  }

  const handleConnect = (conString: string) => {
    console.log("Connecting to:", conString);
    setServiceBus(new sbm.AzureServiceBusManager(conString));
    if (serviceBus !== undefined) {
      setNamespace(serviceBus?.namespace);
    }
  };


  return (
    <div className={"wholeAppFlex"}>
      <div className="appHeader">
        <ConnectionBox connectionString={""} handleConnect={handleConnect} />
      </div>
      <div className="appBody">
        {serviceBus !== undefined && <ServiceBusDetails serviceBus={serviceBus} key={serviceBus?.connectionString} reportActivity={reportActivity} />}
      </div>
      <div className="statusBar">
        {(lastActivityStatus !== undefined) ?
          (
            <>
              <span className="statusBarText">{lastActivityStatus.description}</span>
              {lastActivityStatus !== undefined && lastActivityStatus.total > 0 ?
                (<span className="statusBarPercent">{((lastActivityStatus.done / lastActivityStatus.total) * 100)} %</span>)
                : (<></>)}
            </>)
          :
          (<></>)
        }
      </div>
    </div>
  );

}

export default App;

