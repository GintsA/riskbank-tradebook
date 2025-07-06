import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen by default', () => {
  render(<App />);
  const heading = screen.getByText(/Login to RiskBank/i);
  expect(heading).toBeInTheDocument();
});
