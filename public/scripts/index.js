
const container = document.getElementById("myContainer");
const containerTitle = document.getElementById("myContainerTitle");
const overlay = document.getElementById("myModal");
const bootstrapModalObj = new bootstrap.Modal("#myModal");
const modalForm = document.getElementById("myModalForm");
const modalButton = document.getElementById("modalSubmit");
const search = document.getElementById("mySearch");
const searchBtn = document.getElementById("mySearchBtn");

const dropDbLink = document.getElementById("myDropDb");
const dwlTodayLink = document.getElementById("myTodayDwl");
const dwlFullLink = document.getElementById("myFullDwl");

const BASE_URL = "/reservations/";
const BASE_FILE_URL = "/files";
const DATA_ATTR = "data-bs-itemid";

const RESERVATIONS = new Map();

/**
 * 
 * @param {Element} card 
 * @param {Object} info 
 */
function populateCard(card, info) {

    /** @type {Element} */
    const cardText = card.getElementsByClassName("card-text")[0];
    /** @type {Element} */
    const buttonEdit = card.getElementsByClassName("btn-primary")[0];
    /** @type {Element} */
    const buttonDelete = card.getElementsByClassName("btn-danger")[0];

    Object.getOwnPropertyNames(info).forEach((key) => {

        let value = String(info[key]);
        let field = document.createElement("p");
        let fieldKey = document.createElement("strong");
        fieldKey.textContent = `${key}: `;
        field.append(fieldKey, value);

        cardText.appendChild(field);
    });

    buttonEdit.setAttribute(DATA_ATTR, info.id);

    buttonDelete.addEventListener("click", (e) => {

        fetch(`${BASE_URL}${info.id}`, { method: 'DELETE' })
            .then((res) => {

                if (!res.ok) {

                    throw new Error("Something went wrong!");
                }

                return res.text();
            })
            .then((txt) => {

                console.log(txt);
                refreshPage();
            })
            .catch((error) => {

                console.error(error);
            });
    });
}

function createCard() {

    const outerCard = document.createElement("div");
    outerCard.classList = "col mb-4";

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    
    const cardText = document.createElement("div");
    cardText.classList.add("card-text");

    const buttonEdit = document.createElement("button");
    buttonEdit.type = "button";
    buttonEdit.classList = "btn btn-primary m-2";
    buttonEdit.textContent = "Edit";
    buttonEdit.setAttribute("data-bs-toggle", "modal");
    buttonEdit.setAttribute("data-bs-target", "#myModal");

    const buttonDelete = document.createElement("button");
    buttonDelete.type = "button";
    buttonDelete.classList = "btn btn-danger m-2";
    buttonDelete.textContent = "Delete";

    outerCard.appendChild(card).appendChild(cardBody).append(cardText, buttonEdit, buttonDelete);

    return outerCard;
}

/**
 * 
 * @param {Object} info 
 */
function fillInOverlay(info) {

    //cleanup
    modalForm.innerHTML = "";
    modalButton.disabled = true;

    Object.getOwnPropertyNames(info).forEach((key) => {

        let value = info[key];
        let tmpId = `overlay_${key}`;

        let tmpDiv = document.createElement("div");
        tmpDiv.classList.add("mb-3");

        let tmpLabel = document.createElement("label");
        tmpLabel.setAttribute("for", tmpId);
        tmpLabel.classList.add("col-form-label");
        tmpLabel.textContent = key;

        let tmpInput = document.createElement("input");
        tmpInput.classList.add("form-control");
        tmpInput.id = tmpId;
        tmpInput.name = key;
        tmpInput.setAttribute("required", "required");
        if (key === "date") {

            tmpInput.type = "date";
        }
        else if (key === "id") {

            tmpInput.type = "hidden";
            tmpLabel = "";
        }
        else if ((typeof key) === "number") {

            tmpInput.type = "number";
        }
        else {

            tmpInput.type = "text";
        }
        tmpInput.value = value;
        
        modalForm.appendChild(tmpDiv).append(tmpLabel, tmpInput);

    });

    modalButton.setAttribute(DATA_ATTR, info.id);
    modalButton.onclick = (e) => {

        //Constraint Validation API
        if (modalForm.checkValidity()) {

            //manual triggering of form submit event
            modalForm.dispatchEvent(new SubmitEvent('submit', {submitter: e.target}));
        }
    };
    modalButton.disabled = false;
}

/**
 * 
 * @param {Object} obj
 */
function addCard(obj) {
    
    let tmpCard = createCard();
    populateCard(tmpCard, obj);
    
    container.append(tmpCard);
}

function reservationsCleanup() {
    
    container.innerHTML = "";
    RESERVATIONS.clear();
}

/**
 * 
 * @param {string | undefined} date 
 */
function getReservations(date = undefined) {

    reservationsCleanup();

    let tmpUrl = BASE_URL;
    
    if (date !== undefined) {

        tmpUrl += `date/${date}`;
        containerTitle.textContent = date;
    }
    else {

        containerTitle.textContent = "All";
    }

    fetch(tmpUrl, {cache: "no-store"})
        .then((res) => {

            if (!res.ok) {

                throw new Error("Something went wrong!");
            }

            return res.json();
        })
        .then((arr) => {

            [...arr].forEach((item) => {

                RESERVATIONS.set(item.id, item);
                addCard(item);
            });
        })
        .catch((error) => {

            console.error(error);
        });
}

function refreshPage() {
    
    getReservations((search.value)? search.value : undefined);
}


//"static" event listeners set up

overlay.addEventListener("show.bs.modal", (e) => {

    let infoId = Number(e.relatedTarget.getAttribute(DATA_ATTR));

    fillInOverlay(RESERVATIONS.get(infoId));
});

modalForm.onsubmit = (e) => {

    let editID = e.submitter.getAttribute(DATA_ATTR);

    let tmpObj = {};
    (new FormData(modalForm)).forEach((value, key) => { tmpObj[key] = value });

    fetch(`${BASE_URL}${editID}`, {

        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(tmpObj)
    })
        .then((res) => {

            if (!res.ok) {

                throw new Error("Something went wrong!");
            }

            return res.text();
        })
        .then((text) => {

            console.log(text);
            refreshPage();
            bootstrapModalObj.hide();
        })
        .catch((error) => {

            console.error(error); 
        });
};

searchBtn.onclick = (e) => {

    refreshPage();
};

dropDbLink.onclick = (e) => {

    e.preventDefault();

    if (confirm("Are you sure?")) {

        fetch(BASE_URL, {method: 'DELETE'})
        .then((res) => res.text())
        .then((txt) => {

            console.log(txt);
            refreshPage();
        });
    }
};

dwlFullLink.onclick = (e) => {

    e.preventDefault();

    fetch(BASE_FILE_URL)
        .then((res) => res.blob())
        .then((blob) => {

            let tmpUrl = URL.createObjectURL(blob);

            let tmpLink = document.createElement("a");
            tmpLink.style = "display: hidden";
            tmpLink.href = tmpUrl;
            tmpLink.download = "full.csv";

            document.body.append(tmpLink);

            tmpLink.click();

            tmpLink.remove();
            URL.revokeObjectURL(tmpUrl);
        });
};

dwlTodayLink.onclick = (e) => {

    e.preventDefault();

    fetch(`${BASE_FILE_URL}?today=1`)
        .then((res) => res.blob())
        .then((blob) => {

            let tmpUrl = URL.createObjectURL(blob);

            let tmpLink = document.createElement("a");
            tmpLink.style = "display: hidden";
            tmpLink.href = tmpUrl;
            tmpLink.download = "today.csv";

            document.body.append(tmpLink);

            tmpLink.click();

            tmpLink.remove();
            URL.revokeObjectURL(tmpUrl);
        });
};

//initialization of cards
getReservations();