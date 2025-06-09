"use client";
import "./UsersPage.scss";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import Pagination from "@/components/Pagination/Pagination";
import SearchBar from "@/components/SearchBar/SearchBar";
import UsersPerPageSelector from "@/components/UsersPerPageSelector/UsersPerPageSelector";
import UserTable from "@/components/UsersTable/UsersTable";
import UserUpdateModal from "@/components/UserUpdateModal/UserUpdateModal";
import { IUser } from "@/models/IUser";
import { AdminService } from "@/services/adminService";

export default function UsersPage() {
  const t = useTranslations("adminPage");

  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof IUser>("first_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await AdminService.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedUser: IUser) => {
    if (updatedUser.user_id !== undefined) {
      try {
        await AdminService.updateUser(updatedUser.user_id, updatedUser);
        setIsModalOpen(false);
        loadUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await AdminService.deleteUser(userId);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSort = (field: keyof IUser) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(term) ||
      user.last_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.iin.includes(term) ||
      user.phone_number.includes(term) ||
      (user.patronymic && user.patronymic.toLowerCase().includes(term)) ||
      user.date_of_birth.includes(term) ||
      user.city_id.toString().includes(term) ||
      (user.role && user.role.toLowerCase().includes(term))
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages]);

  return (
    <div className="userManagement">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t("searchPlaceholder")}
      />

      <UserTable
        users={currentUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        t={t}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <UsersPerPageSelector
        value={usersPerPage}
        onChange={(e) => setUsersPerPage(Number(e.target.value))}
        label={t("usersPerPage")}
      />

      {isModalOpen && selectedUser && (
        <UserUpdateModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
