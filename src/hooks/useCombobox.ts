import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
} from 'react'

export interface UseComboboxOptions<T> {
  items: T[]
  isOpen: boolean
  setOpen: (open: boolean) => void
  onSelect: (item: T) => void
}

export interface UseComboboxResult<T> {
  activeIndex: number
  containerRef: MutableRefObject<HTMLDivElement | null>
  open: () => void
  close: () => void
  setActiveIndex: (index: number) => void
  select: (item: T) => void
  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

export function useCombobox<T>({
  items,
  isOpen,
  setOpen,
  onSelect,
}: UseComboboxOptions<T>): UseComboboxResult<T> {
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => setActiveIndex(-1), [items])

  const open = useCallback(() => setOpen(true), [setOpen])

  const close = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
  }, [setOpen])

  const select = useCallback(
    (item: T) => {
      onSelect(item)
      close()
    },
    [close, onSelect],
  )

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return
      close()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen, close])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()

        if (!isOpen) {
          open()
          return
        }
        if (items.length === 0) return

        const delta = event.key === 'ArrowDown' ? 1 : -1

        setActiveIndex((current) => (current + delta + items.length) % items.length)
        return
      }

      if (event.key === 'Enter') {
        const active = items[activeIndex]

        if (!isOpen || !active) return
        event.preventDefault()
        select(active)
        return
      }

      if (event.key === 'Escape') close()
    },
    [activeIndex, close, isOpen, items, open, select],
  )

  return { activeIndex, containerRef, open, close, setActiveIndex, select, handleKeyDown }
}
