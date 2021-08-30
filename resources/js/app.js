import verifyUser from "./utils/verifyUser";

(async () => {
    const userInformation = await verifyUser();

    console.log(userInformation);

    const addExpensesButton = document.querySelector("#add_expenses");

    const addExpensesModal = document.querySelector("#add_expenses_modal");
    const addExpensesClose = addExpensesModal.querySelector("#add_expenses_close");

    const addExpensesForm = addExpensesModal.querySelector("form");
    const formMessage = addExpensesForm.querySelector(".form-message");
    const expensesName = addExpensesForm.querySelector("#expenses_name");
    const expensesAmount = addExpensesForm.querySelector("#expenses_amount");
    const expensesDate = addExpensesForm.querySelector("#expenses_date");

    const showModal = () => {
        addExpensesModal.classList.remove("hidden");
        addExpensesModal.classList.add("flex");
    };

    const hideModal = () => {
        addExpensesModal.classList.add("hidden");
        addExpensesModal.classList.remove("flex");
        formMessage.classList.add("hidden");
    };

    const showNotification = (message) => {
        formMessage.textContent = message;
        formMessage.classList.remove("hidden");
    };

    addExpensesClose.addEventListener("click", hideModal);
    addExpensesButton.addEventListener("click", showModal);

    addExpensesForm.onsubmit = () => {
        const name = expensesName.value;
        const amount = expensesAmount.value;
        const date = expensesDate.value;

        if (name === "" || amount === "" || date === "") {
            showNotification("Please fill in all the fields");
            return false;
        }

        const newExpense = {
            name,
            amount,
            date,
        };

        localStorage.setItem("expenses", JSON.stringify(newExpense));
        console.log(newExpense);

        hideModal();
        return newExpense;
    };
})();
