import { render, screen } from 'test-utils';
import TeacherCard from './TeacherCard';
import { ITeacher } from 'types';

const mockTeacher: ITeacher = {
  id: 't1',
  name: 'Dr. Test Name',
  designation: 'Senior Professor',
  department: 'medical',
  bio: 'A detailed bio about the teacher.',
  avatar: 'https://example.com/avatar.jpg',
};

describe('TeacherCard', () => {
  beforeEach(() => {
    render(<TeacherCard teacher={mockTeacher} />);
  });

  it('renders teacher name', () => {
    expect(screen.getByText('Dr. Test Name')).toBeInTheDocument();
  });

  it('renders teacher designation', () => {
    expect(screen.getByText('Senior Professor')).toBeInTheDocument();
  });

  it('renders teacher avatar with correct alt text', () => {
    const img = screen.getByAltText('Dr. Test Name avatar');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders department badge', () => {
    expect(screen.getByText('Medical')).toBeInTheDocument();
  });

  it('renders teacher bio', () => {
    expect(screen.getByText('A detailed bio about the teacher.')).toBeInTheDocument();
  });
});
