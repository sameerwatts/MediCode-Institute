'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudent } from '@/services/adminService';
import Loader from '@/components/common/Loader';
import { IStudentDetail } from '@/types';

interface IStudentDetailProps {
  id: string;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const StudentDetail: React.FC<IStudentDetailProps> = ({ id }) => {
  const [detail, setDetail] = useState<IStudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getStudent(id);
        setDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load student.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div>
        <Link
          href="/admin/students"
          className="text-primary text-sm-text hover:underline mb-4 inline-block"
        >
          &larr; Back to students
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
    <div className="max-w-2xl">
      <Link
        href="/admin/students"
        className="text-primary text-sm-text hover:underline mb-4 inline-block"
      >
        &larr; Back to students
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-h3 font-bold text-dark">{detail.name}</h1>
          <p className="text-sm-text text-dark-gray mt-1">{detail.email}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <dt className="text-sm-text font-semibold text-dark-gray">Phone</dt>
            <dd className="text-sm-text text-dark mt-0.5">{detail.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm-text font-semibold text-dark-gray">Registered</dt>
            <dd className="text-sm-text text-dark mt-0.5">{formatDate(detail.created_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default StudentDetail;
