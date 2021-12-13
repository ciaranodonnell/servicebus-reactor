
export function formatBytesForPresentation(bytes: number | undefined): string | undefined {
    if (bytes === undefined) return undefined;

    if (bytes < 1024) {
        return bytes + " bytes";
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1073741824) {
        return (bytes / 1048576).toFixed(2) + " MB";
    } else {
        return (bytes / 1073741824).toFixed(2) + " GB";
    }
}

export function ifBooleanThenYesNoOtherwiseValue(value: any): any {
    if (value === true || value === false) {
        return value ? "Yes" : "No";
    } else {
        return value;
    }
}

export function convertTimespanToString(value: string | undefined): string {
    console.log("convertTimespanToString: ", value);
    if (value === undefined) return "";
    var tokens = value.split(/[A-Z]+/);

    const formatPart = (part: string): string => parseFloat(part).toLocaleString('en');
    const getPart = (part: string, name: string, isEnd?: boolean): string => {
        if (part === "") return "";
        if (part === "0") return "";
        if (isEnd === undefined) isEnd = false;


        return `${formatPart(part)} ${name}${part == "1" ? "" : "s"}${!isEnd ? ", " : ""}`;
    }
    let days = tokens[1];
    let hours = tokens[2];
    let minutes = tokens[3];
    let seconds = tokens[4];
    let daysAsNumber = parseInt(days);
    let years = daysAsNumber / 365;
    if (years > 1) {
        years = Math.floor(years);
        days = (daysAsNumber - (years * 365)).toString();
    }

    return `${getPart(years.toString(), "year")}${getPart(days, "day")}${getPart(tokens[2], "hour")}${getPart(tokens[3], "minute")}${getPart(tokens[4], "second", true)}`;
}

export interface LoadingData<T> {
    data?: T;
    hasLoaded: boolean;
    isLoading: boolean;
    didError: boolean;
    errorMessage?: string;
}