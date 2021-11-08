import { render, screen, cleanup } from '@testing-library/react'
import { Widget } from '../Widget'

afterEach(() => cleanup());

describe("Widget", () => {
  test("with filter", () => {
    render(<Widget name="filter" />)

    screen.getByLabelText("filter")
  })
  test("with options", () => {
    render(<Widget name="options" textOn={false} />)

    screen.getByLabelText("options")
  })
  test("with render props", () => {
    render(
      <Widget
        name="search"
        type="InputSearchTable"
        textOn={false}
        attrs={{ className: 'searchInput' }}
        options={{ index: 2, tableId: 'id', searchKey: 'key' }}
      />
    )
    const widget = screen.getByLabelText("search")
    const textInput = widget.querySelector(['input[type=text]'])
    expect(textInput).toBeInTheDocument()
    expect(textInput.parentNode).toBe(widget)
  })
})
