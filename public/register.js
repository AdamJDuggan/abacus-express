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

// HOME BUTTON AT TOP
function goHome(){
    $('#home').on('click', () => {
        window.location = 'index.html';
    })
}



// Click to register an account and push income and exp to db
function register(){
    $('#regAndCalculateBtn').on('click', function (e) {
        e.preventDefault();
        console.log('clicked');
         // User income, expenses and first month to be turned into objects to send to db
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
         let monthly ={}
         monthly[$('#addMonthMonth').val()]=[$('#addMonthAmount').val()]
     // ------------------------------
 
         let user = {
             username: $('#registerEmail').val(),
             password: $('#registerPassword').val(),
             password2: $('#registerPassword2').val(),
             income: income,
             expenses: expenses,
             budgetinggoal: $('#budgetGoalInput').val(),
             monthly: monthly
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
                window.location = 'test.html';                
            })
            .catch(err => {
                console.error('Error:', err)
                $('#errorMsg').toggle();
            });


    })
}



// -------------------------------------------------------------------------------------------------------------------


// *****************************************************************
// WRAPPER FUNCTION 
// *****************************************************************


function setupPageWrapper(){
addRowToSetupIncome('#addIncomeTableRowBtn', '#incomeTableBody');
addRowToSetupExpense('#addExpenditureTableRowBtn', '#expenditureTableBody');
removeRowFromSetupIncomeTable();
removeRowFromSetupExpensesTable();
goHome();
register(); 
} 

$(setupPageWrapper());



