// *****************************************************************
// SETUP ACCOUNT PAGE JS 
// *****************************************************************


// ADD ROWS TO INCOME  TABLE (WHICH ARE PASSED IN AS ARGUMENTS IN initilize FUNCTION)
function addRowToSetupIncome(btn, table){
    $(btn).on('click', event => {
        event.preventDefault();
        $(table).append(
            `<tr>
            <th><input type="text" class="input incomeSource"></th>
            <th><input type="number" class="input incomeAmount"></th>
            </tr>`
        ) 
    })
}

// ADD ROW TO SETUP ACCOUNT EXPENSES TABLE 
function addRowToSetupExpense(btn, table){
    $(btn).on('click', event => {
        event.preventDefault();
        $(table).append(
            `<tr>
            <th><input type="text" class="input expenseSource"></th>
            <th><input type="number" class="input expenseAmount"></th>
            </tr>`
        ) 
    })
}

// SETUP PAGE REMOVE ROW WITH TRASH ICON FROM INCOME AND EXPENDITURE TABLE
function removeRowFromSetupTable(btn, table){
    $(table).on('click', btn , function () {
        event.preventDefault(); 
        $(this).closest('tr').remove();
    });
};


// CALCULATE GOAL
function calculateGoal(){
    //turn off button so it cant be re-pressed
    $('#loginCalculateBtn').toggle();
    // Calculate total income
    let incomeSum = 0;
    $(".incomeAmount").each(function(){
        incomeSum += +$(this).val();
    });
    // Calculate total expenditure
    let expSum = 0;
    $(".expenseAmount").each(function(){
        expSum += +$(this).val();
    });
    // Calculate remaining
    let remaining = incomeSum - expSum;

    $('#summarySection').append(
        `<div class="column is-one-quarter has-background-grey has-t ext-white loginSummaryBtn has-text-centered">
        <p class="heading is-size-6 has-text-weight-bold ">Your monthly income</p>
        <p class="title has-text-white">£${incomeSum}</p>
        </div>
        <div class="column is-one-quarter has-background-primary has-text-white loginSummaryBtn has-text-centered">
        <p class="heading is-size-6 has-text-weight-bold ">Your total expenses</p>
        <p class="title has-text-white">£${expSum}</p>
        </div>
        <div class="column is-one-quarter has-background-danger has-text-white loginSummaryBtn has-text-centered">
        <p class="heading is-size-6 has-text-weight-bold ">Remaining p/m</p>
        <p class="title has-text-white">£${remaining}</p>
        </div>`
    )
};

// PUSH INCOME AND EXPENDITURE TO DB
function postIncomeAndExp() {
    // User email for local storage 
    let email = localStorage.getItem('user');  
    
    // User income and expenses to be turned into objects to send to db
    

    // Make post to API 
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({email})
    }
        console.log('From fetch in html: ' + email);
        fetch('/user/firstpush', options)
            .then(response => {
                return response.json()
            })
            .catch(err => console.error('Error:', err));
};

// CALCULATE BUDGET AND DISPLAY BUDGETING GOAL 
function showBudgetingGoal() {
    $('#loginCalculateBtn').on('click', event => {
        event.preventDefault();    
        $('#loginBudgetingGoalSection').show(); 
        $('#loginSetupFinalSubmit').show();
        calculateGoal();
        postIncomeAndExp();           
    })
};


// Push budgeting goal to db and move to dashboard
function setGoalAndSubmit(){
    $('#loginFinalSubmitBtn').on('click', event => {
        event.preventDefault();    
        let goal = $('#budgetGoalInput').val();
        let email = localStorage.getItem('user');  
    // Make post to API 
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({email, goal})
    }
        console.log('From second fetch: ' + email + goal);
        fetch('/user/secondpush', options)
            .then(response => {
                return response.json()
            })
            .catch(err => console.error('Error:', err));
    
    })
}

// -------------------------------------------------------------------------------------------------------------------


// *****************************************************************
// WRAPPER FUNCTION 
// *****************************************************************
function setupPageWrapper(){
addRowToSetupIncome('#addIncomeTableRowBtn', '#incomeTableBody');
addRowToSetupExpense('#addExpenditureTableRowBtn', '#expenditureTableBody');
removeRowFromSetupTable('#addIncomeTableRowBtn', '#incomeTableBody');
removeRowFromSetupTable('#addExpenditureTableRowBtn', '#expenditureTableBody');
showBudgetingGoal();
setGoalAndSubmit();
} 


$(setupPageWrapper());

