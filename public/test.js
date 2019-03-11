function displayUser(){

    let token = localStorage.getItem('user');
    console.log(token);
    
    let options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({ token })
    }

    fetch('api/auth/dashboard', options)
            .then(response => {
                console.log('Returned from server')
                return response.json()
            })
            .then(user => {
                console.log(user);
                // Budgeting goal
                $('#goal').append(`
                 <p>${user.budgetinggoal}</p>
                `)
                // Income
                let income = user.income;
                income.forEach(x => 
                ($('#income')).append(`<li>${x.source} ${x.amount} </li>`)
                );
                // Expenditure
                let expenses = user.expenses;
                expenses.forEach(x => 
                ($('#expenditure')).append(`<li>${x.source} ${x.amount} </li>`)
                );
                // Monthly 
                let month = user.monthly;
                month.forEach(x => 
                ($('#month')).append(`<li>${x.month} ${x.amount} </li>`)
                );
              
                // localStorage.setItem("user", user.authToken);               
            })
            .catch(err => {
                console.error('Error:', err)
                $('#errorMsg').toggle();
            });

    

}

$(displayUser());
