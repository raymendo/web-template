import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react'
import _ from "lodash"
import { Table, Thead, Tbody, Extractor } from '../'
import { users } from '../fixtures';
import { sortTable } from '../../tools'

afterEach(() => cleanup());

describe("Thead", () => {
  test("renders a table header with the given strings", () => {
    const headers = ["ID", "Username", "Departement", "User Privilege"];
    const table = document.createElement('table');

    render(
      <Thead {...{ headers }} />,
      { container: document.body.appendChild(table) }
    );

    headers.forEach(string => screen.getByText(string))
  })
})

describe("TBody", () => {
  test("renders a table body with the given data", () => {
    const schema = ["id", "username", "department", "role.name"];
    const table = document.createElement('table');
    const content = Extractor(schema)(users[0])
    // const content = schema.map(path => _.get(users[0], path))

    render(
      <Tbody content={[users[0]]} extractor={Extractor(schema)} />,
      { container: document.body.appendChild(table) }
    );
    content.forEach(elm => screen.getByRole('cell', { name: elm }))
    screen.getByRole('row', { name: content.join(' ') })
  })
  test("with data list containing idioms", () => {
    const schema = [
      "id",
      {
        path: "cards",
        dataAttr: "cards",
        render: data => Array.isArray(data) && data.length
      },
      {
        path: "faceprints",
        dataAttr: "faceprints",
        render: data => Array.isArray(data) && data.length
      },
      {
        path: "fingerprints",
        dataAttr: "fingerprints",
        render: data => Array.isArray(data) && data.length
      },
    ];
    const table = document.createElement('table');
    const content = Extractor(schema)(users[0])
    // console.log(content)
    render(
      <Tbody content={[users[0]]} extractor={Extractor(schema)} />,
      { container: document.body.appendChild(table) }
    );

    let cells = screen.getAllByRole('cell')

    for (let i = 0; i < content.length; i++) {
      if (typeof content[i] === 'string') {
        expect(cells[i]).toHaveTextContent(content[i])
      } else {
        expect(cells[i]).toHaveAttribute('data-' + content[i].dataAttr,
          '' + content[i].attrs['data-' + content[i].dataAttr])
      }
    }
  })
})

describe("Table", () => {
  /*
    @description:
      fetch and display in a table form
    @props
  */
  test("should render the provided caption", () => {
    const capt = "This is a table"
    render(
      <Table>
        <caption>{capt}</caption>
      </Table>
    )
    expect(screen.getByText(capt)).toBeInTheDocument()
  })
  test("should render the provided header", () => {
    const header = <thead data-testid="header">
      <tr>
        <th>header 1</th>
        <th>header 2</th>
      </tr>
    </thead>

    render(
      <Table>
        {header}
      </Table>
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('header 1')).toBeInTheDocument()
    expect(screen.getByText('header 2')).toBeInTheDocument()
  })
  test("should render the provided body", () => {
    render(
      <Table>
        <thead>
          <tr>
            <th>header 1</th>
            <th>header 2</th>
          </tr>
        </thead>
        <tbody data-testid="body">
          <tr data-testid="row">
            <td>cell 1</td>
            <td>cell 2</td>
          </tr>
        </tbody>
      </Table>
    )

    expect(screen.getByTestId('body')).toBeInTheDocument()
    expect(screen.getByTestId('row')).toBeInTheDocument()
    expect(screen.getByText('cell 1')).toBeInTheDocument()
    expect(screen.getByText('cell 2')).toBeInTheDocument()
  })
  test("should render the header from the schema", () => {
    const schema = [
      { title: "ID" },
      { title: "Cards" },
      { title: "Faceprints" },
      { title: "Fingerprints" }
    ];
    render(<Table {...{ schema }} />)

    const headers = schema.map(elm => elm.title)
    screen.getByRole('row', { name: headers.join(' ') })
  })
  test("should render empty header with no schema", () => {
    render(<Table />)

    const headers = []
    screen.getByRole('row', { name: headers.join(' ') })
  })
  describe("should display data from a fetcher", () => {
    test("with simple paths provided", async () => {
      const schema = ["id", "username", "department", "role.name"];
      const headers = ["ID", "Username", "Departement", "User Privilege"];

      const promise = new function () {
        this._p = new Promise(resolve => this.resolve = resolve)
      }
      const mockFetcher = jest.fn().mockImplementation(url => () => promise._p)

      render(
        <Table fetcher={mockFetcher("url")} extractor={Extractor(schema)} >
          <Thead {...{ headers }} />
        </Table >
      )

      const dataValues = schema.map(path => _.get(users[0], path))
      screen.getByRole('row', { name: headers.join(' ') })
      const table = screen.getByRole('table')

      expect(table).toHaveAttribute('aria-busy', 'true')
      setTimeout(() => promise.resolve([users[0]]), 0)
      // console.log(dataValues)

      await waitFor(() => {
        expect(table).toHaveAttribute('aria-busy', 'false')
        // screen.debug()
        screen.getByRole('row', { name: dataValues.join(' ') })
      })
      // checkRows(users[0], schema)
    })
    test("given idioms", async () => {
      const schema = [
        "id",
        {
          path: "cards",
          dataAttr: "cards",
          render: data => Array.isArray(data) && data.length
        },
        {
          path: "faceprints",
          dataAttr: "faceprints",
          render: data => Array.isArray(data) && data.length
        },
        {
          path: "fingerprints",
          dataAttr: "fingerprints",
          render: data => Array.isArray(data) && data.length
        },
      ];
      const headers = ["ID", "Cards", "Faceprints", "Fingerprints"];

      const promise = new function () {
        this._p = new Promise(resolve => this.resolve = resolve)
      }
      const mockFetcher = jest.fn().mockImplementation(url => () => promise._p)

      render(
        <Table fetcher={mockFetcher("url")} extractor={Extractor(schema)} >
          <Thead {...{ headers }} />
        </Table >
      )

      const dataValues = schema.map(elm => {
        if (typeof elm === 'string') {
          return _.get(users[0], elm)
        }
        const data = _.get(users[0], elm.path)

        if (typeof elm.dataAttr === 'string') {
          elm['attrs'] = { ['data-' + elm.dataAttr]: elm.render(data) }
        }
        return elm
      })

      screen.getByRole('row', { name: headers.join(' ') })
      const table = screen.getByRole('table')

      expect(table).toHaveAttribute('aria-busy', 'true')

      setTimeout(() => promise.resolve([users[0]]), 0)

      await waitFor(() => {
        expect(table).toHaveAttribute('aria-busy', 'false')
        let cells = screen.getAllByRole('cell')

        for (let i = 0; i < dataValues.length; i++) {
          if (typeof dataValues[i] === 'string') {
            expect(cells[i]).toHaveTextContent(dataValues[i])
          } else {
            expect(cells[i]).toHaveAttribute('data-' + dataValues[i].dataAttr,
              '' + dataValues[i].attrs['data-' + dataValues[i].dataAttr])
          }
        }
      })
    })

  })
  describe("when rowSelect is activated", () => {
    test("display a checkbox for every row", () => {
      const options = {
        rowSelect: true
      };
      const schema = ["id", "username", "department", "role.name"];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      render(
        <Table fetcher={() => users} {...props} />
      )
      const boxes = screen.getAllByRole('checkbox')
      const rows = screen.getAllByRole('row')
      boxes.forEach((box, i) => {
        expect(box.value).toBe(rows[i].dataset.id)
      })
    })
    // data-id attr should be taken from the data object and schema
    test("index should be taken from the data object", () => {
      // thinking about using a key identifier in the schema
      // to allow the find_by_key.
      const options = {
        index: 2,
        rowSelect: true
      };
      const schema = [
        "id",
        "username",
        "email",
        "role.name"
      ];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      render(
        <Table fetcher={() => users} {...props} />
      )
      const boxes = screen.getAllByRole('checkbox')
      const rows = screen.getAllByRole('row')
      boxes.forEach((box, i) => {
        expect(box.value).toBe(rows[i].dataset.id)
        if (i > 0) {
          expect(box.value).toBe(users[i - 1].email)
        }
      })
    })
    // select the top checkbox will propagate the selection
    test("click on top checkbox will propagate", () => {
      const options = {
        rowSelect: true
      };
      const schema = [
        "id",
        "username",
        "email",
        "role.name"
      ];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      render(
        <Table fetcher={() => users} {...props} />
      )

      const boxes = screen.getAllByRole('checkbox')

      boxes.forEach(box => expect(box).not.toBeChecked())

      fireEvent.click(boxes[0])
      expect(boxes[0]).toBeChecked()

      boxes.forEach(box => expect(box).toBeChecked())

      fireEvent.click(boxes[0])
      expect(boxes[0]).not.toBeChecked()
      boxes.forEach(box => expect(box).not.toBeChecked())
    })
    // select a checkbox will select the row also
    test("click on checkbox will select the row", () => {
      const options = {
        rowSelect: true
      };
      const schema = [
        "id",
        "username",
        "email",
        "role.name"
      ];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      render(
        <Table fetcher={() => users} {...props} />
      )

      const boxes = screen.getAllByRole('checkbox')
      const rows = screen.getAllByRole('row')

      boxes.forEach((box, i) => {
        if (i !== 0) {
          fireEvent.click(box)
          expect(rows[i]).toHaveAttribute('aria-selected', 'true')
        }
      })

      boxes.forEach((box, i) => {
        if (i !== 0) {
          fireEvent.click(box)
          expect(rows[i]).toHaveAttribute('aria-selected', 'false')
        }
      })
    })
  })
  describe("sort by clicking the headers", () => {
    test("should create sortable headers", () => {
      const options = {
        rowSelect: true,
        sortByHeaders: [1, 2]
      };
      const schema = [
        {
          title: "ID",
          path: "id"
        },
        {
          title: "Username",
          path: "username"
        },
        {
          title: "Department",
          path: "department"
        },
        {
          title: "Priviledge",
          path: "role.name"
        }
      ];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      render(
        <Table fetcher={() => users} {...props} />
      )

      // const rows = screen.getAllByRole('row')
      const sortCellOne = screen.getByRole('columnheader', { name: "Username" })
      const sortCellTwo = screen.getByRole('columnheader', { name: "Department" })
      expect(sortCellOne).toHaveAttribute('aria-sort', 'none')
      expect(sortCellTwo).toHaveAttribute('aria-sort', 'none')
    })

    test("should call the sorting method", () => {
      const mockSort = jest.fn()
      const options = {
        rowSelect: true,
        sortByHeaders: [1, 2],
        sortTable: () => mockSort
      };
      const schema = [
        {
          title: "ID",
          path: "id"
        },
        {
          title: "Username",
          path: "username"
        },
        {
          title: "Department",
          path: "department"
        },
        {
          title: "Priviledge",
          path: "role.name"
        }
      ];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      render(
        <Table fetcher={() => users} {...props} />
      )

      const filter = screen.getByRole('columnheader', { name: "Username" })
      fireEvent.click(filter)
      expect(mockSort).toHaveBeenCalledWith(+options.rowSelect + 1)
    })

    test("should sort by username", () => {
      const options = {
        rowSelect: true,
        sortByHeaders: [1, 2],
        sortTable
      };
      const schema = [
        {
          title: "ID",
          path: "id"
        },
        {
          title: "Username",
          path: "username"
        },
        {
          title: "Department",
          path: "department"
        },
        {
          title: "Priviledge",
          path: "role.name"
        }
      ];
      const props = {
        options,
        schema,
        extractor: Extractor(schema)
      }

      const { rerender } = render(
        <Table fetcher={() => users} {...props} />
      )

      let filter = screen.getByRole('columnheader', { name: "Username" })
      fireEvent.click(filter)
      expect(['ascending', 'descending'].includes(filter.getAttribute('aria-sort')))
        .toBeTruthy()
    })
  })
  // test a table without options
  // test a table without children
})