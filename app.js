//BUDGET CONTROLLER MODULE
var budgetController = (function(){
    //Income Function Constructor
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Expense Function Constructor
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var data = {
        allItems: {
            exp : [],
            inc : []
        },
        totals : {
            exp: 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    };

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(el => {
            sum += el.value;
        });

        data.totals[type] = sum;
    }
    return {
        addItem : function(type, des, val){
            var newItem, ID;

            //Create new ID for the new item
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            }else{
                ID = 0;
            }
            

            //Create new item based on 'inc' or 'exp'
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //Push new item into respective object
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;

            //ids = [1, 2, 8,9]           
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function(){

            // calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate total budget
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentage that we spent (expenses)
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },

        calculatePercentages : function(){
            /*
            a =20
            b=40
            income = 100
            a = 20/ 100 = 20%
            b = 40/ 100 = 40%
            */
            data.allItems.exp.forEach(el => {
                el.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerecentage = data.allItems.exp.map(current =>{
                return current.getPercentage();
            });

            return allPerecentage;
        },

        getBudget: function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    }

})();


//UI CONTROLLER MODULE
var uiController = (function(){
    // Object to store DOM elements
    var DOMstrings = {
        inputType : '.add_type',// either INC or EXP
        inputDescription : '.add_description',
        inputValue : '.add_value',
        inputBtn : '.add_btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget_value',
        incomeLabel : '.income_value',
        expenseLabel : '.expense_value',
        percentageLabel : '.expense_percentage',
        container: '.list_container',
        expensesPercentageLabel : '.item__percentage',
        monthLabel : '.budget_month',
        yearLabel : '.budget_year'
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec, sign;

        // + or - before the number
        num = Math.abs(num);

        // decimal point
        num = num.toFixed(2);

        // comma separating thousands  2000 => +2,000.00
        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ','+ int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListforEach =function(list, callback){
        for(var i=0; i< list.length; i++){
            callback(list[i], i);
        }
     };

    return {
        getInput : function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value, // either INC or EXP
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDOMStrings : function(){
            return DOMstrings;
        },

        addListItem : function(obj, type){
            var html, newHtml, element;

            // Create html string with placeholder text
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">%value%</div><div class="item__delete"><i class="far fa-times-circle"></i></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div> <div class="right"><div class="item__value">%value%</div><div class="item__percentage expense_percentage percentage">21%</div><div class="item__delete"><i class="far fa-times-circle"></i></div></div></div>';
            }

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // insert html in DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem : function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        changedType : function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription  + ',' +
                DOMstrings.inputValue
            );

            nodeListforEach(fields, function(cur){
                cur.classList.toggle('exptext_focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('expcolor');
        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(element => {
                element.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc': type = 'exp' ;

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages : function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListforEach(fields, function(el, index){
                if(percentages[index] > 0){
                    el.textContent = percentages[index] + '%';
                }else {
                    el.textContent = '--';
                }
               
            });
        },

        displayMonth : function(){
            var now, year, month, monthsList;
            monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();

            document.querySelector(DOMstrings.monthLabel).textContent = monthsList[month];
            document.querySelector(DOMstrings.yearLabel).textContent = year;
        }
    };
})();


// GLOABL CONTROLLER MODULE
var controller = (function(budgetCtrl, uiCtrl){
    var setupEventListeners = function(){
        var DOM = uiCtrl.getDOMStrings();

        document.querySelector('.add_btn').addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',uiCtrl.changedType);
    }; 

    var updatePercentage = function(){
        //calculate percentage
        budgetCtrl.calculatePercentages();

        //Read %  from budget controller
        var percentages = budgetCtrl.getPercentages();

        //update in UI
        uiCtrl.displayPercentages(percentages);
    };

    var updateBudget = function(){
        var budget;

        // Calculate budget
        budgetCtrl.calculateBudget();

        // Return Budget
        budget = budgetCtrl.getBudget();

        //Update budget on UI
        uiCtrl.displayBudget(budget);
    };

    var ctrlAddItem = function(){
        var input, item;

        // Get input data
        input = uiCtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // ADD item to budget controller DS
            item = budgetCtrl.addItem(input.type, input.description, input.value);

            // ADD new item to UI
            uiCtrl.addListItem(item, input.type);
            
            //Clear input fields
            uiCtrl.clearFields();

            //Calculate andd Update budget
            updateBudget();

            // Calculate and update percentages
            updatePercentage();
        }
    };
    
    var ctrlDeleteItem = function(e){
        var itemID, splitID, type , id;

        //get item ID 
        itemID = e.target.parentNode.parentNode.parentNode.id;
        
        //IF the parent id is itemID and not any other element 
        if(itemID){
            // inc-1 || exp-1
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // Delete the item from budget controller DS
            budgetCtrl.deleteItem(type, id);

            // Delte item from UI
            uiCtrl.deleteListItem(itemID);

            // Update totals and display new budget
            updateBudget();

             // Calculate and update percentages
             updatePercentage();
        }
    };

    return {
        init : function(){
            uiCtrl.displayBudget({
                    budget : 0,
                    totalInc : 0,
                    totalExp : 0,
                    percentage : 0
            });
            uiCtrl.displayMonth();
            console.log("Application has started");
            setupEventListeners();
        }
    };
})(budgetController, uiController);

controller.init();