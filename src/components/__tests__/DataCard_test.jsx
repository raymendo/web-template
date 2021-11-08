import { render, screen, cleanup, waitFor } from '@testing-library/react'
import DataCard from '../DataCard'

// function capitalize() {
//   return this[0].toUpperCase() + this.slice(1);
// };

afterEach(() => cleanup());

describe("DataCard", () => {
  /*
    @description:
      fetch and display a single labeled data
    @props
      - url:
      - label:
      - fetcher:
    @renders
      - The data with it's label
      - loading/failure
    @states
      - loading: true/false
      - data: the value fetch from the api
  */
  test("props[url, label, fetcher] are required", () => {
    const cError = console.error
    console.error = jest.fn()


    render(<DataCard />)
    expect(console.error).toHaveBeenCalledTimes(3)
    console.error = cError
  })
  test("renders data with the given label", () => {
    const data = { label: "test-0", value: 0 }
    const { container } = render(
      <DataCard url="" label={data.label} fetcher={() => void 0} />
    )
    expect(screen.getByText(data.label).textContent).toBe(data.label)
    expect(+screen.getByText(data.value).textContent).toBe(data.value)
    expect(container).toHaveTextContent(data.label + data.value)
  })
  test("call [fetcher] with [url] as argument to get data", () => {
    const data = { label: "test-1", value: 45 }
    const url = '/test-path'
    const mockFetcher = jest.fn()
    mockFetcher.mockReturnValue(data.value)

    const { container } = render(
      <DataCard url={url} label={data.label} fetcher={mockFetcher} />
    )
    expect(mockFetcher).toHaveBeenCalledWith(url)
    expect(screen.getByText(data.label).textContent).toBe(data.label)
    expect(+screen.getByText(data.value).textContent).toBe(data.value)
    expect(container).toHaveTextContent(data.label + data.value)
  })
  test("renders data when [fetcher] returns a promise", async () => {
    const data = { label: "test-2", value: 46 }
    const url = '/test-path'
    const mockFetcher = jest.fn().mockImplementation(
      () => {
        const res = new Promise(resolve => {
          setTimeout(() => resolve(data.value), 0)
        })
        return res
      }
    )
    const { container } = render(
      <DataCard url={url} label={data.label} fetcher={mockFetcher} />
    )
    expect(mockFetcher).toHaveBeenCalledWith(url)
    await screen.findByText(data.value)
    expect(screen.getByText(data.label).textContent).toBe(data.label)
    expect(+screen.getByText(data.value).textContent).toBe(data.value)
    expect(container).toHaveTextContent(data.label + data.value)
  })
  describe("loading states", () => {
    test("normal", () => {
      const data = { label: "test-3", value: 0 }
      const url = '/test-path'

      const { container } = render(
        <DataCard url={url} label={data.label} fetcher={() => void 0} />
      )
      const elm = container.querySelectorAll('[aria-busy]')
      expect(elm).toHaveLength(1)
      expect(elm[0]).toBeInTheDocument();
      expect(elm[0]).toHaveAttribute('aria-busy', "false")
    })
    test("Busy", async () => {
      const data = { label: "test-4", value: 0 }
      const url = '/test-path'
      const promise = new function () {
        this._p = new Promise(resolve => this.resolve = resolve)
      }
      const mockFetcher = jest.fn().mockImplementation(() => promise._p)

      const { container } = render(
        <DataCard url={url} label={data.label} fetcher={mockFetcher} />
      )

      const elm = container.querySelectorAll('[aria-busy]')
      expect(elm).toHaveLength(1)
      expect(elm[0]).toBeInTheDocument();
      expect(elm[0]).toHaveAttribute('aria-busy', "true")
      promise.resolve(50)
      await screen.findByText(50)
    })
    test("Done with success", async () => {
      const data = { label: "test-4", value: 0 }
      const url = '/test-path'
      const promise = new function () {
        this._p = new Promise(resolve => this.resolve = resolve)
      }
      const mockFetcher = jest.fn().mockImplementation(() => promise._p)

      const { container } = render(
        <DataCard url={url} label={data.label} fetcher={mockFetcher} />
      )

      const elm = container.querySelectorAll('[aria-busy]')
      expect(elm).toHaveLength(1)
      expect(elm[0]).toBeInTheDocument();
      expect(elm[0]).toHaveAttribute('aria-busy', "true")
      promise.resolve(50)
      await waitFor(() => {
        expect(screen.getByText(50)).toBeInTheDocument()
        expect(elm[0]).toHaveAttribute('aria-busy', "false")
        expect(elm[0]).not.toHaveAttribute('aria-errormessage')
      })
    })
    test("Done with error", async () => {
      const data = { label: "test-4", value: 0 }
      const url = '/test-path'
      const promise = new function () {
        this._p = new Promise((_, reject) => this.reject = reject)
      }
      const mockFetcher = jest.fn().mockImplementation(() => promise._p)

      const { container } = render(
        <DataCard url={url} label={data.label} fetcher={mockFetcher} />
      )

      const elm = container.querySelectorAll('[aria-busy]')
      expect(elm).toHaveLength(1)
      expect(elm[0]).toBeInTheDocument();
      expect(elm[0]).toHaveAttribute('aria-busy', "true")
      promise.reject({ error: true })
      expect(screen.getByText(data.value)).toBeInTheDocument()
      await waitFor(() => {
        expect(elm[0]).toHaveAttribute('aria-busy', "false")
        expect(elm[0]).toHaveAttribute('aria-errormessage', "error")
      })
    })
  })
  test("clean all promise subscriptions when unmounts", async () => {
    const cError = console.error
    const mockCalls = { calls: 0 }
    console.error = (...args) => {
      mockCalls["args"] = args
      mockCalls["calls"] += 1
    }

    const data = { label: "test-4", value: 0 }
    const url = '/test-path'
    const promise = new function () {
      this._p = new Promise(resolve => this.resolve = resolve)
    }
    const mockFetcher = jest.fn().mockImplementation(() => promise._p)
    const { unmount } = render(
      <DataCard url={url} label={data.label} fetcher={mockFetcher} />
    )

    unmount()
    promise.resolve(59)
    await waitFor(() => expect(mockCalls).not.toHaveProperty('calls', 1))
    console.error = cError
  })
})