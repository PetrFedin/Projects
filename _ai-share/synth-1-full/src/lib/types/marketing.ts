export interface ContentCampaign {
    id: string;
    title: string;
    techPackId: string;
    status: 'draft' | 'generating' | 'ready' | 'published';
    platform: 'instagram' | 'tiktok' | 'telegram' | 'web';
    generatedAssets: {
        type: 'description' | 'post' | 'script' | 'hashtags';
        content: string;
        aiConfidence: number;
    }[];
    createdAt: string;
}
