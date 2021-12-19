import { Box } from '@mui/system';
import React from 'react';
import { useEffect } from 'react';

import './App.css';

import * as sbm from './AzureServiceBus/AzureServiceBusManager';

import ConnectionBox from './ConnectionBox';
import { InProgressActivityReport } from './InProgressTaskReport';
import { ServiceBusDetails } from './ServiceBusDetails';
import { StatusBar } from './StatusBar';

function App() {

  const [serviceBus, setServiceBus] = React.useState<sbm.AzureServiceBusManager | undefined>(undefined);
  const [namespace, setNamespace] = React.useState<string>("");
  const [lastActivityStatus, setLastActivityStatus] = React.useState<InProgressActivityReport | undefined>(undefined);

  useEffect(() => {
    document.title = `ServiceBus-Reactor ${namespace === undefined || namespace.length == 0 ? "" : " - " + namespace}`
  }, [serviceBus]);


  const handleConnect = (conString: string) => {
    console.log("Connecting to:", conString);
    setServiceBus(new sbm.AzureServiceBusManager(conString));
    if (serviceBus !== undefined) {
      setNamespace(serviceBus?.namespace);
    }
  };

  function reportActivity(report: InProgressActivityReport) {
    setLastActivityStatus(report);
    console.log("Activity reported:", report.description, report.done, report.total);
    if (report.state == "completed") {
      setTimeout(() => setLastActivityStatus(undefined), 5000);
    }
  }

  const appHooks = { reportActivity: reportActivity };

  return (
    <div className={"wholeAppFlex"}>
      <div className="appHeader">
        <ConnectionBox connectionString={""} handleConnect={handleConnect} />
      </div>
      <div className="appBody">
        {serviceBus !== undefined && <ServiceBusDetails serviceBus={serviceBus} key={serviceBus?.connectionString} hooks={appHooks} />}
      </div>
      <StatusBar statusReport={lastActivityStatus} />
    </div>
  );

}

export default App;

