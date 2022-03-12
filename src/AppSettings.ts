//import electron from 'electron';
//import path from 'path';


export class AppSettings {
    static store: AppSettingsStore;

    private static init() {
        if (AppSettings.store == null) {
            AppSettings.store = new AppSettingsStore();
        }
    };

    static get savedConnections(): Map<string, string> {

        this.init();
        return this.store.savedConnections;
    }

    static set savedConnections(value: Map<string, string>) {
        this.store.savedConnections = value;
    }

}
class AppData {
    constructor() {
        this.savedConnections = new Map<string, string>();
    }
    public savedConnections: Map<string, string>
}
class AppSettingsStore {

    path: string;
    data: AppData;

    constructor() {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = '';//electron.app.getPath('userData');
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = userDataPath + 'appdata.json';

        try {
            this.data = this.parseDataFile(this.path);
        } catch {
            try {
                this.data = this.parseDataFile(this.path + '.new');
            } catch {
                this.data = new AppData();
            }
        }
    }
    saveData() {
        // Convert our json to a string.
        const dataString = JSON.stringify(this.data);
        // Write the string to our storage file.
        // fs.writeFileSync(this.path + ".new", dataString);
        //fs.copyFileSync(this.path + '.new', this.path);
    }
    parseDataFile(filePath: string): AppData {
        // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
        // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
        try {
            return new AppData();//JSON.parse(fs.readFileSync(filePath, { encoding: 'UTF8' })) as AppData;
        } catch (error) {
            // if there was some kind of error, return the passed in defaults instead.
            return new AppData();
        }
    }

    public get savedConnections(): Map<string, string> {
        return this.data.savedConnections;
    }

    public set savedConnections(value: Map<string, string>) {
        this.data.savedConnections = value;
        this.saveData();
    }
}