import { getAjax, randomCat } from "/methods.js";

const welcomeText = document.getElementById("welcomeText");
const mainElement = document.querySelector("main");
const logoutBtn = document.getElementById("logout");

// Get user data
getAjax("/user", (data) => {
    const parsedData =JSON.parse(data);
    welcomeText.textContent = `Hi ${parsedData.username}!`;
})

// Ramdomly generate the cat id that ranges from 1 to 3 (1 and 3 are exclusive)
const catId = randomCat();

// Get cat data
getAjax(`/cat/${catId}`, (data)=>{
    const parsedData = JSON.parse(data);

    // Add error message and try-again button elements if image is not found
    if(parsedData.status != 200) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = parsedData.message;

        const tryAgainButton = document.createElement("button");
        tryAgainButton.textContent = "Try again";

        tryAgainButton.addEventListener("click", (e)=>{
            window.location.href = "/members";
        })

        mainElement.appendChild(errorMessage);
        mainElement.appendChild(tryAgainButton);
        return;
    }

    // Create and append image element to the main element
    const imageElement = document.createElement("img");
    imageElement.src = parsedData.path;
    imageElement.alt = "cat";
    imageElement.id = "catImg";
    mainElement.appendChild(imageElement);

    // Add a click event listener to logout button
    logoutBtn.addEventListener("click", (e) => {
        window.location.href = "/logout";
    })
})