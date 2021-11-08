import PropTypes from 'prop-types';
import _ from "lodash"
import { useSafeAsync } from '../hooks';
import { searchTable } from '../tools';
import {
  useEffect,
  createContext,
  useContext,
  useState,
  useRef,
  useReducer
} from 'react'

const OptionContext = createContext({})

export const ToggleSwitch = (props) => {
  const { className, label } = props

  return (
    <div className={className}>
      <span className="status__state">Status Active</span>
      <div className="status__switch">
        <input id="switch" type="checkbox" />
        <label htmlFor="switch">Toggle</label>
      </div>

    </div>

  )
}

export function Button({ children, ...props }) {
  return <button {...props} >{children}</button>
}

export const Select = (props) => {
  const {
    label = '',
    name = '',
    children,
    ...otherProps
  } = props

  return (
    <>
      {label && <label>{label}</label>}
      <select name={name} {...otherProps}>
        {children}
      </select>
    </>
  )
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
}

export const Input = (props) => {
  const {
    label,
    name = '',
    type,
    childProps = {},
    ...otherProps
  } = props

  return (
    <label>
      {label && <span>{label}</span>}
      <input type={type} name={name} {...childProps} {...otherProps} />
    </label>
  )
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

// test this
// elm didnt change
export const Extractor = schema =>
  ctx => {
    const result = schema.map(function (elm) {
      if (typeof elm === 'string') {
        return _.get(this, elm)
      }
      const data = _.get(this, elm.path)
      const res = { ...elm }

      if (typeof elm.dataAttr === 'string') {
        res['attrs'] = {
          ['data-' + elm.dataAttr]: (elm.render?.(data) ?? data)
        }
        return res
      }
      return data
    }, ctx)

    return result
  }

export const InputSearchTable = (props) => {
  const {
    options = {},
    attrs = {}
  } = props

  const {
    tableId = '',
    index,
    searchKey = '',
    action = searchTable
  } = options

  return (
    <input
      type="text"
      placeholder={`Search for ${searchKey}..`}
      onKeyUp={(ev) => {
        action(ev.target, document.getElementById(tableId), index)
      }}
      {...attrs}
    />
  )
}

function TRow({ content, ...props }) {
  const { rowSelect } = useContext(OptionContext)
  const [selected, setSelected] = useState(false)

  const tdList = content?.map((elm, i) => {
    if (typeof elm === 'string') {
      return <td key={i}>{elm}</td>
    }

    if (elm.dataAttr) {
      return <td key={i} {...elm.attrs}></td>
    }
    return elm
  })

  return <tr {...props} aria-selected={selected}>
    {rowSelect && <td>
      <input
        type="checkbox"
        value={props['data-id']}
        onChange={() => setSelected(prev => !prev)}
      />
    </td>}
    {tdList}
  </tr>
}

export function Thead({ headers }) {
  const {
    rowSelect,
    selOpts,
    sortByHeaders,
    sort
  } = useContext(OptionContext)
  let id = 0
  let content = []

  useEffect(() => {
    if (typeof sort !== 'function') return

    let filters = []

    const handler = function () {
      const dir = sort(+this.dataset.sortId + rowSelect)
      this.setAttribute('aria-sort', dir)
    }

    filters = document.querySelectorAll('[aria-sort]')

    filters.forEach(filter => filter.addEventListener('click', handler))

    return () => {
      filters.forEach(filter => {
        filter.removeEventListener('click', handler)
      })
    }
  }, [sort, rowSelect])

  id = _.uniqueId('row_')
  content = headers?.map((string, i) => {
    if (!string) return null
    const opts = string
    if (typeof string !== "string") {
      string = string.title
    }
    let elm

    if (sortByHeaders?.includes(i)) {
      elm = <span
        aria-sort='none'
        data-sort-id={i}
      >
        {string}
      </span>
    }

    return (
      <th key={i} {...opts.attrs}>
        {elm || string}
      </th>
    )
  })

  return <thead className="table__head">
    <tr data-id={id} className="head__column-name">
      {rowSelect && <th>
        <input
          type="checkbox"
          value={id}
          onChange={
            ev => selOpts.setPropagate({ checked: ev.target.checked })
          }
        />
      </th>}
      {content}
    </tr>
  </thead>
}

export function Tbody({ content, extractor }) {
  const { index } = useContext(OptionContext)

  const data = content?.map(elm => {
    if (typeof extractor === 'function') {
      elm = extractor(elm)
    }
    return elm
  })

  const rows = data?.map((row, i) => {
    const id = typeof row[index] === 'string' ?
      row[index] : _.uniqueId('row_')

    return <TRow content={row} key={i} data-id={id} />
  })


  return <tbody className="table__body">
    {rows}
  </tbody>
}

export function Table(props) {
  const {
    fetcher,
    extractor,
    schema = [],
    options = {},
    children,
    id,
    headers = [],
    tRef = {}
  } = props

  const [
    safeFetcher,
    data,
    loading,
    error
  ] = useSafeAsync(
    {
      asyncFunc: fetcher,
      initialData: []
    }
  )

  const [propagateState, setPropagate] = useReducer(
    (state = {}, action = {}) => {
      return { ...state, ...action, propagate: true }
    }, { propagate: false });

  const tableRef = useRef(null)
  const table = tableRef.current
  const sortTable = options.sortTable

  let caption, header, body, search
  let arr = children
  const types = ['caption', 'thead', 'tbody']

  if (!Array.isArray(children) && children) {
    arr = [children]
  }

  options['selOpts'] = { setPropagate }
  if (typeof sortTable === 'function' && table) {
    options['sort'] = sortTable(table)
  }

  caption = _.find(arr, { type: types[0] })
  header = _.find(arr, { type: types[1] })
  body = _.find(arr, { type: types[2] })

  arr = _.filter(arr, elm => !types.includes(elm.type))

  body = body || <Tbody content={data} {...{ extractor }} />
  header = header || <Thead headers={headers || schema.map(elm => elm.title)} />

  useEffect(() => {
    safeFetcher()
  }, [safeFetcher])

  useEffect(() => tRef.current = tableRef.current)

  useEffect(() => {
    if (!propagateState.propagate) return
    const boxes = table?.querySelectorAll('td input[type=checkbox]')
    boxes?.forEach(box => {
      if (box.checked !== propagateState.checked) {
        box.click()
      }
    });
  }, [propagateState, table])

  return <OptionContext.Provider value={options}>
    <table
      aria-busy={loading}
      ref={tableRef}
      id={id}
      aria-errormessage={error ? 'error' : ''}
      className="user-list__table"
    >
      {search}
      {caption}
      {header}
      {body}
      {arr}
    </table >
  </OptionContext.Provider>
}
