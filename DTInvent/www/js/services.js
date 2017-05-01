angular.module('starter.services', [])

.factory('Products', function() {
  return {
    all: function() {
      if(localStorage.getItem('products') !== undefined && localStorage.getItem('products') !== undefined) {
        return JSON.parse(localStorage.getItem('products'));
      } else {
        return [];
      }
    },
    remove: function(item) {
      var products = Products.all();
      var index = products.findIndex(x => x._id === item._id);
      if(index != -1)
      products.splice( index, 1 );
      localStorage.setItem('products', JSON.stringify(products));
      return products;
    },
    get: function(id) {
      var products = Products.all();
      return products.find(x => x._id == id);
    },
    save: function(item) {
      var products = Products.all();
      var index = products.findIndex(x => x._id === item._id);
      products[index] = item;
      localStorage.setItem('products', JSON.stringify(products));
    },
    add: function(item) {
      var products = Products.all();
      var productId = products[products.length - 1] !== undefined ? products[products.length - 1]._id : undefined;
      item._id = productId === undefined ? 1 : productId + 1;
      item.createdDate = new Date().toLocaleDateString("vi-VN");
      products.push(item);
      localStorage.setItem('products', JSON.stringify(products));
    }
  };
});
