export function postAjax(url, sentData, callback ){
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        if(xhr.readyState == XMLHttpRequest.DONE) {
            const data = xhr.responseText;
            callback(data);
        }
    }

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(sentData);
}

export function getAjax(url, callback ){
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
        if(xhr.readyState == XMLHttpRequest.DONE) {
            const data = xhr.responseText;
            callback(data);
        }
    }

    xhr.open("GET", url);
    xhr.send();
}

export function randomCat() {
    const randomNum = Math.random();
    let catId;

    if(randomNum < 0.3){
        catId = 1;
    } else if(randomNum >= 0.3 && randomNum <= 0.6) {
        catId = 2;
    } else {
        catId = 3;
    }

    return catId;
}