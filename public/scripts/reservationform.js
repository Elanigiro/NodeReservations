const container = document.getElementById("myContainer");
const form = document.getElementById("myForm");
const alertsWrapper = document.getElementById("alertsWrapper");

const BASE_URL = "/reservations/";

function purgeAlerts() {
    
    alertsWrapper.innerHTML = "";
}

/**
 * 
 * @param {boolean} success 
 * @returns {Element}
 */
function createAlertDiv(success) {

    let tmpAlert = document.createElement("div");
    tmpAlert.classList = "alert alert-dismissable d-flex align-items-center justify-content-between fade show";
    tmpAlert.setAttribute("role", "alert");

    let tmpIcon = document.createElement("template");

    let tmpMsg = document.createElement("div");

    let tmpBtn = document.createElement("button");
    tmpBtn.type = "button";
    tmpBtn.className = "btn-close";
    tmpBtn.setAttribute("data-bs-dismiss", "alert");
    tmpBtn.setAttribute("aria-label", "Close");

    if (success) {

        tmpAlert.classList.add("alert-success");
        tmpMsg.textContent = "Success";

        tmpIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>';
        //NOTE: I'm extracting the DocumentFragment from the HTMLTemplateElement
        tmpIcon = tmpIcon.content;
    }
    else {

        tmpAlert.classList.add("alert-danger");
        tmpMsg.textContent = "Failure";

        tmpIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Danger:"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>';
        //NOTE: I'm extracting the DocumentFragment from the HTMLTemplateElement
        tmpIcon = tmpIcon.content;
    }

    tmpAlert.append(tmpBtn, tmpMsg, tmpIcon);

    return tmpAlert;
}

/**
 * 
 * @param {boolean} success 
 */
function customAlert(success) {

    purgeAlerts();
    alertsWrapper.append(createAlertDiv(success));
}

//form eventListeners setup

form.onsubmit = (e) => {

    //prevents the refresh (default form submit handling)
    e.preventDefault();

    let tmpObj = {};
    (new FormData(form)).forEach((value, key) => { tmpObj[key] = value });

    fetch(BASE_URL, {

                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify(tmpObj)
                    }
    )
        .then((res) => {

            if (!res.ok) {

                throw new Error("Something went wrong");
            }

            return res.text();
        })
        .then((txt) => {

            console.log(txt);
            customAlert(true);
        })
        .catch((error) => {

            console.error(error);
            customAlert(false);
        });
};