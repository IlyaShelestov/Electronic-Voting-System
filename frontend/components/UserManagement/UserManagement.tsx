"use client";
import { useEffect, useState } from 'react';
import { IUser } from '@/models/IUser';
import { useTranslations } from 'next-intl';
import './UserManagement.scss';
import UserUpdateModal from '@/components/UserUpdateModal/UserUpdateModal';
import { FaPlus, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import { AdminService } from '@/services/adminService';

export default function UserManagement() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<{ type: string; value: string }[]>([]);
    const [selectedFilterType, setSelectedFilterType] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [sortField, setSortField] = useState<keyof IUser>('first_name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const t = useTranslations("adminPage");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await AdminService.fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
                console.error('Error updating user:', error);
            }
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await AdminService.deleteUser(userId);
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAddFilter = () => {
        setFilters([...filters, { type: selectedFilterType, value: '' }]);
    };

    const handleFilterChange = (index: number, value: string) => {
        const newFilters = [...filters];
        newFilters[index].value = value;
        setFilters(newFilters);
    };

    const handleRemoveFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
    };

    const handleSort = (field: keyof IUser) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
    
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredUsers = sortedUsers.filter(user =>
        (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.iin.includes(searchTerm) ||
         (user.patronymic && user.patronymic.toLowerCase().includes(searchTerm.toLowerCase())) ||
         user.date_of_birth.includes(searchTerm) ||
         user.city_id.toString().includes(searchTerm) ||
         user.phone_number.includes(searchTerm) ||
         (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        filters.every(filter => {
            switch (filter.type) {
                case 'name':
                    return user.first_name.toLowerCase().includes(filter.value.toLowerCase()) ||
                           user.last_name.toLowerCase().includes(filter.value.toLowerCase());
                case 'email':
                    return user.email.toLowerCase().includes(filter.value.toLowerCase());
                case 'role':
                    return user.role === filter.value;
                case 'iin':
                    return user.iin.includes(filter.value);
                case 'city_id':
                    return user.city_id.toString() === filter.value;
                default:
                    return true;
            }
        })
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        }
    }, [totalPages, currentPage]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="userManagement">
            <h2 className="userManagement__title">{t("userManagement")}</h2>
            <input type="text" className="search-input" placeholder={t("searchPlaceholder")} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <div className="filters">
                {filters.map((filter, index) => (
                    <div key={index} className="filter-item">
                        <input
                            type="text"
                            placeholder={t(`filterPlaceholder.${filter.type}`)}
                            value={filter.value}
                            onChange={e => handleFilterChange(index, e.target.value)}
                        />
                        <FaTrash onClick={() => handleRemoveFilter(index)} style={{ cursor: 'pointer', marginLeft: '0.5rem', color: 'red' }} />
                    </div>
                ))}
                <select value={selectedFilterType} onChange={e => setSelectedFilterType(e.target.value)}>
                    <option value="name">{t("filterType.name")}</option>
                    <option value="email">{t("filterType.email")}</option>
                    <option value="role">{t("filterType.role")}</option>
                    <option value="iin">{t("filterType.iin")}</option>
                    <option value="city_id">{t("filterType.cityId")}</option>
                </select>
                <FaPlus onClick={handleAddFilter} style={{ cursor: 'pointer', marginLeft: '0.5rem' }} />
            </div>
            <table className="userManagement__table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('first_name')}>{t("firstName")}</th>
                        <th onClick={() => handleSort('last_name')}>{t("lastName")}</th>
                        <th onClick={() => handleSort('email')}>{t("email")}</th>
                        <th>{t("actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(user)}>{t("edit")}</button>
                                <button className="delete-button" onClick={() => user.user_id !== undefined && handleDelete(user.user_id)}>{t("delete")}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    <FaArrowLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    <FaArrowRight />
                </button>
            </div>
            <div className="users-per-page">
                <label htmlFor="usersPerPage">{t("usersPerPage")}</label>
                <select id="usersPerPage" value={usersPerPage} onChange={e => setUsersPerPage(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
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