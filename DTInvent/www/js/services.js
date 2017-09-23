angular.module('starter.services', [])
  .factory('Products', function($cordovaSQLite, $q, $ionicPlatform, $rootScope) {
    return {
      init: function(){
        var deferred = $q.defer();
        $ionicPlatform.ready(function() {
          const db = $rootScope.db = $cordovaSQLite.openDB({ name: 'danhthuanv3.db', location: 'default' });
          const productQuery = "CREATE TABLE IF NOT EXISTS products(ID INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT,name TEXT,price TEXT,unit TEXT, note TEXT, createdDate TEXT);";
          $cordovaSQLite.execute(db, productQuery).then((res) => {
            deferred.resolve(res);
            console.log('Create products table');
          }, (error) => {
            deferred.reject(error);
            console.log('Can not create product table ERROR: ' + error);
          });
        });
        return deferred.promise;
      },
      all: function() {
        var deferred = $q.defer();
        const productQuery = "select * from products;";
        $cordovaSQLite.execute($rootScope.db, productQuery).then((response) => {
          const result = [];
          for (var i = 0; i < response.rows.length; i++) {
            result.push({
              _id: response.rows.item(i).ID,
              name: response.rows.item(i).name,
              id: response.rows.item(i).code,
              price: response.rows.item(i).price,
              unit: response.rows.item(i).unit,
              note: response.rows.item(i).note,
              createdDate: response.rows.item(i).createdDate
            });
          }
          $rootScope.products = result;
          deferred.resolve(result);
        }, (error) => {
          console.log('Can not fetch products ERROR: ' + error);
          deferred.reject(error);
        });
        return deferred.promise;
      },
      remove: function(item) {
        var index = $rootScope.products.findIndex(function(x) { return x._id === item._id });
        const productQuery = `DELETE FROM products WHERE ID= ${item._id};`;
        return $cordovaSQLite.execute($rootScope.db, productQuery).then((res) => {
          if (index != -1){ 
            $rootScope.products.splice(index, 1);
          }
        }, (error) => {
          console.log('Can not update product ERROR: ' + error);
        });
      },
      get: function(id) {
        var products = $rootScope.products;
        return products.find(function(x) { return x._id == id });
      },
      save: function(item) {
        var date = new Date();
        item.createdDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        const productQuery = `UPDATE products SET code = ${item.id}, name = ${item.name}, price = ${item.price}, unit=${item.unit}, createdDate =${item.createdDate} WHERE ID= ${item._id};`;
        return $cordovaSQLite.execute($rootScope.db, productQuery).then((res) => {
        }, (error) => {
          console.log('Can not update product ERROR: ' + error);
        });
      },
      add: function(item) {
        var date = new Date();
        item.createdDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        const productQuery = `INSERT INTO products (code, name, price, unit, note, createdDate) VALUES ('${item.id}', '${item.name}','${item.price}','${item.unit}','${item.note}','${item.createdDate}');`;
        return $cordovaSQLite.execute($rootScope.db, productQuery).then((res) => {
          item._id = res.insertId;
          $rootScope.products.push(item);
        }, (error) => {
          console.log('Can not update product ERROR: ' + error);
        });
      }
    };
  });
