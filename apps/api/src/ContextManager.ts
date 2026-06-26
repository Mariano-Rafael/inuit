import { SessionState } from '@inuit/types';

export class ContextManager {
    private state: SessionState;

    constructor(initialState: SessionState) {
        this.state = initialState;
    }

    // navigation and digression

    public getCurrentNodeId(): string {
        return this.state.currentNodeId;
    }

    public setCurrentNodeId(nodeId: string): void {
        this.state.currentNodeId = nodeId;
        this.resetRetries();
    }

    public pushToCallStack(nodeId: string): void {
        this.state.callStack.push(nodeId);
    }

    public popFromCallStack(): void {
        this.state.callStack.pop();
    }

    public clearCallStack(): void {
        this.state.callStack = [];
    }

    public hasActiveDigression(): boolean {
        return this.state.callStack.length > 0;
    }

    // context memory

    public setVariable(key: string, value: any): void {
        this.state.context[key] = value;
    }

    public getVariable(key: string): any {
        return this.state.context[key];
    }

    // retry control

    public incrementRetries(): number {
        this.state.retries += 1;
        return this.state.retries;
    }

    public getRetries(): number {
        return this.state.retries;
    }

    private resetRetries(): void {
        this.state.retries = 0;
    }

    // export of session state

    public exportState(): SessionState {
        this.state.lastInteractionAt = Date.now();
        return this.state;
    }

}
