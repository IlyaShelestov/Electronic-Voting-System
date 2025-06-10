import React from 'react';

export default function UsersPerPageSelector({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}) {
  return (
    <div className="users-per-page">
      <label htmlFor="usersPerPage">{label}</label>
      <select
        id="usersPerPage"
        value={value}
        onChange={onChange}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}
