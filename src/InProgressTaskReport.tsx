
export class InProgressActivityReport {
    id: string;
    description: string;
    state: "inProgress" | "completed" | "cancelled" | "failed";
    done: number;
    total: number;

    constructor(id: string, description: string, state: "inProgress" | "completed" | "cancelled" | "failed", done: number, total: number) {
        this.id = id;
        this.description = description;
        this.state = state;
        this.done = done;
        this.total = total;
    }
}
