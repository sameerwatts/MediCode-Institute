import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

const NotFound: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[80vh] py-8 px-4">
      <h1 className="text-[8rem] font-extrabold text-primary-light leading-none">404</h1>
      <h2 className="text-h2 font-bold text-dark mt-4 mb-3">Page Not Found</h2>
      <p className="text-body text-gray max-w-[400px] leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          Go Home
        </Button>
      </Link>
    </section>
  );
};

export default NotFound;
