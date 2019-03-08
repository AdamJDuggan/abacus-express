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


// UPDATE ACCOUNT  


// PUSH NEW MONTH 
function newMonth(){
    $('#addMonthBtn').on('click', e => {
        e.preventDefault();
        month = $('#addMonthMonth').val();
        amount = $('#addMonthAmount').val();
        remaining = $('#')
        $('#monthRow').append(`
        <nav class="level">
        <div class="level-item has-text-centered has-text-white">
        <div>
        <p class="heading">Month</p>
        <p class="title">${month}</p>
        </div>
        </div>
        <div class="level-item has-text-centered">
        <div>
        <p class="heading">Non-essential spending</p>
        <p class="title">£${amount}</p>
        </div>
        </div>
        <div class="level-item has-text-centered">
        <div>
        <p class="heading">Non-essential spending</p>
        <p class="title">£${amount}</p>
        </div>
        </div>
        </nav>
        <hr>
        `)
    })
}


// LOGOUT BUTTON
function logout(){
    $('logoutBtn').on('click', e => {
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
    newMonth();
    logout();
}

$(dashboardWrapperFunction());