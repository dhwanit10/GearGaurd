export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'manager' | 'user';
  avatar?: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  location: string;
  assignedTo?: string;
  maintenanceTeam: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'scrap';
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description: string;
  equipmentId: string;
  equipmentName: string;
  category: string;
  type: 'corrective' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'repaired' | 'scrap';
  assignedTo?: string;
  assignedTeam: string;
  scheduledDate: string;
  createdAt: string;
  completedAt?: string;
  duration?: number;
  workCenter?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  responsibleTeam: string;
}

export interface WorkCenter {
  id: string;
  name: string;
  priority: number;
  alternativeWorkstations: string;
  totalCapacity: number;
  timeEfficiency: number;
  unitsCost: number;
  target: number;
}
