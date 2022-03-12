import { Box } from '@mui/system';
import React ,{ useEffect } from 'react';

import './App.css';

import * as sbm from './AzureServiceBus/AzureServiceBusManager';

import ConnectionBox from './ConnectionBox';
import { InProgressActivityReport } from './InProgressTaskReport';
import { ServiceBusDetails } from './ServiceBusDetails';
import { StatusBar } from './StatusBar';

function App() {

  const [serviceBus, setServiceBus] = React.useState<sbm.AzureServiceBusManager | undefined>(undefined);
  const [namespace, setNamespace] = React.useState<string>("");
  const [activityReports, setActivityReports] = React.useState<InProgressActivityReport[]>([]);

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
    let newReports = [...activityReports, report];
    setActivityReports(newReports);
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
      <StatusBar statusReports={activityReports} />
    </div>
  );

}

export default App;

