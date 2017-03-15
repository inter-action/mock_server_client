import * as React from "react";
import { axios, pub } from "../utils"
import { Input, Select, Table, Button, MessageBox, Dialog } from "element-react";

function getColumn(ctx) {
  return [
    {
      label: "APP",
      prop: "app",
    },
    {
      label: "操作",
      prop: "action",
      render(rowdata) {
        return (
          <span>
            <Button type="text" size="small">详情</Button>
          </span>
        )
      }
    }
  ]
}


const request = axios.get();
export class AppList extends React.Component<any, any>{
  _serverData: any;

  constructor(props) {
    super(props);
    this._serverData = props.serverData;
    this.state = {}
  }

  newApp() {
    this.setState({ dialogVisible: true })
  }

  componentWillMount() {
    this.load();
  }

  load() {
    request.get("/apps").then(resp => {
      this.setState({ data: resp.data })
    }).catch(pub.handleAjaxRequestError)
  }

  transdata(data) {
    return data.map(e => {
      return {
        app: e.name,
        _id: e._id
      }
    })
  }

  render() {
    const { data } = this.state;
    if (!data) return null;

    return (
      <div>
        <div className="action-panel">
          <Button onClick={_ => this.newApp()}>创建APP</Button>
        </div>
        <div className="list-body">
          <Table
            style={{ width: "100%" }}
            columns={getColumn(this)}
            data={this.transdata(data)}
            stripe={true}
          />
        </div>

        <Dialog
          title="创建APP"
          visible={this.state.dialogVisible}
          onCancel={() => this.setState({ dialogVisible: false })}
        >
          <Dialog.Body>
            <div>some shit</div>
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
}
