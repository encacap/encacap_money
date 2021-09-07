import verifyUser from "./utils/verifyUser";
import axios from "axios";
import API from "./configs/api";

(async () => {
    const verifiedToken = await verifyUser();
    const requestHeaders = {
        Authorization: `Bearer ${verifiedToken}`,
    };
    const requestConfigs = {
        headers: requestHeaders,
    };

    const getWeekNumber = (date) => {
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
    };

    const getSunday = (date) => {
        const dayOfWeek = date.getDay() || 7;
        const year = date.getFullYear();
        const month = date.getMonth();
        const DAYS_IN_WEEK = 7;
        return new Date(year, month, date.getDate() - dayOfWeek + DAYS_IN_WEEK);
    };

    const render = (data) => {
        const container = document.querySelector("#container");
        let totalAmount = 0;

        container.innerHTML = ` 
            <div class="w-full border-2 border-gray-100 rounded-lg px-3 py-5">
                <div class="mb-2 px-3">
                    <span
                        class="
                            text-xs
                            font-semibold
                            inline-block
                            py-1
                            px-2
                            rounded-full
                            text-indigo-600
                            bg-indigo-200
                            uppercase
                            last:mr-0
                            mr-1
                        "
                    >
                        2021
                    </span>
                    <h3 class="mt-2 font-semibold text-indigo-600">Tuần 36: 06/09 - 12/09</h3>
                </div>
                <ul class="border-t-2 border-transparent py-2">
                ${data
                    .map((item) => {
                        const { attributes } = item;
                        const { paymentDate, name, amount } = attributes;
                        totalAmount += amount;
                        return `
                            <li class="px-3 py-1 hover:bg-gray-100 hover:cursor-pointer rounded-md">
                                <span class="font-semibold">09</span> - ${name}: ${amount}
                            </li>
                        `;
                    })
                    .join("")}
                </ul>
                <h4 class="pt-2 px-3 font-semibold text-indigo-600">Tổng cộng: ${totalAmount}</h4>
            </div>
        `;
    };

    let payments;

    const currentDate = new Date();
    const currentWeekNumber = getWeekNumber(currentDate);
    const currentSunday = getSunday(currentDate);

    const dateFrom = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const dateTo = `${currentSunday.getFullYear()}-${currentSunday.getMonth() + 1}-${currentSunday.getDate()}`;

    try {
        const response = await axios.get(`${API.gateway}/money/${dateFrom}/${dateTo}`, requestConfigs);
        payments = response.data;
    } catch (error) {
        // console.log(error);
    }

    render(payments.data);

    // Add expenses modal

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

    addExpensesForm.onsubmit = async (e) => {
        e.preventDefault();

        const name = expensesName.value;
        const amount = expensesAmount.value;
        const date = expensesDate.value;

        if (name === "" || amount === "" || date === "") {
            showNotification("Please fill in all the fields");
            return false;
        }

        try {
            await axios.post(
                `${API.gateway}/money`,
                {
                    data: {
                        attributes: {
                            name,
                            amount,
                            paymentDate: date,
                        },
                    },
                },
                requestConfigs
            );
        } catch (error) {
            console.log(error);
        }

        hideModal();
        return undefined;
    };
})();
