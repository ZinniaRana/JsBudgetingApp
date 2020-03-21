//MODULES implementation for independent separate module 
//Data Encapsulation implementation

var budgetController =(function(){
    var x =23;
    var add = function(a){
       return (x+a);
    }

    return {
        publicTest: function(b){
            return (add(b));
        }
    }
})();  //IEFI

var uiController = (function(){


})();

var controller = (function(budgetCtrl, uiCtrl){
    var z= budgetCtrl.publicTest(5);
    return {
        publicCtrl: function(){
            console.log(z);
        }
    }

})(budgetController, uiController);