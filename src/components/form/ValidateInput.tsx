import * as React from "react";
import * as classname from "classnames";
import * as ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Input } from "element-react";

import "./valiate_input.scss";

type Data = { isvalid: boolean, value: string }
interface Props {
  validator?: (value: string) => boolean
  data: Data,
  onChange?: (data: Data) => void,
  [other: string]: any
}

export class ValidateInput extends React.Component<Props, {}> {
  static get defaultProps() {
    return {
      validator: () => true
    }
  }

  onChange(value) {
    return this.props.onChange({
      isvalid: this.props.validator(value),
      value,
    })
  }

  render() {
    const { validator, data, onChange, className, ...others } = this.props;
    return (
      <Input {...others} placeholder="搜索"
        className={classname(className, { invalid: !data.isvalid })}
        value={data.value}
        onChange={e => this.onChange(e.target.value)}
        onFocus={e => this.onChange(e.target.value)}
      />
    )
  }
}
