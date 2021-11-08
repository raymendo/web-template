import { InputSearchTable } from './'

export function Widget(props) {
  const {
    name,
    textOn = true,
    type = '',
    label,
    options = {},
    attrs = {},
    childProps = {}
  } = props
  const widgetsComponents = { InputSearchTable }

  const WidgetComponent = widgetsComponents[type]?.({ options, attrs })

  return (
    <div className={'widgets__' + name} aria-label={name} {...childProps}>
      {WidgetComponent}
      <i className={name + '__icon'} />
      {textOn && <span className={name + '__label'}>{label || name}</span>}
    </div>
  )
}
