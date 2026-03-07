'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getApplications } from '@/services/adminService';
import StatusBadge from '@/components/common/StatusBadge';
import { IPaginatedApplications } from '@/types';

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Registered', value: 'registered' },
];

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const TeacherRequests: React.FC = () => {
  const [data, setData] = useState<IPaginatedApplications | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getApplications({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusChange = (status: string) => {
    setPage(1);
    setStatusFilter(status);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h3 font-bold text-dark">Teacher Requests</h1>
        <p className="text-sm-text text-dark-gray mt-1">
          Review and manage teacher applications.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search applications"
            className="flex-1 border border-light-gray rounded-md px-3 py-2 text-sm-text text-dark focus:outline-none focus:ring-1 focus:ring-primary md:w-64 md:flex-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-sm-text font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-1 overflow-x-auto pb-1" role="group" aria-label="Filter by status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`flex-shrink-0 px-3 py-2 text-sm-text font-medium rounded-md transition-colors ${
                statusFilter === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-white border border-light-gray text-dark-gray hover:bg-light'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-error rounded-md px-4 py-3 mb-4 text-error text-sm-text"
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12 text-dark-gray text-sm-text">
          Loading...
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && data && (
        <>
          {data.items.length === 0 ? (
            <div className="text-center py-12 text-dark-gray text-sm-text">
              No applications found.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-light border-b border-light-gray">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm-text font-semibold text-dark-gray">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm-text font-semibold text-dark-gray">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-sm-text font-semibold text-dark-gray">
                      Subject
                    </th>
                    <th className="text-left px-4 py-3 text-sm-text font-semibold text-dark-gray">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm-text font-semibold text-dark-gray">
                      Submitted
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray">
                  {data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-light/50 transition-colors">
                      <td className="px-4 py-3 text-sm-text text-dark font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm-text text-dark-gray">
                        {item.email}
                      </td>
                      <td className="px-4 py-3 text-sm-text text-dark-gray">
                        {item.subject_area === 'cs' ? 'Computer Science' : 'Medical Sciences'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-sm-text text-dark-gray">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/teacher-requests/${item.id}`}
                          className="text-primary text-sm-text font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm-text text-dark-gray">
                Showing {(page - 1) * data.page_size + 1}–
                {Math.min(page * data.page_size, data.total)} of {data.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm-text font-medium border border-light-gray rounded-md disabled:opacity-40 hover:bg-light transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.has_next}
                  className="px-3 py-1.5 text-sm-text font-medium border border-light-gray rounded-md disabled:opacity-40 hover:bg-light transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherRequests;
