
export class InProgressActivityReport {
    id: string;
    description: string;
    state: "inProgress" | "completed" | "cancelled" | "failed";
    done: number;
    total: number;
    context: any;
    constructor(id: string, description: string, state: "inProgress" | "completed" | "cancelled" | "failed", done: number, total: number, context?: any) {
        this.id = id;
        this.description = description;
        this.state = state;
        this.done = done;
        this.total = total;
        this.context = context;
    }
}
