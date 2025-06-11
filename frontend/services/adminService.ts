/**
 * AdminService - Comprehensive admin management service
 *
 * This service provides administrative functionality for managing users, requests,
 * and dashboard data. Features include:
 *
 * - Smart caching with individual cache management
 * - Consistent API patterns using apiClient
 * - Robust error handling and recovery
 * - Batch operations for bulk management
 * - Search and filtering capabilities
 * - Dashboard statistics and analytics
 * - System health monitoring
 * - Data export functionality
 *
 * All methods follow the standard pattern of using apiClient.get/post/put/delete
 * with proper TypeScript typing and error handling.
 */

import { ICity } from "@/models/ICity";
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

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class AdminService {
  private static readonly apiEndpoint = "/admin";
  private static readonly CACHE_DURATION = 60000; // 1 minute

  // Improved cache structure with generic type support
  private static usersCache: CacheEntry<IUser[]> | null = null;
  private static requestsCache: CacheEntry<IRequest[]> | null = null;
  private static citiesCache: CacheEntry<ICity[]> | null = null;

  /**
   * Check if cache entry is still valid
   */
  private static isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < this.CACHE_DURATION;
  }

  /**
   * Fetch users with caching support
   */
  private static async fetchUsersWithCache(): Promise<IUser[]> {
    if (this.usersCache && this.isCacheValid(this.usersCache)) {
      return this.usersCache.data;
    }

    const { data } = await apiClient.get<IUser[]>(`${this.apiEndpoint}/users`);

    this.usersCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  }

  /**
   * Fetch requests with caching support
   */
  private static async fetchRequestsWithCache(): Promise<IRequest[]> {
    if (this.requestsCache && this.isCacheValid(this.requestsCache)) {
      return this.requestsCache.data;
    }

    const { data } = await apiClient.get<IRequest[]>(
      `${this.apiEndpoint}/requests`
    );

    this.requestsCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  }

  /**
   * Fetch cities with caching support
   */
  private static async fetchCitiesWithCache(): Promise<ICity[]> {
    if (this.citiesCache && this.isCacheValid(this.citiesCache)) {
      return this.citiesCache.data;
    }

    const cities = await LocationsService.getCities();

    this.citiesCache = {
      data: cities,
      timestamp: Date.now(),
    };

    return cities;
  }

  /**
   * Clear all caches
   */
  public static clearCache(): void {
    this.usersCache = null;
    this.requestsCache = null;
    this.citiesCache = null;
  }

  /**
   * Clear specific cache entries
   */
  public static clearUserCache(): void {
    this.usersCache = null;
  }

  public static clearRequestCache(): void {
    this.requestsCache = null;
  }

  public static clearCityCache(): void {
    this.citiesCache = null;
  }

  // User Management Methods
  /**
   * Fetch all users
   */
  public static async fetchUsers(): Promise<IUser[]> {
    return this.fetchUsersWithCache();
  }

  /**
   * Get user by ID
   */
  public static async getUserById(userId: number): Promise<IUser> {
    const { data } = await apiClient.get<IUser>(
      `${this.apiEndpoint}/users/${userId}`
    );
    return data;
  }

  /**
   * Create a new user
   */
  public static async createUser(
    userData: Omit<IUser, "user_id" | "created_at" | "updated_at">
  ): Promise<IUser> {
    const { data } = await apiClient.post<IUser>(
      `${this.apiEndpoint}/users`,
      userData
    );
    this.clearUserCache();
    return data;
  }

  /**
   * Update user information
   */
  public static async updateUser(
    userId: number,
    userData: Partial<IUser>
  ): Promise<IUser> {
    const { data } = await apiClient.put<IUser>(
      `${this.apiEndpoint}/users/${userId}`,
      userData
    );
    this.clearUserCache();
    return data;
  }

  /**
   * Delete a user
   */
  public static async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`${this.apiEndpoint}/users/${userId}`);
    this.clearUserCache();
  }

  // Request Management Methods
  /**
   * Fetch all requests
   */
  public static async fetchRequests(): Promise<IRequest[]> {
    return this.fetchRequestsWithCache();
  }

  /**
   * Get request by ID
   */
  public static async getRequestById(requestId: number): Promise<IRequest> {
    const { data } = await apiClient.get<IRequest>(
      `${this.apiEndpoint}/requests/${requestId}`
    );
    return data;
  }

  /**
   * Approve a request
   */
  public static async approveRequest(requestId: number): Promise<IRequest> {
    const { data } = await apiClient.post<IRequest>(
      `${this.apiEndpoint}/requests/${requestId}/approve`
    );
    this.clearRequestCache();
    return data;
  }

  /**
   * Reject a request
   */
  public static async rejectRequest(requestId: number): Promise<IRequest> {
    const { data } = await apiClient.post<IRequest>(
      `${this.apiEndpoint}/requests/${requestId}/reject`
    );
    this.clearRequestCache();
    return data;
  } // Dashboard Statistics Methods
  /**
   * Fetch dashboard statistics
   */
  public static async fetchDashboardStats(): Promise<IDashboardStats> {
    try {
      const [users, requests] = await Promise.all([
        this.fetchUsersWithCache(),
        this.fetchRequestsWithCache(),
      ]);

      // Calculate user statistics by role
      const userRoleCounts = users.reduce(
        (acc: Record<string, number>, user: IUser) => {
          const role = user.role || "unknown";
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        },
        {}
      );

      // Ensure all expected roles are present
      const usersByRole = {
        user: userRoleCounts.user || 0,
        admin: userRoleCounts.admin || 0,
        manager: userRoleCounts.manager || 0,
        candidate: userRoleCounts.candidate || 0,
      };

      // Calculate request statistics by status
      const requestStatusCounts = requests.reduce(
        (acc: Record<string, number>, request: IRequest) => {
          const status = request.status || "unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );

      // Ensure all expected statuses are present
      const requestsByStatus = {
        pending: requestStatusCounts.pending || 0,
        approved: requestStatusCounts.approved || 0,
        rejected: requestStatusCounts.rejected || 0,
      };

      // Generate recent activity from requests
      const recentActivity: IRecentActivity[] = requests
        .filter((request) => request.created_at) // Only include requests with valid dates
        .sort((a, b) => {
          const dateA = new Date(a.created_at!).getTime();
          const dateB = new Date(b.created_at!).getTime();
          return dateB - dateA; // Most recent first
        })
        .slice(0, 5)
        .map((request, index) => {
          const requestId = request.request_id || index;
          let activityType:
            | "request_created"
            | "request_approved"
            | "request_rejected";

          switch (request.status) {
            case "approved":
              activityType = "request_approved";
              break;
            case "rejected":
              activityType = "request_rejected";
              break;
            default:
              activityType = "request_created";
          }

          return {
            id: requestId,
            type: activityType,
            description: `${request.field_name || "Field"} change request ${
              request.status || "created"
            }`,
            userId: request.user_id || 0,
            userName: `User ${request.user_id || "Unknown"}`,
            timestamp: request.created_at || new Date().toISOString(),
          };
        });

      return {
        totalUsers: users.length,
        pendingRequests: requestsByStatus.pending,
        approvedRequests: requestsByStatus.approved,
        rejectedRequests: requestsByStatus.rejected,
        usersByRole,
        requestsByStatus,
        recentActivity,
      };
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  }

  /**
   * Fetch user growth data for charts
   */
  public static async fetchUserGrowth(
    period: "3months" | "6months" | "12months" = "6months"
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
        const currentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i,
          1
        );
        const monthStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const monthEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        // Count new users in this month
        const newUsersInMonth = users.filter((user: IUser) => {
          if (!user.created_at) return false;
          const userDate = new Date(user.created_at);
          return userDate >= monthStart && userDate <= monthEnd;
        }).length;

        // Count total users up to this month
        const totalUsersUpToMonth = users.filter((user: IUser) => {
          if (!user.created_at) return false;
          const userDate = new Date(user.created_at);
          return userDate <= monthEnd;
        }).length;

        monthlyData.push({
          period: currentDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          date: currentDate.toISOString().split("T")[0],
          newUsers: newUsersInMonth,
          totalUsers: totalUsersUpToMonth,
        });
      }

      return monthlyData;
    } catch (error) {
      console.error("Error computing user growth data:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Fetch requests trend data for charts
   */
  public static async fetchRequestsTrend(
    period: "3months" | "6months" | "12months" = "6months"
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
        const currentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i,
          1
        );
        const monthStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const monthEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        // Filter requests for this month
        const requestsInMonth = requests.filter((request: IRequest) => {
          if (!request.created_at) return false;
          const requestDate = new Date(request.created_at);
          return requestDate >= monthStart && requestDate <= monthEnd;
        });

        // Count requests by status in this month
        const newRequests = requestsInMonth.length;
        const approvedRequestsInMonth = requestsInMonth.filter(
          (r) => r.status === "approved"
        ).length;
        const rejectedRequestsInMonth = requestsInMonth.filter(
          (r) => r.status === "rejected"
        ).length;

        // Count total requests up to this month
        const totalRequestsUpToMonth = requests.filter((request: IRequest) => {
          if (!request.created_at) return false;
          const requestDate = new Date(request.created_at);
          return requestDate <= monthEnd;
        }).length;

        monthlyData.push({
          period: currentDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          date: currentDate.toISOString().split("T")[0],
          newRequests,
          totalRequests: totalRequestsUpToMonth,
          approvedRequests: approvedRequestsInMonth,
          rejectedRequests: rejectedRequestsInMonth,
        });
      }

      return monthlyData;
    } catch (error) {
      console.error("Error computing requests trend data:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Fetch city distribution data for charts
   */
  public static async fetchCityDistribution(): Promise<ICityDistribution[]> {
    try {
      const [users, cities] = await Promise.all([
        this.fetchUsersWithCache(),
        this.fetchCitiesWithCache(),
      ]);

      // Create city lookup map
      const cityMap = cities.reduce(
        (acc: Record<number, string>, city: ICity) => {
          acc[city.city_id] = city.name;
          return acc;
        },
        {}
      );

      // Count users by city
      const cityCount = users.reduce(
        (acc: Record<string, number>, user: IUser) => {
          const cityId = user.city_id;
          if (!cityId) return acc; // Skip users without city

          const cityName = cityMap[cityId] || `City ${cityId}`;
          acc[cityName] = (acc[cityName] || 0) + 1;
          return acc;
        },
        {}
      );

      // Convert to array and calculate percentages
      const totalUsers = users.filter((user) => user.city_id).length; // Only count users with cities

      return Object.entries(cityCount)
        .map(([cityName, count], index) => ({
          cityId: index + 1,
          cityName,
          userCount: count,
          percentage:
            totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
        }))
        .sort((a, b) => b.userCount - a.userCount); // Sort by user count descending
    } catch (error) {
      console.error("Error computing city distribution data:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Get dashboard data with error recovery
   */
  public static async getDashboardData(): Promise<{
    stats: IDashboardStats | null;
    userGrowth: IUserGrowthData[];
    requestsTrend: IRequestsTrendData[];
    cityDistribution: ICityDistribution[];
  }> {
    try {
      const [stats, userGrowth, requestsTrend, cityDistribution] =
        await Promise.allSettled([
          this.fetchDashboardStats(),
          this.fetchUserGrowth(),
          this.fetchRequestsTrend(),
          this.fetchCityDistribution(),
        ]);

      return {
        stats: stats.status === "fulfilled" ? stats.value : null,
        userGrowth: userGrowth.status === "fulfilled" ? userGrowth.value : [],
        requestsTrend:
          requestsTrend.status === "fulfilled" ? requestsTrend.value : [],
        cityDistribution:
          cityDistribution.status === "fulfilled" ? cityDistribution.value : [],
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        stats: null,
        userGrowth: [],
        requestsTrend: [],
        cityDistribution: [],
      };
    }
  }

  // Utility Methods
  /**
   * Search users by various criteria
   */
  public static async searchUsers(
    query: string,
    field?: keyof IUser
  ): Promise<IUser[]> {
    const users = await this.fetchUsersWithCache();

    if (!query.trim()) return users;

    const searchQuery = query.toLowerCase().trim();

    return users.filter((user) => {
      if (field) {
        const fieldValue = user[field];
        return (
          fieldValue && String(fieldValue).toLowerCase().includes(searchQuery)
        );
      }

      // Search across multiple fields if no specific field is provided
      const searchableFields = [
        user.first_name,
        user.last_name,
        user.email,
        user.phone_number,
        user.iin,
        user.role,
      ];

      return searchableFields.some(
        (value) => value && String(value).toLowerCase().includes(searchQuery)
      );
    });
  }

  /**
   * Get users by role
   */
  public static async getUsersByRole(role: string): Promise<IUser[]> {
    const users = await this.fetchUsersWithCache();
    return users.filter((user) => user.role === role);
  }

  /**
   * Get requests by status
   */
  public static async getRequestsByStatus(status: string): Promise<IRequest[]> {
    const requests = await this.fetchRequestsWithCache();
    return requests.filter((request) => request.status === status);
  }

  /**
   * Get recent requests (last N days)
   */
  public static async getRecentRequests(days: number = 7): Promise<IRequest[]> {
    const requests = await this.fetchRequestsWithCache();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return requests
      .filter((request) => {
        if (!request.created_at) return false;
        return new Date(request.created_at) >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at!).getTime();
        const dateB = new Date(b.created_at!).getTime();
        return dateB - dateA;
      });
  }

  /**
   * Batch approve multiple requests
   */
  public static async batchApproveRequests(
    requestIds: number[]
  ): Promise<IRequest[]> {
    const results = await Promise.allSettled(
      requestIds.map((id) => this.approveRequest(id))
    );

    const successful = results
      .filter(
        (result): result is PromiseFulfilledResult<IRequest> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    // Log any failures
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      console.warn(
        `Failed to approve ${failures.length} out of ${requestIds.length} requests`
      );
    }

    return successful;
  }

  /**
   * Batch reject multiple requests
   */
  public static async batchRejectRequests(
    requestIds: number[]
  ): Promise<IRequest[]> {
    const results = await Promise.allSettled(
      requestIds.map((id) => this.rejectRequest(id))
    );

    const successful = results
      .filter(
        (result): result is PromiseFulfilledResult<IRequest> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    // Log any failures
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      console.warn(
        `Failed to reject ${failures.length} out of ${requestIds.length} requests`
      );
    }

    return successful;
  }

  /**
   * Get system health metrics
   */
  public static async getSystemHealth(): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingRequests: number;
    systemLoad: "low" | "medium" | "high";
    lastActivity: string | null;
  }> {
    try {
      const [users, requests] = await Promise.all([
        this.fetchUsersWithCache(),
        this.fetchRequestsWithCache(),
      ]);

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Count users created in the last week as "active"
      const activeUsers = users.filter((user) => {
        if (!user.created_at) return false;
        return new Date(user.created_at) >= oneWeekAgo;
      }).length;

      const pendingRequests = requests.filter(
        (r) => r.status === "pending"
      ).length;

      // Simple system load calculation based on pending requests
      let systemLoad: "low" | "medium" | "high";
      if (pendingRequests < 10) systemLoad = "low";
      else if (pendingRequests < 50) systemLoad = "medium";
      else systemLoad = "high";

      // Get most recent activity
      const lastActivity =
        requests
          .filter((r) => r.created_at)
          .sort(
            (a, b) =>
              new Date(b.created_at!).getTime() -
              new Date(a.created_at!).getTime()
          )[0]?.created_at || null;

      return {
        totalUsers: users.length,
        activeUsers,
        pendingRequests,
        systemLoad,
        lastActivity,
      };
    } catch (error) {
      console.error("Error getting system health:", error);
      throw error;
    }
  }

  /**
   * Export data for reporting (returns formatted data)
   */
  public static async exportData(type: "users" | "requests" | "dashboard") {
    try {
      switch (type) {
        case "users":
          return await this.fetchUsersWithCache();
        case "requests":
          return await this.fetchRequestsWithCache();
        case "dashboard":
          return await this.getDashboardData();
        default:
          throw new Error(`Unknown export type: ${type}`);
      }
    } catch (error) {
      console.error(`Error exporting ${type} data:`, error);
      throw error;
    }
  }
}
