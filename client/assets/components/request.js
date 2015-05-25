angular.module("request", []).service('requestService', function ($http) {
  var env = "remote"; // local 或 remote ，其中 remote 是通过在 grunt connect 任务中配置 proxy 代理实现的
  var localPath = "/json/";
  // doGetRequest 暂时用来调用本地数据
  var _doGetRequest = function (url) {
    return $http.get(url)
  }
  var _doPostRequest = function (url, data) {
    // 现在的后端接口一律都是 post
    if (!data) {
      data = {}
    }
    /*else{
      data = JSON.stringify(data)
    }*/
    //console.log( data);
    return $http.post(url, data);
  }
  var _parseGetRequestParams = function (params) {
    var _path = '';
    if (!angular.isObject(params)) {
      console.error("setGetRequestParams: params should be an object type !")
      return;
    }
    for (var name in params) {
      if (params.hasOwnProperty(name)) {
        if (_path == '') {
          _path = "?" + name + "=" + params[name];
        } else {
          _path += "&" + name + "=" + params[name];
        }
      }
    }
    return _path;
  }
  /*--------------------------
   $ 通用
   --------------------------*/
  this.getNewId = function () {
    if (env == 'local') {
      //return _doGetRequest(localPath + 'home.sidebar.json');
    } else {
      return _doPostRequest('/api/commons/generatorDataid.do');
    }
  }

  // 文件（附件）接口
  this.deleteFile = function(id){
    if (env == 'local') {
      //return _doGetRequest(localPath + 'home.sidebar.json');
    } else {
      return _doPostRequest('/api/files/'+ id +'/delete.do');
    }
  }
  this.queryImages = function(data){
    if (env == 'local') {
      //return _doGetRequest(localPath + 'home.sidebar.json');
    } else {
      return _doPostRequest('/api/files/querythumbnail.do', data);
    }
  }
  this.homeSidebarItems = function () {
    // 目前没有 remote 版本，所以固定用 localPath，而且是 get 请求
    return _doGetRequest(localPath + 'home.sidebar.json');
  }
  this.myappBusiItems = function () {
    return _doGetRequest(localPath + 'myapp.busi.item.json');
  }
  this.myappSaItems = function () {
    return _doGetRequest(localPath + 'myapp.sa.item.json');
  }
  this.overrunSidebarItems = function () {
    return _doGetRequest(localPath + 'overrun.menu.json');
  }
  /*现场超限待处理接口*/
  this.overrunTodoItems = function (data) {
    if (env == 'local') {
      return _doGetRequest(localPath + 'overrun.todo.item.json');
    } else {
      return _doPostRequest('/api/cxcfs/' + data.currentPage + '/' + data.pageSize + '/queryPage.do');
    }
  }
  this.overrunTodoItemDetail = function (data) {
    if (env == 'local') {
      return _doGetRequest(localPath + 'overrun.itemDetail.json');
    } else {
      return _doPostRequest('/api/cxcfs/' + data.aj_id + '/query.do');
    }
  }
  this.overrunTodoItemSave = function (data) {
    return _doPostRequest('/api/cxcfs/insert.do', data);
  }
  this.overrunTodoItemUpdate = function (data) {
    return _doPostRequest('/api/cxcfs/update.do', data);
  }
  // 超限公共接口
  this.overrunItemsDelete = function (data) {
    return _doPostRequest('/api/cxcfs/delete.do', data);
  }
  /* 
   现场超限已完结接口
   */
  this.overrunDoneItems = function (data) {
    return _doGetRequest(localPath + 'overrun.done.item.json');
    /*
     if (env == 'local') {
     return _doGetRequest(localPath + 'overrun.done.item.json');
     } else {
     return _doPostRequest('/api/cxcfs/' + data.aj_id + '/query.do');
     }*/
  }
  this.overrunDoneItemDetail = function (data) {
    if (env == 'local') {
      return _doGetRequest(localPath + 'overrun.itemDetail.json');
    } else {
      return _doPostRequest('/api/cxcfs/' + data.aj_id + '/query.do');
      // 适应 get 请求，可以局部微调
      //return doPostRequest(remotePath + '/app/xccfs/query.do' + _parseGetRequestParams(data));
    }
  }
  // 系统管理
  this.adminSidebarItems = function () {
    return _doGetRequest(localPath + 'admin.menu.json');
  }


  // 以下待整理
  this.userDetail = function (userno) {
    return _doGetRequest('userDetail.json?userno=' + userno);
  }
  this.userList = function () {
    return _doGetRequest('userList.json');
  }
  this.appRoleList = function () {
    return _doGetRequest('appRoleList.json');
  }
  this.userRoleList = function (userno) {
    return _doGetRequest('userRoleList.json?userno=' + userno);
  }
  this.saveUser = function (url, data) {
    return _doPostRequest(url, data);
  }
  this.deleteUsers = function (url, data) {
    return _doPostRequest(url, data);
  }
  this.privilegeMenuList = function () {
    return _doGetRequest('privilegeMenu.json');
  }
  this.faWenMenuList = function () {
    return _doGetRequest('faWen.menu.json');
  }
  this.roleDetail = function () {

  }
  this.deptList = function () {
    return _doGetRequest('deptList.json');
  }
  this.menuList = function () {
    return _doGetRequest('voteMenuList.json');
  }
  this.faWenList = function () {
    return _doGetRequest('faWen.niGao.json');
  }

})

