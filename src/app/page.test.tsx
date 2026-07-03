import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Page from './page'

// Mock do roteador do Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}))

describe('Timevision Home Page', () => {
  it('deve renderizar a tela inicial sem quebrar', () => {
    render(<Page />)
    // Verifica se a marca "Timevision" está presente na renderização
    expect(screen.getAllByText(/Timevision/i)[0]).toBeInTheDocument()
  })
})
