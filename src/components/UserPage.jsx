import '../sass/main.scss'
import { Table, Extractor } from "./";
import DataCard from "./DataCard";
import { Modal } from './Modal';
import { users } from './fixtures';
import { sortTable, asyncForEach, fetcher } from '../tools'
import { Widget } from './Widget';
import hands from './../icons/hands.svg';
import { useEffect, useRef } from 'react';

export default function UserPage(props) {
  const toolbarRef = useRef(null)
  const tableRef = useRef(null)
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
    },
    {
      path: "cards",
      dataAttr: "cards",
      render: data => (Array.isArray(data) && data.length)
    },
    {
      path: "faceprints",
      dataAttr: "faceprints",
      render: data => (Array.isArray(data) && data.length)
    },
    {
      path: "fingerprints",
      dataAttr: "fingerprints",
      render: data => (Array.isArray(data) && data.length)
    },
    {
      path: "blocked",
      dataAttr: "status"
    },
  ];
  const headers = [
    "ID",
    "Username",
    "Departement",
    "User Privilege",
    {
      title: "Auth Methods",
      attrs: { colSpan: 3 }
    },
    "Status"
  ];
  const tableProps = {
    options,
    schema,
    extractor: Extractor(schema)
  }
  const labels = [
    "users",
    "cards",
    "cars",
    "fingerprints",
    "faceprints"
  ]

  useEffect(() => {
    if (!tableRef.current) return
    const rows = tableRef.current.rows

    asyncForEach(rows, row => {
      for (let cell of row.cells) {
        if (+cell.dataset.cards === 1) {
          cell.innerHTML = '<i class="card-icon"></i>'
        }
        if (+cell.dataset.faceprints === 1) {
          cell.innerHTML = '<i class="face-print-icon"></i>'
        }
        if (+cell.dataset.fingerprints === 1) {
          cell.innerHTML = '<i class="finger-print-icon"></i>'
        }
        // console.log(cell.dataset.status)
        if (cell.dataset.status) {
          cell.innerHTML = `<div class="status__${cell.dataset.status}-icon"></div>`
        }
      }
    })
  })

  return (
    <section className="user-managment">
      <div className="user-managment__personnel">
        <h1 className="personnel__titel">Personnel</h1>
        <Usage labels={labels} fetcher={fetcher} />
      </div>

      <UserList >
        <ToolBar childProps={{ ref: toolbarRef }}>
          <Widget name="filter" />
          <Widget name="options" textOn={false} />
          <Widget
            name="search"
            type="InputSearchTable"
            textOn={false}
            attrs={{ className: 'search__input' }}
            options={{
              index: +options.sortByHeaders[0] + options.rowSelect,
              tableId: 'tableId',
              searchKey: 'username'
            }}
          />
        </ToolBar>
        <Modal hands={hands} nodePortalRef={toolbarRef} />
        <Table
          fetcher={() => users}
          {...tableProps}
          id="tableId"
          {...{ headers }}
          tRef={tableRef}
        />
      </UserList>
    </section>
  );
}

export const ToolBar = ({ children, childProps }) => {
  return <div className="user-list__top-bar" {...childProps}>
    {children}
  </div>

  const addUserModel = 
  <div className = "add-user__modal" style={{ display }}>
    <div className = "modal__content" aria-label="modal content">

      <div className="content__profile-picture">
        <div className = "profile-picture__img">
          <button className = "img__add-picture"/>
        </div>
      </div>


      <div className="content__user-info">
        <form className="user-info__form">
          <Input type="text" className="form__first-name" placeholder="First Name" name="firstname" />
          <Input type="text" className="form__laste-name" placeholder="Last Name" name="lastname" />
          <Input type="text" className="form__department" placeholder="Department" name="department" />
          <Input type="email" className="form__email" placeholder="Email" name="email" />
          <Select className="form__group" name="group">
            <option className="group__" >Group</option>
            <option className="group__" ></option>
            <option className="group__" ></option>
          </Select>
          <Select className="form__gender"  name="gender">
            <option className="gender__label" >Gender</option>
            <option value="male" className="gender__male" >Male</option>
            <option value="female" className="gender__female">Female</option>
          </Select>
          <Select className="form__acess-group" name="access-group">
            <option className="acess-group__label" >Acess group</option>
            <option value="Student" className="acess-group__student">Student</option>
            <option value="Security" className="acess-group__security">Security</option>
            <option value="Staff" className="acess-group__staff">Staff</option>
          </Select>
          <label className="form__period-label">Period</label>
          <Input className="form__period-start-date" type="date" placeholder="Start" name="start-date" />
          <Input className="form__period-end-date" type="date" placeholder="End" name="end-date" />
          <div className="form__card-id">
            <Input className="card-id__input" type="text" placeholder="Card ID" name="card-id" />
            <i class="card-id__icon"></i>
          </div>
          <Input className="form__pin" type="text" placeholder="PIN" name="pin" />
        </form>

        <div className="user-info__finger-print">
          <label className="finger-print__title" >Finger print</label>
          <div className = "finger-print__box">
            <div className="box__top-bar">
            <div className="top-bar__checkbox">
              <input id="top-bar__checkbox" className="checkbox__input" type="checkbox" name="print-card"/>
              <label for="top-bar__checkbox" className="checkbox__label"></label>
            </div>
              <Select className="top-bar__devices"  name="device">
                <option className="devices__label" >Device</option>
              </Select>
            </div>
            <img src={hands} className="box__hands" alt="hands" usemap="#image_map" />
          </div>            
        </div>

        <ToggleSwitch className="user-info__status"  name="active"/>
        <div className = "user-info__print-card">
          <label className="print-card__label">Card print</label>
          <div className="print-card__checkbox">
            <input id="print-card__checkbox" className="checkbox__input" type="checkbox" name="print-card"/>
            <label for="print-card__checkbox" className="checkbox__label"></label>
          </div>
        </div>
      </div>

      <div className="content__validation">
        <button className="validation__cancel" onClick={() => setDisplay('none')}>Cancel</button>
        <button className="validation__save" onClick={() => setDisplay('none')}>Save user</button>
        <div className = "validation__save-add">
          <div className="save-add__pop-up">
            <span className="pop-up__text">Save and add new user</span>
          </div>
          <i className = "save-add__add-icon"></i> 
        </div>
      </div>
    </div>
  </div>
  
  if (Array.isArray(users))
    usersContent =
    <table className="user-list__table">     
      <thead className="table__head">
        <tr className="head__column-name">
          <th className="column-name__id">
            <div className="id__checkbox">
                <input id={"id__checkbox"} className="checkbox__input" type="checkbox" name="print-card"/>
                <label for={"id__checkbox"} className="checkbox__label"></label>
            </div>
            ID
            <i className="id__flesh"/>
          </th>
          <th className="column-name__first-name">First Name<i className="first-name__flesh"/></th>
          <th className="column-name__last-name">Last Name</th>
          <th className="column-name__department">Department Name</th>
          <th className="column-name__user-privilege">User privilege</th>
          <th className="column-name__aut-method" colSpan={authCount}>Auth Methods</th>
          <th className="column-name__status">Status</th>
        </tr>
      </thead>
      <tbody className = "table__body">
        {users.map((user, i) => {
          return <tr  className = "body__row" key={i}>
            <td className = "row__id">
              <div className="id__checkbox">
                <input id={"id__checkbox-" + user.id} className="checkbox__input" type="checkbox" name="print-card"/>
                <label for={"id__checkbox-" + user.id} className="checkbox__label"></label>
              </div>
              {user.id}
            </td>
            <td className = "row__firstname">{user.username}</td>
            <td className = "row__firstname"></td>
            <td className = "row__department">{user.department}</td>
            <td className = "row__privilige">{user.role.name}</td>
            <td className = "row__auth">
              <i className = "auth__card" data-cards={!!user.cards?.length}/>
              <i className = "auth__finger-print" data-fingerprints={!!user.fingerprints?.length}/>
              <i className = "auth__face-print" data-faceprints={!!user.faceprints?.length}/>
              <i className = "auth__qr" data-qrcode={!!user.qrcode?.length}/>
            </td> 
            <td className = "row__status" data-status={4}><div className="status-icon"></div></td>
          </tr>
        })}
      </tbody>
    </table>
  return (<div className = "user-managment__user-list"> {titel} {tableTopBare} {addUserModel} {usersContent}</div>
            || <p>User List failed</p>)
}

export function UserList({ children }) {
  return <div className="user-managment__user-list">
    <h1 className="user-list__titel">User List</h1>
    {children}
  </div>
}

export function Usage(props) {
  const {
    labels = [],
    fetcher = () => void 0
  } = props

  const cards = labels.map((label, i) => {
    return <DataCard
      url={'/' + label + '/count'}
      label={label}
      fetcher={fetcher}
      key={i}
    />
  })

  return (
    <dl className="user-managment__personnel">
      <dt className = "personnel__titel">Personnel</dt>
      <dl className = "personnel__usage">
        <div className="usage__titel">
          <dt className = "titel__text">Usage</dt>
          <i className = "titel__icon"/>
        </div>
        
        <dl className = "usage__cards"> {labels.map((label, i) => <DataCard label={label} key={i} />)}</dl>
      </dl>
    </dl>
  )
}

