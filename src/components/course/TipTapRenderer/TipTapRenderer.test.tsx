import React from 'react';
import { render, screen } from '@/test-utils';
import TipTapRenderer from './index';

jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(() => null),
  EditorContent: ({ editor }: { editor: unknown }) =>
    editor ? <div data-testid="editor-content">Editor content</div> : null,
}));

jest.mock('@tiptap/starter-kit', () => ({
  __esModule: true,
  default: { configure: jest.fn(() => ({})) },
}));

jest.mock('@tiptap/extension-image', () => ({
  __esModule: true,
  default: { configure: jest.fn(() => ({})) },
}));

jest.mock('@tiptap/extension-code-block-lowlight', () => ({
  __esModule: true,
  default: { configure: jest.fn(() => ({})) },
}));

jest.mock('@tiptap/extension-table', () => ({
  Table: { configure: jest.fn(() => ({})) },
}));

jest.mock('@tiptap/extension-table-row', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-table-cell', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-table-header', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('lowlight', () => ({
  common: {},
  createLowlight: jest.fn(() => ({})),
}));

describe('TipTapRenderer', () => {
  it('shows empty message when content is null', () => {
    render(<TipTapRenderer content={null} />);
    expect(
      screen.getByText('No content available for this lesson yet.')
    ).toBeInTheDocument();
  });

  it('calls useEditor with editable false', () => {
    const { useEditor } = require('@tiptap/react');
    useEditor.mockReturnValue({});
    const content = { type: 'doc', content: [{ type: 'paragraph' }] };
    render(<TipTapRenderer content={content} />);
    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({ editable: false })
    );
  });

  it('renders EditorContent when editor exists and content provided', () => {
    const { useEditor } = require('@tiptap/react');
    useEditor.mockReturnValue({ mock: true });
    const content = { type: 'doc', content: [{ type: 'paragraph' }] };
    render(<TipTapRenderer content={content} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });
});
