export interface IPRecord {
    id: string; // IP registration ID (e.g., "IP-2026-001")
    brandId: string;
    title: string;
    type: 'design' | 'print' | 'sketch' | 'tech_pack' | 'collection';
    status: 'registered' | 'pending' | 'disputed';
    registrationDate: string;
    hash: string; // Mock blockchain transaction hash
    blockNumber: number;
    owner: string;
    attachments: {
        url: string;
        filename: string;
        type: string;
    }[];
    metadata: Record<string, any>;
}

export interface IPDispute {
    id: string;
    ipRecordId: string;
    claimantBrandId: string;
    reason: string;
    status: 'open' | 'resolved' | 'rejected';
    createdAt: string;
    evidenceLinks: string[];
}
