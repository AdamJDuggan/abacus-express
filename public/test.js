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
                // localStorage.setItem("user", user.authToken);               
            })
            .catch(err => {
                console.error('Error:', err)
                $('#errorMsg').toggle();
            });


}

$(displayUser());
