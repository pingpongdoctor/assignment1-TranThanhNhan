import { postAjax } from "/methods.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if(!email) {
        alert("Please provide the email");
        return;
    }

    if(!password) {
        alert("Please provide the password");
        return;
    }

    postAjax("/login", JSON.stringify({email, password}), (data) =>{
        const parsedData = JSON.parse(data);
        if(parsedData.status == 200) {
            window.location.href = "/members";
        } else {
            const messageElement = document.getElementById("message");
            messageElement.textContent = parsedData.message;
        }
    })
})