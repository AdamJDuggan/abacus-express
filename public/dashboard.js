// *****************************************************************
// DASHBAORD JS 
// *****************************************************************


// ADD ROW TO INCOME TABLE: WORKING
function addRowToIncome(){
    $('#addIncomeTableRowBtn').on('click', event => {
        event.preventDefault();
        $('#incomeRowWrapper').append(
            `<form class="incomeRow">
            <div class="field-is-grouped">
            <div class="field has-addons">
            <p class="control"></p><a
            class="button is-static">Source</a></p>
            <p class="control"><input
            class="input incomeSource"
            type="text"></p>
            <p class="control"><a
            class="button is-static">Amount</a></p>
            <p class="control"><input
            class="input incomeAmount"
            type="number"></p>
            </div>
            </div>
            </form>`
        ) 
    })
}

// ADD ROW TO SETUP ACCOUNT EXPENSES TABLE 
function addRowToExpense(){
    $('#addExpenseTableRowBtn').on('click', event => {
        event.preventDefault();
        $('#expenditureRowWrapper').append(
            `<form class="expenseRow">
            <div class="field-is-grouped">
            <div class="field has-addons">
            <p class="control"></p><a
            class="button is-static">Source</a></p>
            <p class="control"><input
            class="input expenseSource"
            type="text"></p>
            <p class="control"><a
            class="button is-static">Amount</a></p>
            <p class="control"><input
            class="input expenseAmount"
            type="number"></p>
            </div>
            </div>
            </form>`
        ) 
    })
}

// REMOVE ROW FROM INCOME TABLE
function removeIncomeRow(){
    $('#removeIncomeTableRowBtn').on('click', function () {
        event.preventDefault(); 
       $('.incomeRow').last().remove();
    });
};

// REMOVE ROW FROM EXPENSES TABLE
function removeExpensesRow(){
    $('#removeExpenseTableRowBtn').on('click', function () {
        event.preventDefault(); 
       $('.expenseRow').last().remove();
    });
};




// POPULATE PAGE WITH USER ACCOUNT
function displayUser(){

    let token = localStorage.getItem('user');
    
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ })
    }

    fetch('api/auth/dashboard', options)
            .then(response => {
                console.log('User account returned from server and displayed')
                return response.json()
            })
            .then(user => {
                
                // Budgeting goal summary: WORKING 
                $('#summaryGoal').append(`
                 <p>£${user.budgetinggoal}</p>
                `)
                
                // Budgeting goal update: WORKING
                $('#budgetGoalInput').val(`${user.budgetinggoal}`);

                // Income update section: WORKING
                let income = user.income;
                income.forEach(x => 
                ($('#incomeRowWrapper')).append(
                    `<form class="incomeRow">
                    <div class="field-is-grouped">
                    <div class="field has-addons">
                    <p class="control"></p><a
                    class="button is-static">Source</a></p>
                    <p class="control"><input
                    class="input incomeSource"
                    type="text" value="${x.source}"></p>
                    <p class="control"><a
                    class="button is-static">Amount</a></p>
                    <p class="control"><input
                    class="input incomeAmount"
                    type="number" value="${x.amount}"></p>
                    </div>
                    </div>
                    </form>`)                
                );

                // Income total for Summary: WORKING 
                let incomeArray = [];
                income.forEach(x => incomeArray.push(x.amount));
                const totalIncome = incomeArray.reduce((total, amount) => total + amount); 
                $('#summaryIncome').append(`£${totalIncome}`)
            
                // Expenditure update section: WORKING
                let expenses = user.expenses;
                expenses.forEach(x => 
                ($('#expenditureRowWrapper')).append(
                    `<form class="expenseRow">
                    <div class="field-is-grouped">
                    <div class="field has-addons">
                    <p class="control"></p><a
                    class="button is-static">Source</a></p>
                    <p class="control"><input
                    class="input expenseSource"
                    type="text" value="${x.source}"></p>
                    <p class="control"><a
                    class="button is-static">Amount</a></p>
                    <p class="control"><input
                    class="input expenseAmount"
                    type="number" value="${x.amount}"></p>
                    </div>
                    </div>
                    </form>`)                
                );

                // Summary Expenses total: WORKING
                  expensesArray = [];
                  expenses.forEach(x => expensesArray.push(x.amount));
                  const totalExpenses = expensesArray.reduce((total, amount) => total + amount); 
                  $('#summaryExpenses').append(`£${totalExpenses}`);

                // Remaining at end of month Summary Section: WORKING
                let remaining = totalIncome - totalExpenses;
                $('#remainingSummary').append(`£${remaining}`);

                // Monthly row: WORKING 
                let month = user.monthly;
                month.forEach(x => 
                ($('#monthRowWrapper')).append(`
                <nav class="level is-mobile monthRow">
                <div class="level-item has-text-centered has-text-white">
                <div>
                <p class="heading">Month</p>
                <input class="title has-text-centered has-background-info addMonthMonth" value="${x.month}" readonly>
                </div>
                </div>
                <div class="level-item has-text-centered">
                <div>
                <p class="heading">Non-essential spending</p>
                <input class="title has-text-centered has-background-info addMonthAmount" value="${x.amount}" readonly>
                </div>
                </div>
                </nav>
                <hr>`)
                );

            })
            .catch(err => {
                console.error('Error:', err)
                $('#errorMsg').toggle();
            });
}



// UPDATE ACCOUNT  
function updateAccount(){
    $('#updateAccountBtn').on('click', e => {
        e.preventDefault();
        let token = localStorage.getItem('user');
        
        
        // User income to be turned into objects to send to db
        let income = [];   
        $('.incomeRow').each(function() {
            const newIncome = {}
           newIncome["source"] = $(this).find('.incomeSource').val();
           newIncome["amount"] = $(this).find('.incomeAmount').val();
           income.push(newIncome);
        });

        // User expenses to be updated on db 
        let expenses = [];   
        $('.expenseRow').each(function() {
            const newExpenses = {}
            newExpenses["source"] = $(this).find('.expenseSource').val();
            newExpenses["amount"] = $(this).find('.expenseAmount').val(); 
            expenses.push(newExpenses);
        });

        // Get current months and push to array to send to server
        let monthly = [];
        $('.monthRow').each(function() {
        const newMonthly = {};
        newMonthly["month"] = $(this).find('.addMonthMonth').val();
        newMonthly["amount"] = $(this).find('.addMonthAmount').val();
        monthly.push(newMonthly);
        });
        // Add to this the new month added
        let newMonthAdded = {};
        newMonthAdded["month"] = $('#newMonthMonth').val();
        newMonthAdded["amount"] = $('#newMonthAmount').val();
        if (!($('#newMonthMonth').val()).length == 0 || !($('#newMonthAmount').val()).length == 0 ){
            monthly.push(newMonthAdded);
        }
        

        
        let user = {
            //username: token,
            income: income,
            expenses: expenses,
            budgetinggoal: $('#budgetGoalInput').val(),
            monthly: monthly
        }

        let options = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": token
            },
            body: JSON.stringify(user)

        }

        fetch('api/auth/update', options)
            .then(response => {
                return response.json()
            })
            .then(user => {
                console.log('user updated successfully');
                window.location.reload();
            }).catch(err => console.log('err updating user', err))
    })
}

// LOGOUT BUTTON
function logout(){
    $('#logoutBtn').on('click', e => {
        e.preventDefault();
        localStorage.clear();
        window.location="index.html";
})
}



// WRAPPER FOR ALL ABOVE STYLE DISPLAY TOGGLES 
function dashboardWrapperFunction(){ 
    addRowToIncome();
    addRowToExpense();
    removeIncomeRow();
    removeExpensesRow();
    updateAccount();
    logout();
   
}

$(displayUser());
$(dashboardWrapperFunction());