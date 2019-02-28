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

// UPDATE EXPENDITURE/INCOME WRAPPER FUNCTION (POST TO DB, UPDATE SUMMARY)


// UPDATE GOAL: PUSH TO DB AND UPDATE PAGE  



// WRAPPER FOR ALL ABOVE STYLE DISPLAY TOGGLES 
function dashboardWrapperFunction(){ 
    addRowToDashBoardTable('#addIncomeTableRowBtn', '#incomeTableBody');
    addRowToDashBoardTable('#addExpenseTableRowBtn', '#expenseTableBody');
    removeRowFromDashBoardTable();
}

$(dashboardWrapperFunction());