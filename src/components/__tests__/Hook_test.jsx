import { cleanup } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useDidMount, useSafeAsync } from '../../hooks'
import _ from "lodash"

afterEach(() => cleanup());

describe("useSafeAsync", () => {
  const promise = new function () {
    this._p = new Promise(resolve => this.resolve = resolve)
    this.reset = () => {
      this.resolve(null)
      this._p = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }

  afterEach(() => promise.reset())

  test("test #1", async () => {
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)

    const { result } = renderHook(() => useSafeAsync({
      asyncFunc: mockFetcher,
      initialData: []
    }))
    const [, data, loading, error] = result.current
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(0)
    expect(loading).toBe(false)
    expect(error).toBeNull()
  })
  test("test #2", async () => {
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)

    const { result, rerender } = renderHook(() => useSafeAsync({
      asyncFunc: mockFetcher,
      initialData: []
    }))
    const [safeFetcher_1] = result.current
    rerender()
    const [safeFetcher_2] = result.current
    expect(safeFetcher_1).toBe(safeFetcher_2)
    // console.log(result.all)
    expect(result.all[0][0]).toBe(result.all[1][0])
  })
  test("test #3", () => {
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)

    const { result, unmount } = renderHook(() => useSafeAsync({
      asyncFunc: mockFetcher,
      initialData: []
    }))
    const [safeFetcher_1] = result.current
    unmount()
    const [safeFetcher_2] = result.current
    expect(safeFetcher_1).toBe(safeFetcher_2)
    // expect(result.all[0][0]).toBe(result.all[1][0])
  })
  test("test #4", () => {
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)

    const { result, unmount, rerender } = renderHook(() => useSafeAsync({
      asyncFunc: mockFetcher,
      initialData: []
    }))
    const [safeFetcher_1] = result.current
    unmount()
    rerender()
    const [safeFetcher_2] = result.current
    expect(safeFetcher_1).not.toBe(safeFetcher_2)
  })
  test("test #5", async () => {
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)
    const { result, unmount } = renderHook(() => useSafeAsync({
      asyncFunc: mockFetcher,
      initialData: []
    }))
    expect(Array.isArray(result.current)).toBe(true)
    const [safeFetcher] = result.current
    const closed = ([_data, _loading, _error]) => {
      const [safeFetcher_2, data, loading, error] = result.current
      expect(data).toHaveLength(_data)
      expect(loading).toBe(_loading)
      expect(error).toBe(_error)
      expect(safeFetcher_2).toBe(safeFetcher)
    }
    closed([0, false, null])
    act(() => {
      safeFetcher('/test-path')
    })
    expect(mockFetcher).toHaveBeenCalledWith('/test-path')
    closed([0, true, null])
    unmount()
  })
  test("test #6 unmount", () => {
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)
    const { result, unmount } = renderHook(() => useSafeAsync({
      asyncFunc: mockFetcher,
      initialData: []
    }))
    expect(result.current[4].isMounted).toBe(true)
    unmount()
    expect(result.current[4].isMounted).toBe(false)
  })
})

describe("useDidMount", () => {
  test("mounted component", () => {
    const { result } = renderHook(() => useDidMount())
    expect(_.get(result, 'current.current')).toBe(true)
    expect(_.get(result, 'current.isMounted')).toBe(true)
    expect(_.get(result.error)).toBeUndefined()
  })
  test("component unmounted", () => {
    const { result, unmount } = renderHook(() => useDidMount())
    unmount()
    expect(_.get(result, 'current.current')).toBe(false)
    expect(_.get(result, 'current.isMounted')).toBe(false)
    expect(_.get(result.error)).toBeUndefined()
  })
  test("component unmount and rerendered", () => {
    const { result, unmount, rerender } = renderHook(() => useDidMount())
    unmount()
    expect(_.get(result, 'current.current')).toBe(false)
    expect(_.get(result, 'current.isMounted')).toBe(false)
    expect(_.get(result.error)).toBeUndefined()
    rerender()
    expect(_.get(result, 'current.current')).toBe(true)
    expect(_.get(result, 'current.isMounted')).toBe(true)
  })
  test("component rerendered", () => {
    const { result, rerender } = renderHook(() => useDidMount())
    rerender()
    expect(_.get(result, 'current.current')).toBe(true)
    expect(_.get(result, 'current.isMounted')).toBe(true)
  })
})
