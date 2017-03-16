import * as url from "url";

import * as React from "react";
import { axios, pub } from "../utils"
import { Input, Select, Table, Button, MessageBox, Dialog, Breadcrumb } from "element-react";
import { ValidateInput } from "../components/index";
import { Link, } from "react-router-dom";


import "./common.scss"
import "./case_detail.scss";

const validators = {
  path(v) {
    return /^[a-z-_\/]+$/i.test(v)
  },
  isJSON(v) {
    try {
      JSON.parse(v)
    } catch (e) {
      return false
    }
    return true
  },
  nonEmpty(v) {
    if (!v || !v.trim()) return false;
    else return true
  }
}

const methodOptions = [{
  value: "get",
  label: "get"
}, {
  value: "post",
  label: "post"
}, {
  value: "put",
  label: "put"
}, {
  value: "delete",
  label: "delete"
}];

const responseTypeOptions = [{
  value: "json",
  label: "json"
}, {
  value: "text",
  label: "text"
}]


const request = axios.get();
export class CaseDetail extends React.Component<any, any>{
  _appid: any;
  _backup: any;
  _id: any;
  _serverData: any;

  constructor(props) {
    super(props);
    this._serverData = props.serverData;
    let urlObj = url.parse(location.href, true);
    if (!urlObj.query.appid) throw new Error("appid is required");
    this._appid = urlObj.query.appid;
    this._id = this.props.match.params.id;

    this.state = {
      method: "get",
      routePath: { value: "", isvalid: false },
      query: { value: "{}", isvalid: true },
      body: { value: "{}", isvalid: true },
      responseType: "json",
      response: { value: "{}", isvalid: true },
      isEdit: true
    }
  }

  componentDidMount() {
    if (this._id) {
      this.load()
    }
  }

  delete(id) {
    MessageBox.confirm("确认删除此条数据", "提示", {
      type: "warning"
    }).then(() => {
      request.delete(`/case/${this._id}`).then(resp => {
        pub.success("操作成功")

        if (history.length) {
          history.go(-1)
        } else {
          setTimeout(_ => location.href = "/", 1000)
        }
      }).catch(pub.handleAjaxRequestError)
    }).catch(() => {
      //cancel, do nothing, 
    });
  }


  convertFrom(dataIn) {
    return {
      method: dataIn.method || "get",
      routePath: { value: dataIn.routePath, isvalid: true },
      query: { value: dataIn.query, isvalid: true },
      body: { value: dataIn.body, isvalid: true },
      responseType: "json",
      response: { value: dataIn.response, isvalid: true }
    }
  };

  convertBack(fe) {
    return {
      method: fe.method,
      routePath: fe.routePath.value,
      query: fe.query.value,
      body: fe.body.value,
      responseType: fe.responseType.value,
      response: fe.response.value
    }
  }

  load() {
    request.get(`/cases/${this._id}`).then(resp => {
      this._backup = resp.data;
      this._appid = resp.data.app._id;
      this.setState(Object.assign(this.convertFrom(resp.data), { isEdit: false }));
    }).catch(pub.handleAjaxRequestError)
  }

  save() {
    if (document.querySelectorAll(".invalid").length !== 0) return;

    if (!this._id) {
      let data: any = this.convertBack(this.state);
      data.appid = this._appid;
      request.post(`/cases`, data).then(resp => {
        pub.success("操作成功");
        this._id = resp.data._id;
        this._backup = resp.data;
        this.setState(Object.assign(this.convertFrom(this._backup), { isEdit: false }))//refresh view
      }).catch(pub.handleAjaxRequestError)
    } else {
      request.put(`/cases/${this._id}`, this.convertBack(this.state)).then(resp => {
        pub.success("操作成功");
        this.setState({ isEdit: false })
      }).catch(pub.handleAjaxRequestError)
    }
  }

  cancel() {
    if (this._id) {
      this.setState(Object.assign(this.convertFrom(this._backup), { isEdit: false }))
    } else {// creation
      history.go(-1)
    }
  }

  toEdit() {
    this.setState({ isEdit: true })
  }

  render() {
    const { method, routePath, query, body, responseType, response, isEdit } = this.state;

    const editSection = () => {
      if (this._id) {
        if (isEdit) {
          return <div className="actions"><Button onClick={_ => this.cancel()}>取消</Button></div>
        } else {
          return <div className="actions"><Button onClick={_ => this.toEdit()}>编辑</Button><Button onClick={_ => this.delete(this._id)}>删除</Button></div>
        }
      } else {
        return null;
      }
    }

    const renderActions = () => {
      if ((this._id && isEdit) || !this._id) {

        return (
          <div className="field-item">
            <div className="actions">
              <Button onClick={_ => this.cancel()}>取消</Button>
              <Button onClick={_ => this.save()} type="primary">保存</Button>
            </div>
          </div>
        )
      }

      return null
    }

    const renderPaylod = () => {
      if (method == "get" || method == "delete") {
        return (

          <div className="field-item" >
            <div>
              <label>query: </label>
              <ValidateInput
                type="textarea"
                autosize={{ minRows: 5, maxRows: 8 }}
                data={query} onChange={d => this.setState({ query: d })} validator={validators.isJSON} disabled={!isEdit}></ValidateInput>
            </div>
            <div className="tips">
              get 请求参数: JSON 格式, 实际mock接口不区分JSON亦或者Form, 空JSON ·{}· match 所有对应route
            </div>
          </div>
        )
      } else if (method == "post" || method == "put") {
        return (
          <div className="field-item">
            <div>
              <label>body: </label>
              <ValidateInput
                type="textarea"
                autosize={{ minRows: 5, maxRows: 8 }}
                data={body} onChange={d => this.setState({ body: d })} validator={validators.isJSON} disabled={!isEdit}></ValidateInput>
            </div>
            <div className="tips">
              post 请求参数: JSON 格式, 实际mock接口不区分JSON亦或者Form,  空JSON ·{}· match 所有对应route
            </div>
          </div>
        )
      }
    }

    const renderRoutePathTips = () => {
      let appname = this._backup ? this._backup.app.name : "<app_name>"
      return `/_m/${appname}/${routePath.value}`
    }

    const pageTitle = this._id ? "Case Detail" : "创建 Case"

    return (
      <div className="page page-case-detail">
        <Breadcrumb separator="/">
          <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/apps/${this._appid}`}>APP 详情</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="field-item">
          {editSection()}
        </div>
        <div>
          <div className="field-item">
            <div>
              <label htmlFor="">method:</label>
              <Select onChange={v => { this.setState({ method: v }) }} id="interface" value={this.state.method} disabled={!isEdit}>
                {
                  methodOptions.map(el => (
                    <Select.Option key={el.value} label={el.label} value={el.value} />
                  ))
                }
              </Select>
            </div>
          </div>
          <div className="field-item">
            <div>
              <label>routePath: </label>
              <ValidateInput data={routePath} onChange={d => this.setState({ routePath: d })} validator={validators.path} disabled={!isEdit}></ValidateInput>
            </div>
            <div className="tips">
              完整路径: {renderRoutePathTips()}
            </div>
          </div>
          {renderPaylod()}
          <div className="field-item">
            <div>
              <label>responseType: </label>
              <Select onChange={v => { this.setState({ responseType: v }) }} id="interface" value={responseType} disabled={!isEdit}>
                {
                  responseTypeOptions.map(el => (
                    <Select.Option key={el.value} label={el.label} value={el.value} />
                  ))
                }
              </Select>
            </div>
          </div>
          <div className="field-item">
            <div>
              <label>response: </label>
              <ValidateInput
                disabled={!isEdit}
                data={response}
                type="textarea"
                autosize={{ minRows: 5, maxRows: 8 }}
                onChange={d => this.setState({ response: d })} validator={v => {
                  return responseType === "json" ? validators.isJSON(v) : validators.nonEmpty(v)
                }}></ValidateInput>
            </div>
          </div>
          {renderActions()}
        </div>
      </div>
    )
  }
}

