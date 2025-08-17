import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../components/ThemeToggle.jsx'

test('toggles theme', () => {
  render(<ThemeToggle />)
  const btn = screen.getByRole('button')
  expect(btn).toHaveTextContent(/Toggle/i)
  fireEvent.click(btn)
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})
