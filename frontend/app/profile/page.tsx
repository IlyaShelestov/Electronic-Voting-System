"use client";

import "./Profile.scss";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaEdit, FaSpinner, FaUserCircle } from "react-icons/fa";

import FieldChangeModal from "@/components/FieldChangeModal/FieldChangeModal";
import LoadingButton from "@/components/LoadingButton/LoadingButton";
import { useAuth } from "@/hooks/useAuth";
import { IRequest } from "@/models/IRequest";
import { IUser } from "@/models/IUser";
import { UserService } from "@/services/userService";
import { useLoading } from "@/store/hooks/useLoading";

interface EditableField {
  key: keyof IUser;
  label: string;
  value: string | number;
  canEdit: boolean;
  type: "text" | "email" | "tel" | "number";
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, refetch, updateUser } = useAuth();
  const t = useTranslations("profilePage");
  const tPage = useTranslations("profilePage");
  const { isLoading, withLoading } = useLoading();

  const [userData, setUserData] = useState<IUser | null>(user);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<EditableField | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"profile" | "requests">("profile");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="profile-loading">
        <FaSpinner className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  // Show message if no user data
  if (!user) {
    return (
      <div className="profile-error">
        <p>Unable to load user data. Please try refreshing the page.</p>
      </div>
    );
  }
  useEffect(() => {
    if (user) {
      setUserData(user);
      fetchUserData();
      fetchUserRequests();
    }
  }, [user]);

  const fetchUserData = async () => {
    await withLoading("fetchUser", async () => {
      try {
        const fetchedUser = await UserService.getUser();
        setUserData(fetchedUser);
      } catch (error) {
        setError(t("failedToLoadProfile"));
        console.error("Error fetching user:", error);
      }
    });
  };

  const fetchUserRequests = async () => {
    await withLoading("fetchRequests", async () => {
      try {
        const userRequests = await UserService.getUserRequests();
        setRequests(userRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    });
  };

  const handleFieldChangeRequest = (field: EditableField) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  const handleRequestSuccess = () => {
    setSuccessMessage(t("requestSentSuccessfully"));
    fetchUserRequests();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const getEditableFields = (): EditableField[] => {
    if (!userData) return [];

    return [
      {
        key: "first_name",
        label: t("firstName"),
        value: userData.first_name || "",
        canEdit: true,
        type: "text",
      },
      {
        key: "last_name",
        label: t("lastName"),
        value: userData.last_name || "",
        canEdit: true,
        type: "text",
      },
      {
        key: "patronymic",
        label: t("patronymic"),
        value: userData.patronymic || "",
        canEdit: true,
        type: "text",
      },
      {
        key: "email",
        label: t("email"),
        value: userData.email || "",
        canEdit: true,
        type: "email",
      },
      {
        key: "phone_number",
        label: t("phoneNumber"),
        value: userData.phone_number || "",
        canEdit: true,
        type: "tel",
      },
      {
        key: "city_id",
        label: t("cityId"),
        value: userData.city_id || "",
        canEdit: true,
        type: "number",
      },
      {
        key: "iin",
        label: t("iin"),
        value: userData.iin || "",
        canEdit: false,
        type: "text",
      },
      {
        key: "date_of_birth",
        label: t("dateOfBirth"),
        value: userData.date_of_birth || "",
        canEdit: false,
        type: "text",
      },
    ];
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

  if (!userData) {
    return (
      <div className="profile-page">
        <h1>{tPage("title")}</h1>
        <div className="loading-container">
          {isLoading("fetchUser") ? (
            <div className="loading-message">
              <FaSpinner className="spinner" />
              {t("loadingProfile")}
            </div>
          ) : (
            <div className="error-message">{t("failedToLoadProfile")}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <FaUserCircle className="profile-avatar" />
            <div className="profile-info">
              <h2 className="profile-name">
                {userData.first_name} {userData.last_name}
              </h2>
              <span className={`role-badge ${userData.role || ""}`}>
                {(userData.role || "").toUpperCase()}
              </span>
              <p className="user-id">ID: {userData.user_id}</p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            {t("profileInformation")}
          </button>
          <button
            className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            {t("myRequests")} ({requests.length})
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-details">
              <h3>{t("personalInformation")}</h3>
              <div className="fields-grid">
                {getEditableFields().map((field) => (
                  <div
                    key={field.key}
                    className="profile-row"
                  >
                    <div className="field-header">
                      <strong>{field.label}:</strong>
                      <span className="field-value">
                        {field.value || t("notSet")}
                      </span>
                    </div>
                    {field.canEdit && (
                      <button
                        className="edit-btn"
                        onClick={() => handleFieldChangeRequest(field)}
                        title={t("requestChange")}
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="requests-section">
              <div className="requests-header">
                <h3>{t("changeRequests")}</h3>
                <LoadingButton
                  onClick={fetchUserRequests}
                  isLoading={isLoading("fetchRequests")}
                  variant="primary"
                  size="small"
                  loadingText={t("refreshing")}
                >
                  {t("refresh")}
                </LoadingButton>
              </div>

              {requests.length === 0 ? (
                <div className="no-requests">
                  <p>{t("noRequests")}</p>
                  <p className="hint">{t("noRequestsHint")}</p>
                </div>
              ) : (
                <div className="requests-list">
                  {requests.map((request) => (
                    <div
                      key={request.request_id}
                      className="request-item"
                    >
                      <div className="request-header">
                        <span className="field-name">
                          {getFieldDisplayName(request.field_name)}
                        </span>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            request.status
                          )}`}
                        >
                          {t(request.status)}
                        </span>
                      </div>
                      <div className="request-changes">
                        <div className="change-item">
                          <span className="change-label">{t("from")}:</span>
                          <span className="old-value">
                            {request.old_value || t("empty")}
                          </span>
                        </div>
                        <div className="change-item">
                          <span className="change-label">{t("to")}:</span>
                          <span className="new-value">{request.new_value}</span>
                        </div>
                      </div>
                      <div className="request-date">
                        {t("requestedOn")}:{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedField && (
        <FieldChangeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={userData}
          fieldName={selectedField.key as string}
          fieldLabel={selectedField.label}
          currentValue={String(selectedField.value)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
}
