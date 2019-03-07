// *****************************************************************
// LANDING PAGE JS 
// *****************************************************************

// LOGIN PAGE DISPLAY DIV ELEMENTS 
function showLogin() {
    $('#loginBtn').on('click', event => {
        event.preventDefault();
        $('#register').hide();
        $('#login').toggle();
    })
};
// REG DIV DISPLAY DIV ELEMENT 
function showRegister() {
    $('#registerBtn').on('click', event => {
        event.preventDefault();
        $('#login').hide();
        $('#register').toggle();
    })
};

// WRAPPER FOR ABOVE STYLE DISPLAY TOGGLES 
function divDisplayWrapper() {
    showLogin();
    showRegister();
}
// -------------------------------------------------------------------------------------------------------------------

// *****************************************************************
// REGISTRATION FORM 
// *****************************************************************
function watchRegisterFormSubmit() {

    $('#regForm').submit(function (e) {
        // Prevent dedault form behaviour 
        e.preventDefault();
        let user = {
            username: $('#registerEmail').val(),
            password: $('#registerPassword').val(),
            password2: $('#registerPassword2').val(),
        }

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
                window.location = 'account.html';                
            })
            .catch(err => {console.error('Error:', err)});
    })
};

// -------------------------------------------------------------------------------------------------------------------





// *****************************************************************
// LOGIN FORM 
// *****************************************************************
function watchLoginFormSubmit() {

    $('#loginForm').submit(function (e) {
        // Prevent dedault form behaviour 
        e.preventDefault();
        let user = {
            username: $('#loginEmail').val(),
            password: $('#loginPassword').val(),
        }

        let options = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(user)
        }

        fetch('/api/auth/login', options)
            .then(response => {
                console.log('Returned from server')
                return response.json(response)
            })
            .then(user => {
                console.log(user);
                localStorage.setItem("user", user.authToken);
                window.location = 'account.html';                  
            })
            .catch(err => console.error('Error:', err));
    })
};

// -------------------------------------------------------------------------------------------------------------------




// *****************************************************************
// WRAPPER FUNCTION  
// *****************************************************************
function indexWrapperFunction() {
    divDisplayWrapper();
    watchRegisterFormSubmit();
    watchLoginFormSubmit();
}

$(indexWrapperFunction());
