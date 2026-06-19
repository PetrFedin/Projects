/** Типы B2B workspace matrix. */

export type WorkspaceTabId = 'ops' | 'commercial' | 'supply' | 'intelligence';
export type B2BUserRole =
  | 'retailer'
  | 'brand'
  | 'buyer'
  | 'sales_rep'
  | 'merchandiser'
  | 'finance_manager'
  | 'distributor'
  | 'admin';
export type DigitalFlowId = 'ops' | 'commercial' | 'supply' | 'intelligence';

export interface WorkspaceTab {
  id: WorkspaceTabId;
  label: string;
  description: string;
  flow: DigitalFlowId;
}

export interface WorkspaceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  roles: string[];
  tabId: WorkspaceTabId;
  flow: DigitalFlowId;
  buttonText: string;
  priority?: 'standard' | 'critical';
  badge?: string;
  teaser?: {
    subtitle: string;
    image: string;
    features: string[];
  };
}
