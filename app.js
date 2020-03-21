//MODULES implementation for independent separate module 
//Data Encapsulation implementation

//Budget Controller
var budgetController =(function(){
    
})();  //IEFI


//UI Controller
var uiController = (function(){
    var DomStrings = {  // get and assign all elements in this object
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn'
    };

    var inputData = function(){
        var description =  document.querySelector(inputDescription).value;
    }

    var addItem = function(){

    }

    return {
        getInput : function(){
            return {
                descriptionType : document.querySelector(DomStrings.inputType).value,   //will be either inc or exp
                description :  document.querySelector(DomStrings.inputDescription).value,
                value : document.querySelector(DomStrings.inputValue).value,
            }
        },
        getDomStrings : function(){
            return DomStrings;
        }
    };

})();

//Global App Controller
var controller = (function(budgetCtrl, uiCtrl){
    var DOM = uiCtrl.getDomStrings();

    var ctrlAddItem = function(){
        //get the field input data
        var input = uiCtrl.getInput();
        console.log(input);
        //add item to budget controller

        //add item to UI

        //Calculate the Budget
    }
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13){
            ctrlAddItem();
        }
    })

})(budgetController, uiController);