'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApplicationDetail } from '@/services/adminService';
import StatusBadge from '@/components/common/StatusBadge';
import ApplicationActions from '@/components/admin/ApplicationActions';
import Loader from '@/components/common/Loader';
import { IAdminApplicationDetail } from '@/types';

interface ITeacherRequestDetailProps {
  id: string;
}

function formatDate(isoString: string | null): string {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const TeacherRequestDetail: React.FC<ITeacherRequestDetailProps> = ({ id }) => {
  const [detail, setDetail] = useState<IAdminApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getApplicationDetail(id);
        setDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load application.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, refreshKey]);

  const handleActionComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div>
        <Link
          href="/admin/teacher-requests"
          className="text-primary text-sm-text hover:underline mb-4 inline-block"
        >
          &larr; Back to requests
        </Link>
        <div
          role="alert"
          className="bg-red-50 border border-error rounded-md px-4 py-3 text-error text-sm-text"
        >
          {error}
        </div>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/teacher-requests"
        className="text-primary text-sm-text hover:underline mb-4 inline-block"
      >
        &larr; Back to requests
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-h3 font-bold text-dark">{detail.name}</h1>
            <p className="text-sm-text text-dark-gray mt-1">{detail.email}</p>
          </div>
          <StatusBadge status={detail.status} />
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <div>
            <dt className="text-sm-text font-semibold text-dark-gray">Phone</dt>
            <dd className="text-sm-text text-dark mt-0.5">{detail.phone}</dd>
          </div>
          <div>
            <dt className="text-sm-text font-semibold text-dark-gray">Subject Area</dt>
            <dd className="text-sm-text text-dark mt-0.5">
              {detail.subject_area === 'cs' ? 'Computer Science' : 'Medical Sciences'}
            </dd>
          </div>
          <div>
            <dt className="text-sm-text font-semibold text-dark-gray">Experience</dt>
            <dd className="text-sm-text text-dark mt-0.5">
              {detail.experience_years} years
            </dd>
          </div>
          <div>
            <dt className="text-sm-text font-semibold text-dark-gray">Submitted</dt>
            <dd className="text-sm-text text-dark mt-0.5">{formatDate(detail.created_at)}</dd>
          </div>
          {detail.reviewed_at && (
            <div>
              <dt className="text-sm-text font-semibold text-dark-gray">Reviewed</dt>
              <dd className="text-sm-text text-dark mt-0.5">
                {formatDate(detail.reviewed_at)}
              </dd>
            </div>
          )}
          {detail.invite_token_expires_at && (
            <div>
              <dt className="text-sm-text font-semibold text-dark-gray">Invite Expires</dt>
              <dd className="text-sm-text text-dark mt-0.5">
                {formatDate(detail.invite_token_expires_at)}
              </dd>
            </div>
          )}
        </dl>

        <div className="mb-4">
          <h2 className="text-sm-text font-semibold text-dark-gray mb-1">
            Qualifications
          </h2>
          <p className="text-sm-text text-dark whitespace-pre-wrap">
            {detail.qualifications}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-sm-text font-semibold text-dark-gray mb-1">
            Teaching Philosophy
          </h2>
          <p className="text-sm-text text-dark whitespace-pre-wrap">
            {detail.teaching_philosophy}
          </p>
        </div>

        {detail.admin_notes && (
          <div>
            <h2 className="text-sm-text font-semibold text-dark-gray mb-1">
              Admin Notes
            </h2>
            <p className="text-sm-text text-dark whitespace-pre-wrap">
              {detail.admin_notes}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-h4 font-semibold text-dark mb-4">Actions</h2>
        <ApplicationActions
          id={detail.id}
          status={detail.status}
          onActionComplete={handleActionComplete}
        />
      </div>
    </div>
  );
};

export default TeacherRequestDetail;
