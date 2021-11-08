import { server as Server } from '../mocks/server';
import { fireEvent, render, screen, waitFor, cleanup, within } from '@testing-library/react'
import { Button, DataCard, UserList, useFetchedData, AddUserModal } from "../components/UserPage";
import UserPage from "../components/UserPage";
import { users, cards, faceprints, fingerprints } from '../mocks/data';
import { renderHook } from '@testing-library/react-hooks'

const mockUsageData = {
  users: 365,
  cards: 312,
  cars: 12,
  fingerprints: 26,
  faceprints: 15,
  error: "ERR"
}

const usersKeys = [
  "id",
  "username",
  "department",
  "role",
  "cards",
  "fingerprints",
  "faceprints",
  "qrcode",
  "status",
]

const authCount = 4;

const server = Server(
  mockUsageData, users, cards, fingerprints, faceprints
);

beforeAll(() => server.listen({
  onUnhandledRequest(req) {
    console.log(`req: ${req.method} ${req.url.href} failed`)
  }
}))

afterEach(() => {
  server.resetHandlers();
  cleanup();
})

afterAll(() => server.close())

describe("User Management Page", () => {
  test("Should render page title", () => {
    render(<UserPage />);
    const title = screen.getByText("User Management Page");
    expect(title).toBeInTheDocument();
  });
  test("Show up the title", () => {
    render(<UserPage />);
    expect(screen.getByText(/Usage/i)).toBeInTheDocument();
  });
  describe("Display the total", () => {
    test("users count", async () => {
      render(<UserPage />);
      await waitFor(() => {
        expect(+screen.getByLabelText(/^users count$/i).textContent)
          .toBe(mockUsageData["users"])
      });
      const box = screen.getByTestId("users-count");
      expect(box.textContent).toBe("Users" + mockUsageData["users"]);
    });
    test("cards count", async () => {
      render(<UserPage />);
      await waitFor(() => {
        expect(+screen.getByLabelText(/^cards count$/i).textContent)
          .toBe(mockUsageData["cards"])
      });
      const box = screen.getByTestId("cards-count");
      expect(box.textContent).toBe("Cards" + mockUsageData["cards"]);
    });
    test("cars count", async () => {
      render(<UserPage />);
      await waitFor(() => {
        expect(+screen.getByLabelText(/^cars count$/i).textContent)
          .toBe(mockUsageData["cars"])
      });
      const box = screen.getByTestId("cars-count");
      expect(box.textContent).toBe("Cars" + mockUsageData["cars"]);
    });
    test("fingerprints count", async () => {
      render(<UserPage />);
      await waitFor(() => {
        expect(+screen.getByLabelText(/^fingerprints count$/i).textContent)
          .toBe(mockUsageData["fingerprints"])
      });
      const box = screen.getByTestId("fingerprints-count");
      expect(box.textContent)
        .toBe("Fingerprints" + mockUsageData["fingerprints"]);
    });
    test("faceprints count", async () => {
      render(<UserPage />);
      await waitFor(() => {
        expect(+screen.getByLabelText(/^faceprints count$/i).textContent)
          .toBe(mockUsageData["faceprints"])
      });
      const box = screen.getByTestId("faceprints-count");
      expect(box.textContent)
        .toBe("Faceprints" + mockUsageData["faceprints"]);
    });
  })
  describe("Add user's Button", () => {
    test("Calls the OnClick handler", () => {
      const mockAddUser = jest.fn();
      render(<Button onClick={mockAddUser} />);
      fireEvent.click(screen.getByRole("button", /Add User/i));
      expect(mockAddUser).toHaveBeenCalled();
    })
    test("Should contains an add user button", () => {
      render(<UserPage />);
      const button = screen.getByText(/Add User/i);
      expect(button).toBeInTheDocument();
    });
  });
  describe("Display usage data", () => {
    describe("Data Card", () => {
      test("given [label = 'User'] displays a [FAIL]", async () => {
        const { container } = render(<DataCard label="" />)
        await waitFor(() => {
          expect(container.textContent).not.toBe("Loading...");
          expect(container.textContent).toBe("FAIL")
        })
      })
      test("given [label = ''] displays a [FAIL]", async () => {
        const { container } = render(<DataCard label="" />)
        await waitFor(() => {
          expect(container.textContent).not.toBe("Loading...");
          expect(container.textContent).toBe("FAIL")
        })
      })
      test("given [label = 'users'] displays [user count]", async () => {
        const { container } = render(<DataCard label="users" />)
        await waitFor(() => {
          expect(container.textContent).not.toBe("Loading...");
          expect(container.textContent).toBe("Users" + mockUsageData["users"])
        })
      })
    })
  })
  describe("User List", () => {
    test("should render table headers", () => {
      render(<UserList />)
      const table = screen.getByRole("table", { name: "User List" })
      const colHeaders = screen.getAllByRole("columnheader")
      expect(table).toBeInTheDocument()
      expect(['ID', 'Username', 'Department', 'Role', 'Auth Methods',
        'Status'])
        .toStrictEqual(colHeaders.map(cell => cell.textContent))
      expect(screen.getByRole("columnheader", { name: "Auth Methods" }))
        .toHaveAttribute("colspan", "" + authCount)
    })
    function rowOnUser(key, i) {
      const { user = {}, cells = [] } = this

      if (key === "role")
        expect(cells[i]).toHaveTextContent(user[key]["name"])
      else if (Array.isArray(user[key]) || user[key] == null) {
        const attr = key === "status" ? "4" : '' + !!user[key]?.length
        expect(cells[i])
          .toHaveAttribute('data-' + key, attr)
      }
    }
    test("should render the first row with the 1st user's data", async () => {
      render(<UserList />)
      let cells = [];
      let rows = [];
      await waitFor(() => {
        rows = screen.getAllByRole("row")
        expect(rows[1]).not.toBeUndefined();
      })
      cells = within(rows[1]).getAllByRole("cell")

      usersKeys.forEach(rowOnUser, { user: users[0], cells })
    })
    test("should render user's data on each row", async () => {
      render(<UserList />)
      let cells = [];
      let rows = [];
      await waitFor(() => {
        rows = screen.getAllByRole("row")
        for (let i = 0; i < users.length; i++) {
          expect(rows[i + 1]).not.toBeUndefined();
        }
      })
      rows.shift()
      for (let user of users) {
        cells = within(rows.shift()).getAllByRole("cell")

        usersKeys.forEach(rowOnUser, { user, cells })
      }
    })
    describe("When fetch fails", () => {
      beforeEach(() => {
        jest.spyOn(global, "fetch").mockImplementation(() => {
          return Promise.reject({ error: true })
        })
      })
      afterEach(() => {
        global.fetch.mockRestore()
      })
      test("displays an error message", async () => {
        const { container } = render(<UserList />)
        let table = await screen.findByRole("table", { name: "User List" })
        await screen.findByText("User List failed")
        expect(table).not.toBeInTheDocument()
        table = null;
        try {
          table = await screen.findByRole("table", { name: "User List" })
          expect(table).not.toBeInTheDocument()
        } catch (err) {
          expect(table).toBeNull()
        }
      })
    })
  })
  describe("useFetchedData Hook", () => {
    test("should return all cards", async () => {
      const { result } = renderHook(() => {
        return useFetchedData({ url: "/cards" })
      })

      await waitFor(() => expect(result.current.data).not.toBeUndefined())
      expect(result.current.data).toStrictEqual(cards)
    })
    test("should return undefined", async () => {
      let { result } = renderHook(() => {
        return useFetchedData()
      })

      await waitFor(() => expect(result.current.data).toBeUndefined())
    })
  })
  describe("Add user's Modal", () => {
    function getContent({ hidden } = { hidden: true }) {
      return [
        screen.getByLabelText(/Close/i),
        screen.getByRole('heading', { name: /^Create a new User$/i, hidden }),
        screen.getByRole('button', { name: /^Save And Exit$/i, hidden }),
        screen.getByRole('button', { name: /^Save And New$/i, hidden }),
      ]
    }

    test("Displays an add user button", () => {
      render(<AddUserModal />)
      expect(screen.getByRole("button", /Add User/i)).toBeInTheDocument()
    })
    test("Should keeps it content hidden", () => {
      render(<AddUserModal />)
      const content = getContent()

      expect(screen.getByLabelText("modal content"))
        .not.toBeVisible()
      content.forEach(elm => expect(elm).not.toBeVisible())
    })
    test("Opens when click on the button", () => {
      render(<AddUserModal />)
      const content = getContent()

      fireEvent.click(screen.getByRole("button", /Add user/i))
      expect(screen.getByLabelText("modal content")).toBeVisible()
      content.forEach(elm => expect(elm).toBeVisible())
    })
    test("Closes when click on X", () => {
      render(<AddUserModal />)
      const content = getContent()

      fireEvent.click(content[0])
      expect(screen.getByLabelText("modal content"))
        .not.toBeVisible()
      content.forEach(elm => expect(elm).not.toBeVisible())
    })
  })
})
