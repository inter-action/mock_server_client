import * as React from "react";
import { axios, pub } from "../utils"
import { Input, Select, Table, Button, MessageBox, Dialog, Breadcrumb } from "element-react";
import { ValidateInput } from "../components/index";
import { Link, } from "react-router-dom";

import "./common.scss"
import "./app-detail.scss"

function getColumn(ctx) {
  return [
    {
      label: "method",
      prop: "method",
    },
    {
      label: "routePath",
      prop: "routePath",
    },
    {
      label: "fullRoutePath",
      prop: "fullRoutePath",
    },
    {
      label: "query",
      prop: "query",
    },
    {
      label: "body",
      prop: "body",
    },
    {
      label: "response",
      prop: "response",
    },

    {
      label: "responseType",
      prop: "responseType",
    },
    {
      label: "操作",
      prop: "action",
      render(rowdata) {
        return (
          <span>
            <Link className="action" to={`/cases/${rowdata._id}?appid=${ctx._id}`}>详情</Link>
            <a className="action" href="javascript:void(0)" onClick={_ => ctx.delete(rowdata._id)}>删除</a>
          </span>
        )
      }
    }
  ]
}

const request = axios.get();
export class AppDetail extends React.Component<any, any>{
  _id: any;
  _serverData: any;

  constructor(props) {
    super(props);
    this._serverData = props.serverData;
    this._id = this.props.match.params.id;
    if (!this._id) throw new Error("appid is required")

    this.state = {
    }
  }


  delete(id) {
    MessageBox.confirm("确认删除此条数据", "提示", {
      type: "warning"
    }).then(() => {
      request.delete(`/apps/${this._id}`).then(resp => {
        pub.success("操作成功")
        if (history.length !== 0) {
          history.go(-1)
        } else {
          setTimeout(_ => location.href = "/", 1000)
        }
      }).catch(pub.handleAjaxRequestError)
    }).catch(() => {
      //cancel, do nothing, 
    });
  }


  componentDidMount() {
    this.load();
  }

  load() {
    request.get(`/apps/${this._id}`).then(resp => {
      this.setState({ data: resp.data })
    }).catch(pub.handleAjaxRequestError)
  }

  render() {
    const { data, textData } = this.state;
    if (!data) return null;

    return (
      <div className="page page-app-detail">
        <Breadcrumb separator="/">
          <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>APP 详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className="overview">
          <ul>
            <li><label>名称: </label><span>{data.name}</span></li>
          </ul>
        </div>
        <div className="action-panel">
          <Link to={`/cases?appid=${this._id}`}><Button>创建 Case</Button></Link>
          <Button onClick={_ => this.delete(this._id)}>删除</Button>
        </div>
        <div className="list-body">
          <div>
            <h4 className="sub-title">Case 列表</h4>
          </div>
          <Table
            style={{ width: "100%" }}
            columns={getColumn(this)}
            data={data.cases}
            stripe={true}
          />
        </div>
      </div>
    )
  }
}
