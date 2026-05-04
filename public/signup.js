import { postAjax } from "/methods.js";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    const email = emailInput.value;

    if (!username) {
        alert("Please provide the username");
        return;
    }

    if (!password) {
        alert("Please provide the password");
        return;
    }

    if (!email) {
        alert("Please provide the email");
        return;
    }


    postAjax("/signup", JSON.stringify({ username, password, email }), (data) => {
        const parsedData = JSON.parse(data);

        if (parsedData.status != 200) {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = parsedData.message;
            document.querySelector("main").appendChild(errorMessage);
            return;
        }

        window.location.href = "/members";
    })
})