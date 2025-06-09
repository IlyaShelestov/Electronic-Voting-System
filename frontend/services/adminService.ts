import {
  ICityDistribution,
  IDashboardStats,
  IRecentActivity,
  IRequestsTrendData,
  IUserGrowthData,
} from "@/models/IDashboard";
import { IRequest } from "@/models/IRequest";
import { IUser } from "@/models/IUser";

import { apiClient } from "./apiClient";
import { LocationsService } from "./locationsService";

export class AdminService {
  private static apiEndpoint = "/admin";

  private static usersCache: IUser[] | null = null;
  private static requestsCache: IRequest[] | null = null;
  private static citiesCache: any[] | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 60000;

  private static isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  private static async fetchUsersWithCache(): Promise<IUser[]> {
    if (this.usersCache && this.isCacheValid()) {
      return this.usersCache;
    }

    const response = await apiClient.get(`${this.apiEndpoint}/users`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch users");
    }

    this.usersCache = response.data;
    this.cacheTimestamp = Date.now();
    return response.data;
  }

  private static async fetchRequestsWithCache(): Promise<IRequest[]> {
    if (this.requestsCache && this.isCacheValid()) {
      return this.requestsCache;
    }

    const response = await apiClient.get(`${this.apiEndpoint}/requests`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch requests");
    }

    this.requestsCache = response.data;
    this.cacheTimestamp = Date.now();
    return response.data;
  }

  private static async fetchCitiesWithCache(): Promise<any[]> {
    if (this.citiesCache && this.isCacheValid()) {
      return this.citiesCache;
    }

    this.citiesCache = await LocationsService.getCities();
    this.cacheTimestamp = Date.now();
    return this.citiesCache;
  }

  public static clearCache(): void {
    this.usersCache = null;
    this.requestsCache = null;
    this.citiesCache = null;
    this.cacheTimestamp = 0;
  }

  public static async fetchUsers(): Promise<IUser[]> {
    return this.fetchUsersWithCache();
  }

  public static async createUser(userData: IUser) {
    const response = await apiClient.post(
      `${this.apiEndpoint}/users`,
      userData
    );
    if (response.status !== 200) {
      throw new Error("Failed to create user");
    }
    this.clearCache();
    return response.data;
  }

  public static async updateUser(userId: number, userData: Partial<IUser>) {
    const response = await apiClient.put(
      `${this.apiEndpoint}/users/${userId}`,
      userData
    );
    if (response.status !== 200) {
      throw new Error("Failed to update user");
    }
    // Clear cache to force refresh
    this.clearCache();
    return response.data;
  }

  public static async deleteUser(userId: number) {
    const response = await apiClient.delete(
      `${this.apiEndpoint}/users/${userId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to delete user");
    }
    // Clear cache to force refresh
    this.clearCache();
    return response.data;
  }

  public static async fetchRequests(): Promise<IRequest[]> {
    return this.fetchRequestsWithCache();
  }

  public static async fetchRequest(requestId: number) {
    const response = await apiClient.get(
      `${this.apiEndpoint}/requests/${requestId}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch request");
    }
    return response.data;
  }

  public static async approveRequest(requestId: number) {
    const response = await apiClient.post(
      `${this.apiEndpoint}/requests/${requestId}/approve`
    );
    if (response.status !== 200) {
      throw new Error("Failed to approve request");
    }
    // Clear cache to force refresh
    this.clearCache();
    return response.data;
  }

  public static async rejectRequest(requestId: number) {
    const response = await apiClient.post(
      `${this.apiEndpoint}/requests/${requestId}/reject`
    );
    if (response.status !== 200) {
      throw new Error("Failed to reject request");
    }
    // Clear cache to force refresh
    this.clearCache();
    return response.data;
  }

  // Dashboard Statistics Methods
  public static async fetchDashboardStats(): Promise<IDashboardStats> {
    try {
      // Use cached data to avoid duplicate API calls
      const [users, requests] = await Promise.all([
        this.fetchUsersWithCache(),
        this.fetchRequestsWithCache(),
      ]);

      const usersByRole = users.reduce((acc: any, user: IUser) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const requestsByStatus = requests.reduce(
        (acc: any, request: IRequest) => {
          acc[request.status] = (acc[request.status] || 0) + 1;
          return acc;
        },
        {}
      );

      const recentActivity: IRecentActivity[] = requests
        .sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        )
        .slice(0, 5)
        .map((request, index) => ({
          id: request.request_id || index,
          type:
            request.status === "approved"
              ? ("request_approved" as const)
              : request.status === "rejected"
              ? ("request_rejected" as const)
              : ("request_created" as const),
          description: `${request.field_name} change request ${request.status}`,
          userId: request.user_id || 0,
          userName: `User ${request.user_id}`,
          timestamp: request.created_at || new Date().toISOString(),
        }));

      return {
        totalUsers: users.length,
        pendingRequests: requestsByStatus.pending || 0,
        approvedRequests: requestsByStatus.approved || 0,
        rejectedRequests: requestsByStatus.rejected || 0,
        usersByRole,
        requestsByStatus,
        recentActivity,
      };
    } catch (error) {
      console.error("Error computing dashboard stats from real data:", error);
      throw error;
    }
  }

  public static async fetchUserGrowth(
    period: string = "6months"
  ): Promise<IUserGrowthData[]> {
    try {
      const users = await this.fetchUsersWithCache();

      const now = new Date();
      const monthsBack =
        period === "3months" ? 3 : period === "12months" ? 12 : 6;
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - monthsBack,
        1
      );

      const monthlyData: IUserGrowthData[] = [];

      for (let i = 0; i < monthsBack; i++) {
        const date = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i,
          1
        );
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const usersInMonth = users.filter((user: IUser) => {
          if (!user.created_at) return false;
          const userDate = new Date(user.created_at);
          return userDate >= monthStart && userDate <= monthEnd;
        }).length;

        monthlyData.push({
          period: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          date: date.toISOString().split("T")[0],
          newUsers: usersInMonth,
          totalUsers: users.filter((user: IUser) => {
            if (!user.created_at) return false;
            return new Date(user.created_at) <= monthEnd;
          }).length,
        });
      }

      return monthlyData;
    } catch (error) {
      console.error("Error computing user growth from real data:", error);
      return [];
    }
  }

  public static async fetchRequestsTrend(
    period: string = "6months"
  ): Promise<IRequestsTrendData[]> {
    try {
      const requests = await this.fetchRequestsWithCache();

      const now = new Date();
      const monthsBack =
        period === "3months" ? 3 : period === "12months" ? 12 : 6;
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth() - monthsBack,
        1
      );

      const monthlyData: IRequestsTrendData[] = [];

      for (let i = 0; i < monthsBack; i++) {
        const date = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i,
          1
        );
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const requestsInMonth = requests.filter((request: IRequest) => {
          if (!request.created_at) return false;
          const requestDate = new Date(request.created_at);
          return requestDate >= monthStart && requestDate <= monthEnd;
        });

        const newRequests = requestsInMonth.length;
        const approvedRequests = requestsInMonth.filter(
          (r) => r.status === "approved"
        ).length;
        const rejectedRequests = requestsInMonth.filter(
          (r) => r.status === "rejected"
        ).length;

        monthlyData.push({
          period: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          date: date.toISOString().split("T")[0],
          newRequests,
          totalRequests: requests.filter((request: IRequest) => {
            if (!request.created_at) return false;
            return new Date(request.created_at) <= monthEnd;
          }).length,
          approvedRequests,
          rejectedRequests,
        });
      }

      return monthlyData;
    } catch (error) {
      console.error("Error computing requests trend from real data:", error);
      return [];
    }
  }

  public static async fetchCityDistribution(): Promise<ICityDistribution[]> {
    try {
      const [users, cities] = await Promise.all([
        this.fetchUsersWithCache(),
        this.fetchCitiesWithCache(),
      ]);

      const cityMap = cities.reduce((acc: any, city: any) => {
        acc[city.city_id] = city.name;
        return acc;
      }, {});

      const cityCount = users.reduce((acc: any, user: IUser) => {
        const cityId = user.city_id;
        const cityName = cityMap[cityId] || `City ${cityId}`;
        acc[cityName] = (acc[cityName] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(cityCount).map(([cityName, count], index) => ({
        cityId: index + 1,
        cityName,
        userCount: count as number,
        percentage: Math.round(((count as number) / users.length) * 100),
      }));
    } catch (error) {
      console.error("Error computing city distribution from real data:", error);
      return [];
    }
  }
}
