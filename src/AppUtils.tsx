
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
