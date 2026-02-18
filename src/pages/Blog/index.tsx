import React, { useState } from 'react';
import { blogs } from 'data/blogs';
import PageWrapper from 'components/layout/PageWrapper';
import SectionHeading from 'components/common/SectionHeading';
import { formatDate, truncateText } from 'utils/helpers';
import {
  StyledBlogPage,
  StyledFilterTabs,
  StyledFilterTab,
  StyledBlogGrid,
  StyledBlogCard,
  StyledThumbnail,
  StyledCategoryBadge,
  StyledCardBody,
  StyledCardTitle,
  StyledCardExcerpt,
  StyledCardMeta,
  StyledReadMore,
  StyledEmptyState,
} from './styles';

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

const Blog: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredBlogs =
    activeFilter === 'all'
      ? blogs
      : blogs.filter((blog) => blog.category === activeFilter);

  return (
    <PageWrapper>
      <StyledBlogPage>
        <SectionHeading
          title="Blog & Articles"
          subtitle="Insights, tips, and guides from our experts"
        />

        <StyledFilterTabs>
          {filterOptions.map((option) => (
            <StyledFilterTab
              key={option.value}
              $active={activeFilter === option.value}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </StyledFilterTab>
          ))}
        </StyledFilterTabs>

        <StyledBlogGrid>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <StyledBlogCard key={blog.id}>
                <StyledThumbnail src={blog.thumbnail} alt={blog.title} />
                <StyledCardBody>
                  <StyledCategoryBadge $category={blog.category}>
                    {blog.category}
                  </StyledCategoryBadge>
                  <StyledCardTitle>{blog.title}</StyledCardTitle>
                  <StyledCardExcerpt>
                    {truncateText(blog.excerpt, 100)}
                  </StyledCardExcerpt>
                  <StyledCardMeta>
                    <span>{blog.author}</span>
                    <span>{formatDate(blog.publishedAt)}</span>
                    <span>{blog.readTime}</span>
                  </StyledCardMeta>
                  <StyledReadMore>Read More &rarr;</StyledReadMore>
                </StyledCardBody>
              </StyledBlogCard>
            ))
          ) : (
            <StyledEmptyState>No articles found in this category.</StyledEmptyState>
          )}
        </StyledBlogGrid>
      </StyledBlogPage>
    </PageWrapper>
  );
};

export default Blog;
