import React from 'react';

import { IUser } from '@/models/IUser';

export default function UserTable({
  users,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortOrder,
  t,
}: {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (userId: number) => void;
  onSort: (field: keyof IUser) => void;
  sortField: keyof IUser;
  sortOrder: "asc" | "desc";
  t: (key: string) => string;
}) {
  return (
    <table className="userManagement__table">
      <thead>
        <tr>
          <th onClick={() => onSort("first_name")}>{t("firstName")}</th>
          <th onClick={() => onSort("last_name")}>{t("lastName")}</th>
          <th onClick={() => onSort("email")}>{t("email")}</th>
          <th>{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id}>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.email}</td>
            <td>
              <button
                className="edit-button"
                onClick={() => onEdit(user)}
              >
                {t("edit")}
              </button>
              <button
                className="delete-button"
                onClick={() =>
                  user.user_id !== undefined && onDelete(user.user_id)
                }
              >
                {t("delete")}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
