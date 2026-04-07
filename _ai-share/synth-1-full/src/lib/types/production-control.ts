export interface ProductionOrder {
    id: string;
    factoryId: string;
    brandId: string;
    productName: string;
    quantity: number;
    status: 'planned' | 'cutting' | 'sewing' | 'qc' | 'ready' | 'shipped';
    progress: number; // 0-100
    startDate: string;
    estimatedCompletion: string;
    issues: {
        type: 'delay' | 'quality' | 'materials';
        description: string;
        severity: 'low' | 'medium' | 'high';
    }[];
}
