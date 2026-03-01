import React from 'react';
import { render, screen } from '@/test-utils';
import FormRadioGroup from './index';

const noop = {};
const options = [
  { label: 'Medical', value: 'medical' },
  { label: 'Computer Science', value: 'cs' },
];

describe('FormRadioGroup', () => {
  it('renders the legend/label text', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    expect(screen.getByText('Subject Area')).toBeInTheDocument();
  });

  it('renders a fieldset element', () => {
    const { container } = render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });

  it('renders all radio options', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
  });

  it('renders option labels', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('sets correct value attribute on each radio', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('value', 'medical');
    expect(radios[1]).toHaveAttribute('value', 'cs');
  });

  it('sets correct name attribute on all radios', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'subject');
    });
  });

  it('renders error message when error prop is provided', () => {
    render(
      <FormRadioGroup
        name="subject"
        label="Subject Area"
        options={options}
        error="Please select a subject"
        registration={noop}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a subject');
  });

  it('does not render error when no error prop is provided', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders with a single option', () => {
    render(
      <FormRadioGroup
        name="type"
        label="Type"
        options={[{ label: 'Only Option', value: 'only' }]}
        registration={noop}
      />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(screen.getByText('Only Option')).toBeInTheDocument();
  });

  it('all radios are input elements of type radio', () => {
    render(
      <FormRadioGroup name="subject" label="Subject Area" options={options} registration={noop} />,
    );
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('type', 'radio');
    });
  });
});
