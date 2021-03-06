angular.module('app.overrun-admin').controller('OverrunAdminItemEditCtrl',
  function ($scope, $state, sliderService, $modalInstance, $modal, requestService, item, itemIsNew,
            ngToast, $anchorScroll, $location, $injector, forfeit, anchorSmoothScroll, Upload, carService,
            util, myToast, $rootScope) {

    /*
     参照 overrun ，但删除了无关的代码
     */

    /*
     初始化
     下拉列表
     精度限制
     车牌
     日期设置
     罚金计算
     证件获取
     证件上传
     证件删除
     页内导航
     手动验证
     保存
     常用信息（带回历史）
     */

    //调试帮助：区分 $scope 上的 item 与 普通值


    /*--------------------------
     $ 初始化
     --------------------------*/
    var path = '../apps/overrun-admin/partials/';
    $scope.item = item;
    var dateFormat = 'YYYY-MM-DD HH:mm';


    // 显示模块的内容
    /*$rootScope.$on("modal.content.show", function(){
     $scope.modal = {contentShow: true};
     })
     */

    /*--------------------------
     $ 下拉列表
     --------------------------*/
    /* 超限类型与标签变换 */
    $scope.overrunTypes = [
      {
        zz_label: '总重（吨）',
        cz_label: '超重（吨）',
        // name 是超限类型存于数据库
        name: '超重'
      },
      {
        zz_label: '总长（米）',
        cz_label: '超长（米）',
        name: '超长'
      }, {
        zz_label: '总宽（米）',
        cz_label: '超宽（米）',
        name: '超宽'
      }, {
        zz_label: '总高（米）',
        cz_label: '超高（米）',
        name: '超高'
      }, {
        zz_label: '集装箱总高（米）',
        cz_label: '集装箱超高（米）',
        name: '集装箱超高'
      }
    ];
    $scope.unloadTypes = [
      {name: '可卸载'},
      {
        name: '不可卸载'
      }
    ];
    $scope.genderTypes = [
      {name: '男'},
      {
        name: '女'
      }
    ];
    // 设置表单变换的通用字段 总量/超量标签
    $scope.setOverrunType = function (type) {
      $scope.selectedOverrunType = type; // 前端内部使用
      $scope.item.cj_cxlx = type.name;  // name 用于超限类型
      // 更改总量/超量标签
      $scope.zz_label = type.zz_label; // 仅是标签
      $scope.cz_label = type.cz_label;
      // 更换类型时重置超量和罚金
      $scope.item.aj_fk = '';
      $scope.item.cj_zz = '';
      $scope.item.cj_cz = '';
      $scope.item.fj_zz = '';
      $scope.item.fj_cz = '';
    };
    $scope.setUnloadType = function (type) {
      $scope.selectedUnloadType = type;
      $scope.item.cj_kfxz = type.name;
    };
    $scope.setGenderTypes = function (type) {
      $scope.selectedGenderTypes = type;
      $scope.item.jsy_xb = type.name;
    };
    // 下拉列表初始化
    if (itemIsNew) {
      $scope.setOverrunType($scope.overrunTypes[0]);
      $scope.setUnloadType($scope.unloadTypes[0]);
      $scope.setGenderTypes($scope.genderTypes[0]);
    } else {
      $scope.setUnloadType(_matchTypes($scope.unloadTypes, $scope.item.cj_kfxz));
      $scope.setGenderTypes(_matchTypes($scope.genderTypes, $scope.item.jsy_xb));
      // 由于 setOverrunType 会重置超值，所以单独写
      var overrunType = _matchTypes($scope.overrunTypes, $scope.item.cj_cxlx)
      $scope.selectedOverrunType = overrunType;
      $scope.zz_label = overrunType.zz_label;
      $scope.cz_label = overrunType.cz_label;
    }


    function _matchTypes(types, name) {
      if (!name) {
        return types[0]
      }
      return $scope._(types).find(function (type) {
        return type.name == name;
      });
    }

    /*--------------------------
     $ 精度限制
     --------------------------*/
    $scope.precisionLimit = function (e, fieldname, precision) {
      var elem = $(e.target);
      var oldVal = (+elem.val()), newVal;
      if (!oldVal) {
        return;
      }
      var count = util.countDecimals(oldVal)
      // 1）超限精度 2）其他参数指定的精度
      if (!precision) {
        precision = _getOvertypePrecision();
      }
      if (count > precision) {
        newVal = oldVal.toFixed(precision)
        elem.val(newVal)
        $scope.item[fieldname] = newVal;
      }
    }
    // 仅是超限精度
    function _getOvertypePrecision() {
      if ($scope.selectedOverrunType.name == '超重') {
        return 3;
      } else {
        return 2;
      }
    }


    /*--------------------------
     $ 车牌
     --------------------------*/
    // 历史带回
    $scope.cpSelected = function (selected) {
      if (selected) {
        $scope.item.cj_cp = selected.originalObject.cj_cp;
        $scope.item.cj_zs = selected.originalObject.cj_zs;
        $scope.item.cl_gc = selected.originalObject.cl_gc;
        $scope.item.cl_hdzzl = selected.originalObject.cl_hdzzl;
        $scope.item.cl_zbzl = selected.originalObject.cl_zbzl;
        $scope.item.cl_cjd = selected.originalObject.cl_cjd;
        $scope.item.cl_lx = selected.originalObject.cl_lx;
        $scope.item.cl_syr = selected.originalObject.cl_syr;
        $scope.item.cl_dh = selected.originalObject.cl_dh;
        $scope.item.cl_yyz = selected.originalObject.cl_yyz;
        $scope.item.cl_zz = selected.originalObject.cl_zz;
        $scope.item.jsy_xm = selected.originalObject.jsy_xm;
        $scope.item.jsy_xb = selected.originalObject.jsy_xb;
        $scope.item.jsy_zh = selected.originalObject.jsy_zh;
        $scope.item.jsy_cy = selected.originalObject.jsy_cy;
        $scope.item.jsy_dh = selected.originalObject.jsy_dh;
        $scope.item.jsy_zz = selected.originalObject.jsy_zz;
      }
    }
    // 手输
    $scope.cpData = [];
    $scope.cpInputChanged = function (value) {
      $scope.item.cj_cp = value;
      if (value.length >= 6) {
        requestService.getCommonOverrunCpInfo({cj_cp: $scope.item.cj_cp}).success(function (res) {
          console.log('res', res);
          if (res.success) {
            $scope.cpData = res.data;
            console.log('$scope.cpData', $scope.cpData);
          }
        })
      } else {
        $scope.cpData = [];
      }
    }

    /*--------------------------
     $ 日期设置
     --------------------------*/
    // todo：openDatepicker 必须的吗 ?
    $scope.openDatepicker = {
      cj_sj: false,
      fj_sj: false,
      aj_xwblsj: false,
      aj_xcblsj: false,
      aj_afsj: false
    };
    $scope.dateOptions = {
      showWeeks: false, // 标准
      startingDay: 1 // 周一开始
    };
    $scope.timeOptions = {
      //readonlyInput: true,
      showMeridian: false // meridian false 为 24小时制
    };
    $scope.openCalendar = function (e, dateField) {
      e.preventDefault();
      e.stopPropagation();
      $scope.openDatepicker[dateField] = true;
    };

    // 时间初始化
    var date = moment().format(dateFormat);
    // 复检时间：只要单号为空，每次都生成时间
    if (!$scope.item.fj_dh || $scope.item.fj_dh == '') {
      $scope.item.fj_sj = date
    }
    if (itemIsNew) {
      $scope.item.cj_sj = date
      $scope.item.aj_afsj = date
      $scope.item.aj_xcblsj = moment().add(16, 'minutes').format(dateFormat);
      $scope.item.aj_xwblsj = moment().add(32, 'minutes').format(dateFormat);
      $scope.item.fj_sj = date
      // 监听初检时间
      $scope.$watch('item.cj_sj', function (value) {
        var date = moment(value).format(dateFormat);
        $scope.item.aj_afsj = date
        $scope.item.aj_xcblsj = moment(date).add(16, 'minutes').format(dateFormat);
        $scope.item.aj_xwblsj = moment(date).add(32, 'minutes').format(dateFormat);
      });
    }

    // 初始化日期时间
    (function () {
      // 打开页面后，日期默认被 初检重置，所以此处再改回去
      $scope.item.aj_afsj = item.aj_afsj
      $scope.item.aj_xcblsj = item.aj_xcblsj
      $scope.item.aj_xwblsj = item.aj_xwblsj
    }())

    /*--------------------------
     $ 罚金计算
     --------------------------*/
    // 计算初检超值/罚金，通过超值触发
    $scope.calcChecklistOverValue = function () {
      if (!$scope.item.cj_zz || $scope.item.cj_zz == '') {
        return;
      }
      var resutl = forfeit.calcOverForfeit($scope.selectedOverrunType.name, $scope.item.cj_zz, $scope.item.cj_zs);
      $scope.item.cj_cz = resutl.overValue;
      $scope.item.aj_fk = resutl.forfeit;
      $scope.forfeitRange = resutl.forfeitRange ? resutl.forfeitRange.join('-') : '';
      // 存储自由裁量权  
      $scope.item.cj_zyclq = $scope.forfeitRange + '（' + resutl.forfeit + '）';
    }
    // 计算复检超值
    $scope.calcReChecklistOverValue = function () {
      if (!$scope.item.fj_zz || $scope.item.fj_zz == '') {
        return;
      }
      var resutl = forfeit.calcOverForfeit($scope.selectedOverrunType.name, $scope.item.fj_zz, $scope.item.cj_zs);
      $scope.item.fj_cz = resutl.overValue;
    }

    /*--------------------------
     $ 证件获取
     --------------------------*/
    // 初始化证件类型，带上数量，为了能显示正确的格子数目
    $scope.sceneImages = [{}, {}];
    $scope.vehicleImages = [{}, {}, {}];
    $scope.driverImages = [{}, {}, {}];
    $scope.billImages = [{}];
    $scope.recheckImages = [{}, {}];

    // 证件初始化
    if (!itemIsNew) {
      _loadImage($scope.item.aj_id, 'sceneImages');
      _loadImage($scope.item.aj_id, 'vehicleImages');
      _loadImage($scope.item.aj_id, 'driverImages');
      _loadImage($scope.item.aj_id, 'billImages');
      _loadImage($scope.item.aj_id, 'recheckImages');
    }

    // date 是业务信息，file 是文件本身
    function _loadImage(dataid, datatype) {
      requestService.queryImages({
        dataid: dataid,
        datatype: datatype
      }).success(function (res) {
        _fillImageArray(datatype, res.data)
      })
    }

    /*
     假定 images 必有空的对象
     从头遍历 images ，找到第一个空对象（没有 fileid）
     */
    function _fillImageArray(datatype, newImages) {
      var images = $scope[datatype];
      for (var i = 0; i < newImages.length; i++) {
        for (var k = 0; k < images.length; k++) {
          if (!images[k].fileid) {
            images.splice(k, 1, newImages[i]);
            break;
          }
        }
      }
    }

    $scope.isUploaded = function (image) {
      return image.fileid ? 'with-delete ' : 'no-upload';
    }


    /*--------------------------
     $ 证件上传
     --------------------------*/
    // 注：业务判断是用 sceneImages 而非 sceneFiles 
    $scope.$watch('sceneFiles', function () {
      $scope.upload($scope.sceneFiles, 'sceneImages');
    });

    $scope.$watch('vehicleFiles', function () {
      $scope.upload($scope.vehicleFiles, 'vehicleImages');
    });

    $scope.$watch('driverFiles', function () {
      $scope.upload($scope.driverFiles, 'driverImages');
    });

    $scope.$watch('billFiles', function () {
      $scope.upload($scope.billFiles, 'billImages');
    });

    $scope.$watch('recheckFiles', function () {
      $scope.upload($scope.recheckFiles, 'recheckImages');
    });

    /* 
     注：上传的内部实现是一个个上传，返回的是对象，而非数组
     */
    $scope.upload = function (files, datatype) {
      if (files && files.length) {
        if (_isFilesLengthLimited(files, datatype)) {
          ngToast.create({
            className: 'danger',
            content: '上传数目过多!'
          });
          return;
        }
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          Upload.upload({
            // todo：图片上传接口内部实现暴露了
            url: '/api/files/' + $scope.item.aj_id + '/insert.do',
            fields: {
              isthumbnail: true,
              width: 400,
              height: 200,
              // 文件类型
              filetype: 'image',
              // 业务类型
              datatype: datatype
            },
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('上传进度: ' + progressPercentage + '% ' + evt.config.file.name);
          }).success(function (res, status, headers, config) {
            console.log('文件 ' + config.file.name + '已经成功上传. 返回: ' + res);
            var images = $scope[datatype], newImage = res.data; // newImage 是单个对象
            for (var k = 0; k < images.length; k++) {
              if (!images[k].fileid) {
                images.splice(k, 1, newImage);
                break;
              }
            }
          });
        }
      }
    };

    // 控制上传的数目
    function _isFilesLengthLimited(newFiles, datatype) {
      var limited = false,
        imageNumber = 0,
        images = $scope[datatype];
      for (var i = 0; i < images.length; i++) {
        if (images[i].fileid) {
          imageNumber++;
        }
      }
      imageNumber += newFiles.length;
      if ((datatype == 'vehicleImages' || datatype == 'driverImages') && imageNumber > 1) {
        limited = true;
      } else if ((datatype == 'sceneImages' || datatype == 'recheckImages') && imageNumber > 2) {
        limited = true;
      } else if (datatype == 'billImages' && imageNumber > 1) {
        limited = true;
      }
      return limited;
    }

    /*--------------------------
     $ 证件删除
     --------------------------*/
    $scope.deleteImage = function (images, image) {
      requestService.deleteFile(image.fileid).success(function (res) {
        if (res.success) {
          for (var i = 0; i < images.length; i++) {
            if (images[i].fileid == image.fileid) {
              // 删除并用空对像替代（保证格子）
              images.splice(i, 1, {});
            }
          }
          ngToast.create({
            className: 'success',
            content: '删除成功!'
          });
        }
      }).error(function () {
        ngToast.create({
          className: 'danger',
          content: '删除失败!'
        });
      })
    }


    /*--------------------------
     $ 页内导航
     --------------------------*/
    $scope.gotoAnchor = function (id) {
      $location.hash(id);
      anchorSmoothScroll.scrollTo(id);
    }

    /*--------------------------
     $ 保存
     --------------------------*/
    function _beforeSave() {
      // fixme：格式化时间（临时方案）
      $scope.item.cj_sj = moment($scope.item.cj_sj).format(dateFormat)
      $scope.item.fj_sj = moment($scope.item.fj_sj).format(dateFormat)
      $scope.item.aj_afsj = moment($scope.item.aj_afsj).format(dateFormat)
      $scope.item.aj_xcblsj = moment($scope.item.aj_xcblsj).format(dateFormat)
      $scope.item.aj_xwblsj = moment($scope.item.aj_xwblsj).format(dateFormat)
    }

    $scope.save = function () {
      _beforeSave();
      requestService.overrunAdminItemUpdate($scope.item).success(function (res) {
        if (res.success) {
          myToast.successTip();
          // 刷新：修改成功后调用刷新
          $rootScope.$emit("paging.act")
          $modalInstance.close();
        }
      }).error(function () {
        myToast.failureTip();
      })
    }

    // modalInstance.close 依赖 modalInstance.result 和 modalInstance.opened
    // 正常关闭本层
    $scope.closeModal = function () {
      $modalInstance.close();
    }
    // 错误关闭本层
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }


    /*--------------------------
     $ 常用信息（带回历史）
     --------------------------*/
    requestService.getCommonOverrunDict().success(function (res) {
      if (res.success) {
        $scope.afddData = res.data.AFDD;
        $scope.xcblddData = res.data.XCBLDD;
        $scope.xwblddData = res.data.XWBLDD;
        $scope.zfrData = res.data.ZFR;
        $scope.tcddData = res.data.TCDD;
      }
    })
    /* 案发地点 */
    // 历史带回
    $scope.afddSelected = function (selected) {
      if (selected) {
        $scope.item.aj_afdd = selected.title;
      }
    }
    // 手输
    $scope.afddInputChanged = function (value) {
      $scope.item.aj_afdd = value;
    }
    /* 现场笔录地点 */
    $scope.xcblddSelected = function (selected) {
      if (selected) {
        $scope.item.aj_xcbldd = selected.title;
      }
    }
    $scope.xcblddInputChanged = function (value) {
      $scope.item.aj_xcbldd = value;
    }
    /* 询问笔录地点 */
    $scope.xwblddSelected = function (selected) {
      if (selected) {
        $scope.item.aj_xwbldd = selected.title;
      }
    }
    $scope.xwblddInputChanged = function (value) {
      $scope.item.aj_xwbldd = value;
    }
    /* 执法询问人 */
    $scope.zfxwrSelected = function (selected) {
      if (selected) {
        $scope.item.aj_zfx = selected.originalObject.aj_zfr;
        $scope.item.aj_zfxz = selected.originalObject.aj_zfrz;
      }
    }
    $scope.zfxwrInputChanged = function (value) {
      $scope.item.aj_zfx = value;
    }
    /* 执法记录人 */
    $scope.zfjlrSelected = function (selected) {
      if (selected) {
        $scope.item.aj_zfj = selected.originalObject.aj_zfr;
        $scope.item.aj_zfjz = selected.originalObject.aj_zfrz;
      }
    }
    $scope.zfjlrInputChanged = function (value) {
      $scope.item.aj_zfj = value;
    }
    /* 停车地点 */
    $scope.tcddSelected = function (selected) {
      if (selected) {
        $scope.item.aj_tcdd = selected.title;
      }
    }
    $scope.tcddInputChanged = function (value) {
      $scope.item.aj_tcdd = value;
    }


  })
