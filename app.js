//MODULES implementation for independent separate module 
//Data Encapsulation implementation

//Budget Controller
var budgetController =(function(){
    var Expense = function(id, description, value){     //Constructor function
        this.id = id;
        this.description = description;
        this.value = value;
    } 
    var Income = function(id, description, value){     //Constructor function
        this.id = id;
        this.description = description;
        this.value = value;
    }          

    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        total : {
            exp : 0,
            inc : 0
        }
    };

    return{
        addItem: function(type, des, val){
           var newItem,ID;

           var itemArray = data.allItems[type];
           //ID= LastID (id of last element) + 1  
           //Create new ID
           if(data.allItems[type].length > 0){
                ID = itemArray[itemArray.length - 1].id + 1;
           }
           else{
               ID = 0;
           }
           
            //Add item depending upon if it is inc or exp
           if(type ==='inc'){
                newItem = Income(ID,des,val);
           }
           else if(type === 'exp'){
                newItem = Expense(ID,des,val);
           }
            //Push item into data structure
           data.allItems[type].push(newItem);

           //eturn the New Element 
           return newItem;
        },

        testing : function(){
            console.log(data);
        }
    }
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

    var setupEventListeners = function(){
        var DOM = uiCtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13){
                ctrlAddItem();
            }
        })
    };

    var ctrlAddItem = function(){
        var input, newItem;
        //get the field input data
        input = uiCtrl.getInput();

        //add item to budget controller
        newItem = budgetCtrl.addItem(input.descriptionType, input.description, input.value);
        //add item to UI

        //Calculate the Budget
    }
    
    return{
        init : function(){
            setupEventListeners();
        }
    }

})(budgetController, uiController);

controller.init();