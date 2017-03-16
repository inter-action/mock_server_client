import * as React from "react";
import { axios, pub } from "../utils"
import { Input, Select, Table, Button, MessageBox, Dialog, Breadcrumb } from "element-react";
import { ValidateInput } from "../components/index";
import { Link, } from "react-router-dom";


import "./common.scss"
import "./app-list.scss"

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
            <Link className="action" to={`/apps/${rowdata._id}`}>详情</Link>
          </span>
        )
      }
    }
  ]
}

const onlyChars = (e) => {
  return /^[a-z_-]+$/i.test(e);
}

const request = axios.get();
export class AppList extends React.Component<any, any>{
  _serverData: any;

  constructor(props) {
    super(props);
    this._serverData = props.serverData;
    this.state = {
      textData: { value: "", isvalid: false }
    }
  }

  newApp() {
    this.setState({ dialogVisible: true })
  }

  saveNewApp() {
    if (!this.state.textData.isvalid) {
      return;
    }

    request.post("/apps", { name: this.state.textData.value }).then(resp => {
      pub.success("操作成功")
      this.toggleDialog(false)
      this.load()
    }).catch(pub.handleAjaxRequestError)
  }

  toggleDialog(dialogVisible: boolean) {
    this.setState({ dialogVisible })
  }

  componentDidMount() {
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
    const { data, textData } = this.state;
    if (!data) return null;

    return (
      <div className="page page-app-list">
        <Breadcrumb separator="/">
          <Breadcrumb.Item>首页</Breadcrumb.Item>
        </Breadcrumb>
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
          onCancel={() => this.toggleDialog(false)}
        >
          <Dialog.Body>
            <div>
              <div>
                <label htmlFor="name">
                  名称(<span className="text-sm">格式: 字符_-</span>):
                </label>
                <ValidateInput id="name" data={textData} onChange={data => this.setState({ textData: data })} validator={onlyChars}></ValidateInput>
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.toggleDialog(false)}>取 消</Button>
            <Button type="primary" onClick={_ => this.saveNewApp()} disabled={!textData.isvalid}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    )
  }
}
