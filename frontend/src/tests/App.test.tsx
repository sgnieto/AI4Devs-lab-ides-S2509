import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'

test('mounts app', () => {
  const { container } = render(<App />)
  expect(container).toBeTruthy()
})
