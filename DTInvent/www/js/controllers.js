angular.module('starter.controllers', [])

.controller('SearchCtrl', function($scope, $state, $stateParams, Products) {
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
    $scope.products = Products.remove(item);
  };
  $scope.edit = function(item){
    $state.go('tab.detail', {"id": item._id});
  };
})

.controller('ProductCtrl', function($scope, $state, $stateParams, Products) {
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
   	Products.add($scope.product);
    $scope.product = {
      id: "",
      name: "",
      price: "",
      unit: "",
      note: "",
      createdDate: ""
    };
  };
})

.controller('ProductDetailCtrl', function($scope, $state, $stateParams, Products) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.title = "Chỉnh sửa sản phẩm";
    $scope.product = Products.get($stateParams.id);
  });
  $scope.cancel =function() {
    $state.go('tab.search');
  };
  $scope.save =function() {
  	Products.save($scope.product);
    $state.go('tab.search');
  };
});
