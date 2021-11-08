import { useState, useEffect } from "react"
import { Input, Select, ToggleSwitch } from "."
import { createPortal } from "react-dom"
import { Widget } from "./Widget"

export function Modal(props) {
  const [display, setDisplay] = useState('none')
  const [portal, setPortal] = useState(null)
  const {
    hands = '',
    childProps = {},
    nodePortalRef = {}
  } = props
  let button

  useEffect(() => {
    if (nodePortalRef.current) {
      setPortal(nodePortalRef.current)
    }
  }, [nodePortalRef])

  if (portal) {
    button = createPortal(
      <Widget
        name="button"
        label="Add User"
        childProps={{
          onClick: () => setDisplay('grid')
        }}
      />,
      portal
    )
  }

  return <div className="add-user__modal" style={{ display }} {...childProps}>
    {button}
    <div className="modal__content" aria-label="modal content">

      <div className="content__profile-picture">
        <div className="profile-picture__img">
          <button className="img__add-picture" />
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
          <Select className="form__gender" name="gender">
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
          <Input className="form__card-id" type="text" placeholder="Card ID" name="card-id" />
          <Input className="form__pin" type="text" placeholder="PIN" name="pin" />
        </form>

        <div className="user-info__finger-print">
          <label className="finger-print__title" >Finger print</label>
          <div className="finger-print__box">
            <div className="box__top-bar">
              <input className="top-bar__fingers-checkbox" type="checkbox" />
              <Select className="widgets__devices" name="device">
                <option className="devices__label" >Device</option>
              </Select>
            </div>
            <img src={hands} className="box__hands" alt="hands" />
          </div>
        </div>

        <ToggleSwitch className="user-info__status" name="active" />
        <div className="user-info__print-card">
          <label className="print-card__label">Card print</label>
          <Input className="print-card__checkbox" type="checkbox" name="print-card" />
        </div>
      </div>



      <div className="content__validation">
        <button className="validation__cancel" onClick={() => setDisplay('none')}>Cancel</button>
        <button className="validation__save" onClick={() => setDisplay('none')}>Save user</button>
        <div className="validation__save-add">
          <div className="save-add__pop-up">
            <span className="pop-up__text">Save and add new user</span>
          </div>
          <i className="save-add__add-icon"></i>
        </div>
      </div>
    </div>
  </div>
}

