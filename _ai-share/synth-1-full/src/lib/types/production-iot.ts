export interface MachineKPI {
  id: string; // Machine ID (e.g., "SM-001")
  type: 'sewing' | 'cutting' | 'ironing' | 'embroidery';
  status: 'running' | 'idle' | 'offline' | 'error';
  efficiency: number; // Percentage (0-100)
  operator: string;
  output24h: number;
  lastMaintenance: string;
  temperature: number;
  rpm: number;
}

export interface ProductionLine {
  id: string;
  name: string;
  efficiency: number;
  status: 'active' | 'bottleneck' | 'idle';
  currentOrder: string;
  machines: MachineKPI[];
}
