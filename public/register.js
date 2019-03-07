// *****************************************************************
// REGISTER ACCOUNT PAGE 
// *****************************************************************

// ADD ROWS TO INCOME  TABLE (WHICH ARE PASSED IN AS ARGUMENTS IN initilize FUNCTION)
function addRowToSetupIncome(){
    $('#addIncomeTableRowBtn').on('click', event => {
        event.preventDefault();
        $('#incomeRowWrapper').append(
            `<form class="incomeRow">
            <div class="field-is-grouped">
            <div class="field has-addons">
            <p class="control"></p><a class="button is-static">Source</a></p>  
            <p class="control"><input class="input incomeSource" type="text"></p>
            <p class="control"><a class="button is-static">Amount</a></p>  
            <p class="control"><input class="input incomeAmount" type="number"></p>
            </div>
            </div>
            </form>`
        ) 
    })
}

// ADD ROW TO SETUP ACCOUNT EXPENSES TABLE 
function addRowToSetupExpense(){
    $('#addExpenseTableRowBtn').on('click', event => {
        event.preventDefault();
        $('#expenditureRowWrapper').append(
            `<form class="incomeRow">
            <div class="field-is-grouped">
            <div class="field has-addons">
            <p class="control"></p><a class="button is-static">Source</a></p>  
            <p class="control"><input class="input expenseSource" type="text"></p>
            <p class="control"><a class="button is-static">Amount</a></p>  
            <p class="control"><input class="input expenseAmount" type="number"></p>
            </div>
            </div>
            </form>`
        ) 
    })
}


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


// CALCULATE GOAL
function calculateGoal(){
    //turn off button so it cant be re-pressed
    $('#hideIncExpAndCalcBtn').toggle();
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
        <p class="heading is-size-6 has-text-weight-bold has-text-white ">Your monthly income</p>
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

function register(){
    $('#regAndCalculateBtn').on('click', function (e) {
        e.preventDefault();
        console.log('clicked');
         // User income and expenses to be turned into objects to send to db
         let income = {};   
         $('.incomeRow').each(function() {
             income[ $(this).find('.incomeSource').val()] 
             = $(this).find('.incomeAmount').val()
         });
         let expenses = {};   
         $('.expenseRow').each(function() {
            expenses[ $(this).find('.expenseSource').val()] 
             = $(this).find('.expenseAmount').val()
         });
     // ------------------------------
 
         let user = {
             username: $('#registerEmail').val(),
             password: $('#registerPassword').val(),
             password2: $('#registerPassword2').val(),
             income: income,
             expenses: expenses
         }
         console.log(user);

        //  FETCH TO SERVER
        let options = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(user)
        }

        fetch('api/auth/register', options)
            .then(response => {
                console.log('Returned from server')
                return response.json()
            })
            .then(user => {
                console.log(user);
                localStorage.setItem("user", user.authToken);
                window.location = 'dashboard.html';                
            })
            .catch(err => {console.error('Error:', err)});


    })
}

// CALCULATE BUDGET AND DISPLAY BUDGETING GOAL 
function showBudgetingGoal() {
    $('#regAndCalculateBtn').on('click', event => {
        event.preventDefault();    
        $('#loginBudgetingGoalSection').show(); 
        $('#loginSetupFinalSubmit').show();
        calculateGoal();  
    })
};


// -------------------------------------------------------------------------------------------------------------------


// *****************************************************************
// WRAPPER FUNCTION 
// *****************************************************************


function setupPageWrapper(){
addRowToSetupIncome('#addIncomeTableRowBtn', '#incomeTableBody');
addRowToSetupExpense('#addExpenditureTableRowBtn', '#expenditureTableBody');
removeRowFromSetupIncomeTable();
removeRowFromSetupExpensesTable();
showBudgetingGoal();
register(); 
} 

$(setupPageWrapper());



