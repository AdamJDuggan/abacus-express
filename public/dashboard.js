// *****************************************************************
// DASHBAORD JS 
// *****************************************************************

// ADD ROWS TO INCOME AND EXPENDITURE TABLE (WHICH ARE PASSED IN AS ARGUMENTS IN initilize FUNCTION)
function addRowToDashBoardTable(btn, table){
    $(btn).on('click', event => {
        event.preventDefault(); 
        $(table).append(
            `<tr>
            <th contenteditable="true"></th>
            <th contenteditable="true"></th>
            </tr>`
        ) 
    })
}

// DASHBOARD REMOVE ROW WITH TRASH ICON FROM INCOME AND EXPENDITURE TABLE
function removeRowFromDashBoardTable(){
    $('removeIncomeRow').on('click', function () {
        event.preventDefault(); 
        $('#incomeTableBody').removeChild();
    });
};


// SETUP PAGE REMOVE ROW FROM INCOME TABLE
function removeRowFromSetupIncomeTable(){
    $('#removeIncomeTableRowBtn').on('click', function () {
        event.preventDefault(); 
       $('.incomeRow').last().remove();
    });
};

// SETUP PAGE REMOVE ROW FROM INCOME TABLE
function removeRowFromSetupExpensesTable(){
    $('#removeExpenseTableRowBtn').on('click', function () {
        event.preventDefault(); 
       $('.expenseRow').last().remove();
    });
};

// POPULATE PAGE WITH USER ACCOUNT
function displayUser(){

    let token = localStorage.getItem('user');
    console.log(token);
    
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
                console.log('Returned from server')
                return response.json()
            })
            .then(user => {
                console.log(user);
                
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
                let monthly = [];
                $('.monthRow').each(function() {
                const newMonthly = {};
                newMonthly["month"] = $(this).find('.addMonthMonth').val();
                newMonthly["amount"] = $(this).find('.addMonthAmount').val();
                monthly.push(newMonthly);
                console.log(monthly);
                });

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
        monthly.push(newMonthAdded)
        console.log(monthly);
        

        
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
            //body: JSON.stringify({ token })

        }

        fetch('api/auth/update', options)
            .then(response => {
                return response.json()
            })
            .then(user => {
                console.log('user updated successfulllllllllllly', user);
                window.location.reload();
            }).catch(err => console.log('err updattttttttttttttttttting user', err))
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
    addRowToDashBoardTable('#addIncomeTableRowBtn', '#incomeTableBody');
    addRowToDashBoardTable('#addExpenseTableRowBtn', '#expenseTableBody');
    removeRowFromDashBoardTable();
    updateAccount();
    logout();
   
}

$(displayUser());
$(dashboardWrapperFunction());