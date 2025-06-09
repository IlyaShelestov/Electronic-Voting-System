export interface IDashboardStats {
  totalUsers: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  usersByRole: {
    user: number;
    admin: number;
    manager: number;
    candidate: number;
  };
  requestsByStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  recentActivity: IRecentActivity[];
}

export interface IUserStats {
  total: number;
  byRole: {
    [key: string]: number;
  };
  recentRegistrations: number;
  activeUsers: number;
}

export interface IRequestStats {
  total: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  recentRequests: number;
  processingTime: {
    average: number;
    median: number;
  };
}

export interface ICityDistribution {
  cityId: number;
  cityName?: string;
  userCount: number;
  percentage: number;
}

export interface IUserGrowthData {
  period: string;
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface IRequestsTrendData {
  period: string;
  date: string;
  newRequests: number;
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export interface IRecentActivity {
  id: number;
  type:
    | "user_registration"
    | "request_created"
    | "request_approved"
    | "request_rejected";
  description: string;
  userId?: number;
  userName?: string;
  timestamp: string;
}

export interface IChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
    [key: string]: any; // Allow additional chart.js properties
  }[];
}
