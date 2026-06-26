export interface FlowNode {
    id: string;
    type: 'trigger' | 'action' | 'condition' | 'input';
    label: string;
    returnToPrevious?: boolean;
}


export interface EdgeCondition {
    type: 'always' | 'equals' | 'contains' | 'regex' | 'expression' | 'intent';
    value?: string;
    variable?: string;
}


export interface FlowEdge {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    condition?: EdgeCondition;
}


export interface FlowGraph {
    nodes: FlowNode[];
    edges: FlowEdge[];
}


export interface SessionState {
    sessionId: string;
    flowId: string;
    currentNodeId: string;
    callStack: string[];
    context: Record<string, any>;
    retries: number;
    lastInteractionAt: number;
}


export interface NluPayload {
    intent: string | null;
    confidence: number;
    entities: Array<{ entity: string; value: string }>;
}


