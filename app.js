//MODULES implementation for independent separate module 
//Data Encapsulation implementation

//Budget Controller
var budgetController =(function(){
    var Expense = function(id, description, value){     //Constructor function
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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

        deleteItem : function(type , id){
            var index, ids; 

            //id =6
            //ids =[2,3,6,8]
            //index = 2
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages : function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.total.inc);
            });

        },


        getPercentages : function(){
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });

            return allPerc;
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

 
//UI Controller -----------------------------------------------------------
var uiController = (function(){
    var DomStrings = {  // get and assign all elements in this object
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expensesPercLabel : '.item__percentage'
    };


    var formatNumber =  function(num, type){
        /*  + or - before num
        add decimal points
        comma separating thousands */
        var numSplit, int, dec, sign;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit =  num.split('.');

        int = numSplit[0];
        if(int.length >3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3);  // input = 2310  , then result = 2,310
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    return {
        getInput : function(){
            return {
                descriptionType : document.querySelector(DomStrings.inputType).value,   //will be either inc or exp
                description :  document.querySelector(DomStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DomStrings.inputValue).value),   // converting string to float value to apply calculation
            };
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert HTML in DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem : function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },


        clearFields : function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DomStrings.inputDescription + ', '+ DomStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, arr){
                current.value = '';
            });

            fieldsArr[0].focus(); 
        },

        displayBudget : function(obj){
            var type;
            obj.budget > 0 ? type = 'inc': type ='exp';

            document.querySelector(DomStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DomStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DomStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage> 0){
                document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DomStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DomStrings.expensesPercLabel);

            var nodeListForEach = function(list, callback){
                for(var i=0; i< list.length; i++){
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(curr, index){

                if(percentages[index] > 0){
                    curr.textContent =  percentages[index] + '%';
                }
                else{
                    curr.textContent = '---';
                }
            });
        },

        getDomStrings : function(){
            return DomStrings;
        },
        
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };


    var updateBudget = function(){
        var budget;
        //Calculate the Budget
        budgetCtrl.calculateBudget();

        //Return budget
        budget = budgetCtrl.getBudget();

        // Display Bufget in UI
        uiCtrl.displayBudget(budget);
    };

    var updatePercentages = function(){

        //caculate percentages
        budgetCtrl.calculatePercentages();

        //read from budget controller
        var percentages = budgetCtrl.getPercentages();

        //update ui
        uiCtrl.displayPercentages(percentages);
    };


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

            //calculate and update %
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            // delete the item from ui
            uiCtrl.deleteListItem(itemID);

            // update the budget
            updateBudget();

            //calculate and update %
            updatePercentages();

        }
    };
    
    return{
        init : function(){
            console.log('Controller started');
            uiCtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
            setupEventListeners();
           
        }
    };

})(budgetController, uiController);

controller.init();