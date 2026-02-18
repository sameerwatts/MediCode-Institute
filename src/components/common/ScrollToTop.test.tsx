import { renderWithMemoryRouter } from 'test-utils';
import ScrollToTop from './ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls window.scrollTo(0, 0) on initial render', () => {
    renderWithMemoryRouter(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('returns null (no visible UI)', () => {
    const { container } = renderWithMemoryRouter(<ScrollToTop />);
    expect(container.innerHTML).toBe('');
  });
});
