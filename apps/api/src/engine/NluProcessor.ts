import { NluPayload } from '@inuit/types';

export interface INluProvider {
    extractIntentAndEntities(text: string): Promise<NluPayload>;

}


export class NluProcessor {
    private provider: INluProvider;
    private confidenceThreshold: number;

    constructor(provider: INluProvider, confidenceThreshold: number = 0.50) {
        this.provider = provider;
        this.confidenceThreshold = confidenceThreshold;
    }

    public async process(text: string): Promise<NluPayload> {
        if (!text || text.trim() === '') {
            return this.createEmptyPayload();
        }

        const result = await this.provider.extractIntentAndEntities(text);

        if (result.confidence < this.confidenceThreshold) {
            return this.createEmptyPayload();
        }

        return result;
    }

    private createEmptyPayload(): NluPayload {
        return {
            intent: null,
            confidence: 0,
            entities: []
        };
    }
}