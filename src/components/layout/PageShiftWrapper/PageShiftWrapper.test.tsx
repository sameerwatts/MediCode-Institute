import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import PageShiftWrapper from './index';
import { useSidebar } from '@/context/SidebarContext';

jest.mock('@/context/SidebarContext', () => ({
  useSidebar: jest.fn(),
}));

const mockCloseMenu = jest.fn();

const closedSidebar = { isOpen: false, toggleMenu: jest.fn(), closeMenu: mockCloseMenu };
const openSidebar = { isOpen: true, toggleMenu: jest.fn(), closeMenu: mockCloseMenu };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PageShiftWrapper', () => {
  it('renders children', () => {
    (useSidebar as jest.Mock).mockReturnValue(closedSidebar);
    render(<PageShiftWrapper><p>Page content</p></PageShiftWrapper>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('applies no transform when sidebar is closed', () => {
    (useSidebar as jest.Mock).mockReturnValue(closedSidebar);
    const { container } = render(<PageShiftWrapper><p>content</p></PageShiftWrapper>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transform).toBe('translateX(0)');
  });

  it('applies shift transform when sidebar is open', () => {
    (useSidebar as jest.Mock).mockReturnValue(openSidebar);
    const { container } = render(<PageShiftWrapper><p>content</p></PageShiftWrapper>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transform).toBe('translateX(80vw)');
  });

  it('does not render the tap-to-close overlay when sidebar is closed', () => {
    (useSidebar as jest.Mock).mockReturnValue(closedSidebar);
    render(<PageShiftWrapper><p>content</p></PageShiftWrapper>);
    expect(screen.queryByLabelText('', { selector: '[aria-hidden="true"]' })).not.toBeInTheDocument();
  });

  it('renders the tap-to-close overlay when sidebar is open', () => {
    (useSidebar as jest.Mock).mockReturnValue(openSidebar);
    const { container } = render(<PageShiftWrapper><p>content</p></PageShiftWrapper>);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });

  it('calls closeMenu when the overlay is clicked', async () => {
    (useSidebar as jest.Mock).mockReturnValue(openSidebar);
    const { container } = render(<PageShiftWrapper><p>content</p></PageShiftWrapper>);
    const overlay = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    await userEvent.click(overlay);
    expect(mockCloseMenu).toHaveBeenCalledTimes(1);
  });
});
