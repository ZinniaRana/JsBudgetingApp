//MODULES implementation for independent separate module 
//Data Encapsulation implementation

//Budget Controller
var budgetController =(function(){
    var Expense = function(id, description, value){     //Constructor function
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value){     //Constructor function
        this.id = id;
        this.description = description;
        this.value = value;
    };          

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.total[type] = sum;
    };

    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        total : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    };

    return{
        addItem: function(type, des, val){
           var newItem,ID;

           //ID= LastID (id of last element) + 1  
           //Create new ID
           if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
           }
           else{
               ID = 0;
           }
           
            //Add item depending upon if it is inc or exp
           if(type ==='inc'){
                newItem = new Income(ID,des,val);
           }
           else if(type === 'exp'){
                newItem = new Expense(ID,des,val);
           }
            //Push item into data structure
           data.allItems[type].push(newItem);

           //eturn the New Element 
           return newItem;
        },

        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget = income - expenses
            data.budget = data.total.inc - data.total.exp;

            //calculate % of income that we spent
            if(data.total.inc > 0){
                data.percentage = Math.round((data.total.exp/data.total.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
            
        },

        getBudget : function(){
            return{
                budget : data.budget,
                totalInc : data.total.inc,
                totalExp : data.total.exp,
                percentage : data.percentage
            };
        },

        testing : function(){
            console.log(data);
        }
    };
})();  //IEFI

 
//UI Controller
var uiController = (function(){
    var DomStrings = {  // get and assign all elements in this object
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list'
    };

    return {
        getInput : function(){
            return {
                descriptionType : document.querySelector(DomStrings.inputType).value,   //will be either inc or exp
                description :  document.querySelector(DomStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DomStrings.inputValue).value),   // converting string to float value to apply calculation
            };
        },


        getDomStrings : function(){
            return DomStrings;
        },

        
        addListItem: function(obj, type){
            var html, newHtml, element;

            //Create HTML string with placeholder text
            if(type ==='inc'){
                element = DomStrings.incomeContainer;
                //Input Item List
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type ==='exp'){
                element = DomStrings.expenseContainer;
                //Expense Item List
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //Replace the placeholder text with the data received from object
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert HTML in DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields : function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DomStrings.inputDescription + ', '+ DomStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, arr){
                current.value = '';
            });

            fieldsArr[0].focus(); 
        }
        
    };

})();

//Global App Controller
var controller = (function(budgetCtrl, uiCtrl){

    var setupEventListeners = function(){
        var DOM = uiCtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function(){
        var budget;
        //Calculate the Budget
        budgetCtrl.calculateBudget();

        //Return budget
        budget = budgetCtrl.getBudget();

        // Display Bufget in UI
        console.log(budget);
    }

    var ctrlAddItem = function(){
        var input, newItem;

        //get the field input data
        input = uiCtrl.getInput();
        //console.log(input);

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //add item to budget controller
            newItem = budgetCtrl.addItem(input.descriptionType, input.description, input.value);
            
            //add item to UI
            uiCtrl.addListItem(newItem, input.descriptionType);

            // Clear the fields
            uiCtrl.clearFields();

            //Calculate and update budget
            updateBudget();
        }
    };
    
    return{
        init : function(){
            console.log('Controller started');
            setupEventListeners();
           
        }
    };

})(budgetController, uiController);

controller.init();