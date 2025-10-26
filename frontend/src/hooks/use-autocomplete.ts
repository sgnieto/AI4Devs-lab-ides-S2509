import { useState, useRef, useCallback } from 'react'

export type AutocompleteState = { loading: boolean; error: string | null; items: Array<{ value: string; label: string; occurrences: number }> }

export type AutocompleteItem = { value: string; label: string; occurrences: number }

const cache = new Map<string, { ts: number; items: AutocompleteState['items'] }>()

export function useAutocomplete(field: 'educacion' | 'experienciaLaboral') {
  const [state, setState] = useState<AutocompleteState>({ loading: false, error: null, items: [] })
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number | null>(null)

  const fetcher = useCallback((q: string) => {
    const key = `${field}:${q}`
    const cached = cache.get(key)
    if (cached && Date.now() - cached.ts < 60_000) {
      setState({ loading: false, error: null, items: cached.items })
      return
    }
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setState((s: AutocompleteState) => ({ ...s, loading: true, error: null }))
    fetch(`/candidates/suggest?field=${encodeURIComponent(field)}&q=${encodeURIComponent(q)}&limit=10`, { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        const data = (await r.json()) as { items: AutocompleteState['items'] }
        cache.set(key, { ts: Date.now(), items: data.items })
        setState({ loading: false, error: null, items: data.items })
      })
      .catch((e) => {
        if (ac.signal.aborted) return
        setState({ loading: false, error: e?.message || 'error', items: [] })
      })
  }, [field])

  const query = useCallback((q: string) => {
    if ((debounceRef.current as any)) clearTimeout(debounceRef.current as any)
    debounceRef.current = setTimeout(() => {
      if (!q || q.length < 2) { setState({ loading: false, error: null, items: [] }); return }
      fetcher(q)
    }, 250) as unknown as number
  }, [fetcher])

  return { ...state, query }
}
