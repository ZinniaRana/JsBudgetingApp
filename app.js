//MODULES implementation for independent separate module 
//Data Encapsulation implementation

//Budget Controller
var budgetController =(function(){
    
})();  //IEFI


//UI Controller
var uiController = (function(){
    var description =  document.querySelector('.add__description').textContent;

})();

//Global App Controller
var controller = (function(budgetCtrl, uiCtrl){
    var ctrlAddItem = function(){

        console.log("inside");
        //get the filled input data

        //add item to budget controller

        //add item to UI

        //Calculate the Budget
    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13){
            ctrlAddItem();
        }
    })
})(budgetController, uiController);