

class PubSub {
  _hub: {};

  constructor() {
    this._hub = {};
  }

  reg(name, callback) {
    if (this._hub[name] == null) {
      this._hub[name] = [];
    }

    var idx = this._hub[name].indexOf(callback);
    if (idx !== -1) {
      return;
    }

    this._hub[name].push(callback);

    return () => {
      this.unreg(name, callback)
    }
  }

  unreg(name, callback) {
    if (this._hub[name] == null) return;

    var idx = this._hub[name].indexOf(callback);
    if (idx === -1) {
      return;
    }

    this._hub[name].splice(idx, 1);

  }

  pub(name, ...args) {
    if (this._hub[name] != null && this._hub[name].length !== 0) {
      for (var i = 0; i < this._hub[name].length; i++) {
        var cb = this._hub[name][i];
        cb.apply({}, args);
      }
    }
  }
}

const pub = new PubSub();
export function get() {
  return pub;
}

type MSG_TYPE = null | "success" | "error"
type MSG = {
  message: string,
  type: MSG_TYPE,
  title: string
}
export function notify(msg: MSG) {
  pub.pub("/notification", msg);
}
export function info(message: string, title?: string) {
  notify({ message, title, type: null })
}

export function error(message: string, title?: string) {
  notify({ message, title, type: "error" })
}
export function success(message: string, title?: string) {
  notify({ message, title, type: "success" })
}

export function handleAjaxRequestError(e) {
  if (e && e.message) {
    error(e.message)
  } else {
    error("数据请求失败，请稍后再试")
  }
}