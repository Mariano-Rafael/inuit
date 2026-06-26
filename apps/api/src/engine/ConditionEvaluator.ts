import { EdgeCondition, NluPayload } from '@inuit/types';
import { ContextManager } from '../ContextManager';

export class ConditionEvaluator {
    public evaluate(
        condition: EdgeCondition,
        userInput: string,
        nluResult: NluPayload,
        contextManager: ContextManager,
        isEvaluatingGlobalNode: boolean
    ): boolean {

        if (isEvaluatingGlobalNode && condition.type === 'expression') {
            return false;
        }

        const safeInput = userInput.trimEnd().toLowerCase();
        const conditionValue = condition.value?.toLowerCase() || '';

        switch (condition.type) {

            case 'always':
                return true;

            case 'intent':
                return nluResult.intent === condition.value;

            case 'equals':
                return safeInput === conditionValue;

            case 'contains':
                if (condition.variable) {
                    const contextVar = contextManager.getVariable(condition.variable);
                    if (Array.isArray(contextVar)) {
                        return contextVar.includes(condition.value);
                    }
                    if (typeof contextVar === 'string') {
                        return contextVar.toLowerCase().includes(conditionValue);
                    }
                    return false;
                }
                return safeInput.includes(conditionValue);


            case 'regex':
                try {
                    const regex = new RegExp(condition.value || '', 'i');
                    return regex.test(safeInput);
                } catch (error) {
                    return false;
                }

            case 'expression':
                return this.evaluateLogicSafe(condition, contextManager);

            default:
                return false;
        }
    }

    private evaluateLogicSafe(condition: EdgeCondition, contextManager: ContextManager): boolean {
        if (condition.variable && condition.value) {
            return contextManager.getVariable(condition.variable) === condition.value;
        }
        return false;
    }
}

