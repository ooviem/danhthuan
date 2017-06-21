angular.module('starter.controllers', ['ngCordova.plugins.file'])

.controller('SearchCtrl', function($scope, $state, $stateParams, Products, $ionicPopup, $cordovaFile) {
  $scope.form = {
    searchText: ""
  };
  $scope.search = function(text){
    var products = Products.all();
    $scope.products = products.filter(function(item) {
      return item.name.toLowerCase().search($scope.form.searchText.toLowerCase()) > -1 || item.id.toLowerCase().search($scope.form.searchText.toLowerCase()) > -1 || item.note.toLowerCase().search($scope.form.searchText.toLowerCase()) > -1;
    });
  };
  $scope.$on('$ionicView.enter', function(e) {
    $scope.products = Products.all();
    if($scope.products === undefined || $scope.products === null) {
      $scope.products = [];
    }
  });
  $scope.delete = function(item){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Xác nhận xóa',
       template: 'Bạn có muốn xóa '+ item.name +' ?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $scope.products = Products.remove(item);
       }
     });
  };
  $scope.edit = function(item){
    $state.go('tab.detail', {"id": item._id});
  };
})

.controller('ProductCtrl', function($scope, $state, $stateParams, Products, $ionicPopup) {
   $scope.$on('$ionicView.enter', function(e) {
    $scope.title = "Thêm mới sản phẩm";
    $scope.product = {
      id: "",
      name: "",
      price: "",
      unit: "",
      note: "",
      createdDate: ""
    };
  });
  $scope.cancel =function() {
    $state.go('tab.search');
  };
  $scope.save =function() {
    if($scope.product.name !== undefined && $scope.product.id !== undefined && $scope.product.name !== null  && $scope.product.id !== null && $scope.product.id !== "" && $scope.product.name !== "") {
      Products.add($scope.product);
      $scope.product = {
        id: "",
        name: "",
        price: "",
        unit: "",
        note: "",
        createdDate: ""
      };
    } else {
       $scope.showAlert();
    }
  };
  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Lỗi',
       template: 'Mã và Tên không được để trống'
     });

     alertPopup.then(function(res) {
     });
  };
})
.controller('SettingCtrl', function($scope, $state, $stateParams, Products, $ionicPopup, $cordovaFile) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.title = "Cấu hình";
  });
  $scope.data = {
    "backupData": "",
    "showButton": false
  };
  $scope.getData = function() {
    if($scope.data.backupData === "1234abcd") {
      $scope.data.backupData = localStorage.getItem('products');
      $scope.data.showButton = true;
    }
  };
  $scope.save =function() {
    var products = JSON.parse($scope.data.backupData);
    localStorage.setItem('products', JSON.stringify(products));
    $scope.data.backupData = "";
  };
  $scope.export =  function() {
    $cordovaFile.writeFile(cordova.file.dataDirectory, "file.txt", "text", true)
      .then(function (success) {
        // success
      }, function (error) {
        // error
    });
    $scope.data.backupData = "";
  };
})

.controller('ProductDetailCtrl', function($scope, $state, $stateParams, Products, $ionicPopup) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.title = "Chỉnh sửa sản phẩm";
    $scope.product = Products.get($stateParams.id);
  });
  $scope.cancel =function() {
    $state.go('tab.search');
  };
  $scope.save =function() {
    if($scope.product.name !== undefined && $scope.product.id !== undefined && $scope.product.name !== null  && $scope.product.id !== null && $scope.product.id !== "" && $scope.product.name !== "") {
    	Products.save($scope.product);
      $state.go('tab.search');
    } else {
      $scope.showAlert();
    }
  };

  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Lỗi',
       template: 'Mã và Tên không được để trống'
     });

     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
  };
});
