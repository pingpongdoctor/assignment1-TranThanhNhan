import { getAjax } from "/methods.js";

const container = document.getElementById("container");

// Get user data
getAjax("/user", (data) => {
    const parsedData =JSON.parse(data);
    
    // Render login and signup buttons if users are not authenticated
    if(parsedData.status != 200) {
        const loginBtn = document.createElement("button");
        const signupBtn = document.createElement("button");
        
        loginBtn.textContent = "Log in";
        signupBtn.textContent = "Sign up";

        loginBtn.addEventListener("click", (e) => {
            window.location.href = "/login";
        })

        signupBtn.addEventListener("click", (e) => {
            window.location.href = "/signup";
        })

        container.appendChild(loginBtn);
        container.appendChild(signupBtn);
        return;
    }

    // Render welcome text, gotoMemberArea button and logout button if users are authenticated
    const welcomeText = document.createElement("p");
    const goToMembersAreaBtn = document.createElement("button");
    const logoutBtn = document.createElement("button");

    welcomeText.textContent = `Hi ${parsedData.username}!`;

    goToMembersAreaBtn.textContent = "Go to Members Area";
    goToMembersAreaBtn.addEventListener("click", (e) => {
        window.location.href = "/member";
    })

    logoutBtn.textContent = "Log out";
    logoutBtn.addEventListener("click", (e) => {
        window.location.href = "/logout";
    })

    container.appendChild(welcomeText);
    container.appendChild(goToMembersAreaBtn);
    container.appendChild(logoutBtn);
})