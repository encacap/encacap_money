/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ (() => {

eval("(() => {\n    const addExpensesButton = document.querySelector(\"#add_expenses\");\n\n    const addExpensesModal = document.querySelector(\"#add_expenses_modal\");\n    const addExpensesClose = addExpensesModal.querySelector(\"#add_expenses_close\");\n\n    const addExpensesForm = addExpensesModal.querySelector(\"form\");\n    const formMessage = addExpensesForm.querySelector(\".form-message\");\n    const expensesName = addExpensesForm.querySelector(\"#expenses_name\");\n    const expensesAmount = addExpensesForm.querySelector(\"#expenses_amount\");\n    const expensesDate = addExpensesForm.querySelector(\"#expenses_date\");\n\n    const showModal = () => {\n        addExpensesModal.classList.remove(\"hidden\");\n        addExpensesModal.classList.add(\"flex\");\n    };\n\n    const hideModal = () => {\n        addExpensesModal.classList.add(\"hidden\");\n        addExpensesModal.classList.remove(\"flex\");\n        formMessage.classList.add(\"hidden\");\n    };\n\n    const showNotification = (message) => {\n        formMessage.textContent = message;\n        formMessage.classList.remove(\"hidden\");\n    };\n\n    addExpensesClose.addEventListener(\"click\", hideModal);\n    addExpensesButton.addEventListener(\"click\", showModal);\n\n    addExpensesForm.onsubmit = () => {\n        const name = expensesName.value;\n        const amount = expensesAmount.value;\n        const date = expensesDate.value;\n\n        if (name === \"\" || amount === \"\" || date === \"\") {\n            showNotification(\"Please fill in all the fields\");\n            return false;\n        }\n\n        const newExpense = {\n            name,\n            amount,\n            date,\n        };\n\n        localStorage.setItem(\"expenses\", JSON.stringify(newExpense));\n        console.log(newExpense);\n\n        hideModal();\n        return newExpense;\n    };\n})();\n\n\n//# sourceURL=webpack://encacap_money/./resources/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./resources/js/app.js"]();
/******/ 	
/******/ })()
;