import { InProgressActivityReport } from "./InProgressTaskReport";
export { InProgressActivityReport };

export interface ApplicationHooks {
    reportActivity: (report: InProgressActivityReport) => void;
}

export interface ApplicationProps {
    hooks: ApplicationHooks;
}