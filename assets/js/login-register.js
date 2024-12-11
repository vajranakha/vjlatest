document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".tt-register-form");

    if(form) {

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
    
            console.log(email);
            console.log("password", password);
    
            try {
                const response = await fetch("http://www.api.vajranakha.org/loginregister/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name, email, password }),
                });
    
                const data = await response.json();
                if (data.success) {
                    alert("OTP has been sent to your email.");
                    sessionStorage.setItem('authToken', data.token);
                    window.location.href = "otp.html";
                } else {
                    alert("Registeration failed.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            }
        });

    }

    

    const loginForm = document.querySelector(".tt-login-form");

    if(loginForm){

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const email = document.getElementById("login-name").value;
            const password = document.getElementById("login-password").value;
    
            console.log(email);
            console.log("password", password);
    
            try {
                const response = await fetch("http://www.api.vajranakha.org/loginregister/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
    
                const data = await response.json();
                if (data.success) {

                    alert(data.message);
                    localStorage.setItem('authenticationToken', data.token);
                    window.location.href = "z1.html";
                    
                } else {
                    alert(data.message);
                    if(data.message === 'User does not Exist'){
                        window.location.href = "shop-register.html";
                    }
                    
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            }
        });

    }

    

});