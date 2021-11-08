import { render, cleanup } from '@testing-library/react'
import { Modal } from '../Modal'

afterEach(() => cleanup());

describe("Modal", () => {
  test("simple render", () => {
    console.log(Modal)
    render(<Modal />)
  })
})
