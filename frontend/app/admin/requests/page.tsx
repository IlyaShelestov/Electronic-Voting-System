"use client";

import "./RequestsPage.scss";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import LoadingButton from "@/components/LoadingButton/LoadingButton";
import { IRequest, IRequestWithUserData } from "@/models/IRequest";
import { IUser } from "@/models/IUser";
import { RequestStatusEnum } from "@/models/RequestStatus";
import { AdminService } from "@/services/adminService";
import { useLoading } from "@/store/hooks/useLoading";

export default function RequestsPage() {
  const t = useTranslations("adminPage");
  const { isLoading, withLoading } = useLoading();

  const [requests, setRequests] = useState<IRequestWithUserData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    IRequestWithUserData[]
  >([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<RequestStatusEnum | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter, searchTerm]);

  const fetchData = async () => {
    await withLoading("fetchData", async () => {
      setError(null);
      try {
        const [requestsData, usersData] = await Promise.all([
          AdminService.fetchRequests(),
          AdminService.fetchUsers(),
        ]);

        setUsers(usersData);

        const requestsWithUserData = requestsData.map((request: IRequest) => {
          const user = usersData.find(
            (user: IUser) => user.user_id === request.user_id
          );
          return {
            ...request,
            user,
            first_name: user?.first_name,
            last_name: user?.last_name,
            iin: user?.iin,
          };
        });

        setRequests(requestsWithUserData);
      } catch (error) {
        setError(t("fetchError"));
        console.error("Error fetching data:", error);
      }
    });
  };

  const filterRequests = () => {
    let filtered = requests;

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.first_name?.toLowerCase().includes(searchLower) ||
          request.last_name?.toLowerCase().includes(searchLower) ||
          request.iin?.includes(searchTerm) ||
          request.field_name?.toLowerCase().includes(searchLower) ||
          request.old_value?.toLowerCase().includes(searchLower) ||
          request.new_value?.toLowerCase().includes(searchLower) ||
          request.user?.email?.toLowerCase().includes(searchLower) ||
          request.user?.phone_number?.includes(searchTerm)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApproveRequest = async (requestId: number) => {
    await withLoading(`approve-${requestId}`, async () => {
      try {
        await AdminService.approveRequest(requestId);
        setRequests((prev) =>
          prev.map((request) =>
            request.request_id === requestId
              ? { ...request, status: "approved" as RequestStatusEnum }
              : request
          )
        );
      } catch (error) {
        setError(t("approveError"));
        console.error("Error approving request:", error);
      }
    });
  };

  const handleRejectRequest = async (requestId: number) => {
    await withLoading(`reject-${requestId}`, async () => {
      try {
        await AdminService.rejectRequest(requestId);
        setRequests((prev) =>
          prev.map((request) =>
            request.request_id === requestId
              ? { ...request, status: "rejected" as RequestStatusEnum }
              : request
          )
        );
      } catch (error) {
        setError(t("rejectError"));
        console.error("Error rejecting request:", error);
      }
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const getFullName = (request: IRequestWithUserData) => {
    const firstName = request.user?.first_name || request.first_name;
    const lastName = request.user?.last_name || request.last_name;
    return `${firstName || ""} ${lastName || ""}`.trim() || t("unknownUser");
  };

  const getFieldDisplayName = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      first_name: t("firstName"),
      last_name: t("lastName"),
      patronymic: t("patronymic"),
      email: t("email"),
      phone_number: t("phoneNumber"),
      city_id: t("cityId"),
    };
    return fieldMap[fieldName] || fieldName;
  };

  return (
    <div className="requests-page">
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="status-filter">{t("filterByStatus")}:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as RequestStatusEnum | "all")
            }
          >
            <option value="all">{t("allRequests")}</option>
            <option value="pending">{t("pending")}</option>
            <option value="approved">{t("approved")}</option>
            <option value="rejected">{t("rejected")}</option>
          </select>
        </div>

        <div className="search-group">
          <label htmlFor="search-input">{t("search")}:</label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>

        <LoadingButton
          onClick={fetchData}
          isLoading={isLoading("fetchData")}
          variant="primary"
          loadingText={t("refreshing")}
        >
          {t("refresh")}
        </LoadingButton>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading("fetchData") ? (
        <div className="loading-message">{t("loading")}</div>
      ) : (
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>{t("id")}</th>
                <th>{t("userName")}</th>
                <th>{t("iin")}</th>
                <th>{t("email")}</th>
                <th>{t("fieldName")}</th>
                <th>{t("oldValue")}</th>
                <th>{t("newValue")}</th>
                <th>{t("requestDate")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="no-data"
                  >
                    {t("noRequests")}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.request_id}>
                    <td>{request.request_id}</td>
                    <td>
                      {getFullName(request)}
                      <small className="user-id">
                        {" "}
                        (ID: {request.user_id})
                      </small>
                    </td>
                    <td>{request.iin || t("notAvailable")}</td>
                    <td>{request.user?.email || t("notAvailable")}</td>
                    <td>
                      <span className="field-name">
                        {getFieldDisplayName(request.field_name)}
                      </span>
                    </td>
                    <td>
                      <span className="old-value">
                        {request.old_value || t("notAvailable")}
                      </span>
                    </td>
                    <td>
                      <span className="new-value">
                        {request.new_value || t("notAvailable")}
                      </span>
                    </td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          request.status
                        )}`}
                      >
                        {t(request.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {request.status === "pending" ? (
                          <>
                            <LoadingButton
                              className="approve-btn"
                              onClick={() =>
                                handleApproveRequest(request.request_id)
                              }
                              isLoading={isLoading(
                                `approve-${request.request_id}`
                              )}
                              variant="success"
                              size="small"
                              loadingText={t("approving")}
                            >
                              {t("approve")}
                            </LoadingButton>
                            <LoadingButton
                              className="reject-btn"
                              onClick={() =>
                                handleRejectRequest(request.request_id)
                              }
                              isLoading={isLoading(
                                `reject-${request.request_id}`
                              )}
                              variant="danger"
                              size="small"
                              loadingText={t("rejecting")}
                            >
                              {t("reject")}
                            </LoadingButton>
                          </>
                        ) : (
                          <span className="no-actions">
                            {t("noActionsAvailable")}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
