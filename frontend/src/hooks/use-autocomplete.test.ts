import { renderHook, act } from '@testing-library/react'
import { useAutocomplete } from './use-autocomplete'

describe('useAutocomplete', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => new Response(JSON.stringify({ items: [{ value: 'Dev', label: 'Dev', occurrences: 5 }] }), { headers: { 'content-type': 'application/json' } })) as any
  })

  it('debounce y cache funcionan', async () => {
    const { result } = renderHook(() => useAutocomplete('educacion'))
    await act(async () => {
      result.current.query('De')
      result.current.query('Dev')
    })
    await new Promise((r) => setTimeout(r, 300))
    expect(result.current.items[0]?.value).toBe('Dev')
    const calls = (global.fetch as any).mock.calls.length
    await act(async () => { result.current.query('Dev') })
    await new Promise((r) => setTimeout(r, 300))
    // segunda llamada debe usar cache (no incrementa llamadas)
    expect((global.fetch as any).mock.calls.length).toBe(calls)
  })
})


