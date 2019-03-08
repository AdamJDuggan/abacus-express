function displayUser(){
    let username = localStorage.getItem(user.username);   
                $('#userName').append(`
                    <p>${username}</p>
                `)  
}

$(displayUser());