'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { blogs } from '@/data/blogs';
import SectionHeading from '@/components/common/SectionHeading';
import { formatDate, truncateText } from '@/utils/helpers';

type FilterCategory = 'all' | 'medical' | 'cs' | 'general';

interface IFilterOption {
  label: string;
  value: FilterCategory;
}

const filterOptions: IFilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Medical', value: 'medical' },
  { label: 'CS', value: 'cs' },
  { label: 'General', value: 'general' },
];

const categoryColors: Record<string, string> = {
  medical: 'bg-medical',
  cs: 'bg-cs',
  general: 'bg-secondary',
};

const Blog: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredBlogs =
    activeFilter === 'all'
      ? blogs
      : blogs.filter((blog) => blog.category === activeFilter);

  return (
    <section className="py-8 pb-12 max-w-[1200px] mx-auto px-4">
      <SectionHeading
        title="Blog & Articles"
        subtitle="Insights, tips, and guides from our experts"
      />

      <div className="flex gap-2 mb-8 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-6 py-2 rounded-full text-sm-text font-medium transition-colors duration-200
              ${activeFilter === option.value
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-light-gray text-dark-gray hover:bg-[#CBD5E1]'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative w-full h-[200px]">
                <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover" />
              </div>
              <div className="px-6 pt-4 pb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs-text font-semibold text-white ${categoryColors[blog.category]} capitalize`}>
                  {blog.category}
                </span>
                <h3 className="text-[1.125rem] font-semibold text-dark mt-3 mb-2 leading-snug">{blog.title}</h3>
                <p className="text-sm-text text-dark-gray leading-relaxed mb-4">
                  {truncateText(blog.excerpt, 100)}
                </p>
                <div className="flex items-center justify-between text-xs-text text-gray mb-3 flex-wrap gap-1">
                  <span>{blog.author}</span>
                  <span>{formatDate(blog.publishedAt)}</span>
                  <span>{blog.readTime}</span>
                </div>
                <span className="inline-block text-sm-text font-semibold text-primary cursor-pointer hover:underline">
                  Read More &rarr;
                </span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-center text-gray text-body py-12 col-span-full">
            No articles found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default Blog;
