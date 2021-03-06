angular.module('starter.controllers', [])

  .controller('SearchCtrl', function($scope, $state, $stateParams, Products, $ionicPopup, $cordovaSQLite, $rootScope, $cordovaFile) {
    $scope.form = {
      searchText: ""
    };
    $scope.backup = function() {
      const data = JSON.stringify($scope.products);
      $cordovaFile.writeFile(cordova.file.externalDataDirectory, 'dbbackup.txt', data, {'append':false} ).then( function(result) {
        var alertPopup = $ionicPopup.alert({
          title: 'Thành công',
          template: 'Sao lưu thành công'
        });
      }, function(err) {
        console.log(err);
      });
    };
    $scope.search = function(text) {
      const searchText = $scope.form.searchText.toLowerCase();
      if (!searchText || searchText === '') {
        $scope.products = [];
        return;
      }
      $scope.products = $rootScope.products.filter(function(item) {
        return item.name.toLowerCase().search(searchText) > -1 || item.id.toLowerCase().search(searchText) > -1 || item.note.toLowerCase().search(searchText) > -1;
      }).slice(0, 30);
    };
    $scope.$on('$ionicView.enter', function(e) {
      if (!$rootScope.products) {
        Products.init().then(() => {
          Products.all().then((products) => {
            $scope.products = [];
          }, () => {
            $scope.products = [];
          });
        });
      } else {
        // $scope.products = $rootScope.products;
      }
    });
    $scope.delete = function(item) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Xác nhận xóa',
        template: 'Bạn có muốn xóa ' + item.name + ' ?'
      });
      confirmPopup.then(function(res) {
        if (res) {
          Products.remove(item);
        }
      });
    };
    $scope.edit = function(item) {
      $state.go('tab.detail', { "id": item._id });
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
    $scope.cancel = function() {
      $state.go('tab.search');
    };
    $scope.save = function() {
      if ($scope.product.name !== undefined && $scope.product.id !== undefined && $scope.product.name !== null && $scope.product.id !== null && $scope.product.id !== "" && $scope.product.name !== "") {
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
  .controller('ProductDetailCtrl', function($scope, $state, $stateParams, Products, $ionicPopup) {
    $scope.$on('$ionicView.enter', function(e) {
      $scope.title = "Chỉnh sửa sản phẩm";
      $scope.product = Products.get($stateParams.id);
    });
    $scope.cancel = function() {
      $state.go('tab.search');
    };
    $scope.save = function() {
      if ($scope.product.name !== undefined && $scope.product.id !== undefined && $scope.product.name !== null && $scope.product.id !== null && $scope.product.id !== "" && $scope.product.name !== "") {
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
