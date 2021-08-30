export default class Validator {
    constructor(formSelector, options) {
        this.form = document.querySelector(formSelector);
        this.inputs = this.form.querySelectorAll("[name]:not(ion-icon)");
        this.options = options;

        this.initialize.call(this);
        this.validate.bind(this);
    }

    initialize() {
        const { inputs, form } = this;
        const { autofocus } = this.options;

        inputs.forEach((input) => {
            const formGroup = input.closest(".form-group");

            input.onfocus = () => {
                formGroup.classList.add("typing");
            };

            input.onblur = () => {
                formGroup.classList.remove("typing");
                this.validateInput(`#${input.id}`);
            };

            input.oninput = () => {
                this.clearError(input);
            };

            if (autofocus) {
                if (input.matches(autofocus)) {
                    input.focus();
                }
            }
        });

        form.onsubmit = (event) => this.handleSubmit(event);
    }

    required(message) {
        return (value) => (value?.trim?.().length > 0 ? undefined : message || "Required");
    }

    min(length, message) {
        return (value) =>
            value?.trim?.().length >= length ? undefined : message || `Must be at least ${length} characters`;
    }

    max(length, message) {
        return (value) =>
            value?.trim?.().length <= length ? undefined : message || `Must be at most ${length} characters`;
    }

    showError(input, errorMessage) {
        const formGroup = input.closest(".form-group");
        const formMessage = formGroup.querySelector(".form-message");

        formGroup.classList.add("invalid");
        formMessage.textContent = errorMessage;
    }

    clearError(input) {
        const formGroup = input.closest(".form-group");
        const formMessage = formGroup.querySelector(".form-message");

        formGroup.classList.remove("invalid");
        formMessage.textContent = "";
    }

    validate(rules) {
        const testFunctions = {};

        Object.keys(rules).forEach((inputSelector) => {
            const inputRules = rules[inputSelector];

            if (!Array.isArray(testFunctions[inputSelector])) {
                testFunctions[inputSelector] = [];
            }

            inputRules.forEach((ruleOptions) => {
                let rule, message;
                let validateFunction;

                if (typeof ruleOptions === "string") {
                    rule = ruleOptions;
                } else {
                    rule = ruleOptions.rule;
                    message = ruleOptions.message;
                }

                if (rule.includes(":")) {
                    const [ruleName, ruleValue] = rule.split(":");
                    validateFunction = this[ruleName](ruleValue, message);
                } else {
                    validateFunction = this[rule](message);
                }

                testFunctions[inputSelector].push(validateFunction);
            });
        });

        this.rules = testFunctions;
    }

    validateInput(inputSelector) {
        const input = this.form.querySelector(inputSelector);
        const rules = this.rules[inputSelector];

        if (!rules) {
            return true;
        }

        let errorMessage;

        rules.forEach((rule) => {
            if (errorMessage) {
                return;
            }
            errorMessage = rule(input.value.trim());
        });

        if (errorMessage) {
            this.showError(input, errorMessage);
        }

        return !errorMessage;
    }

    handleSubmit(event) {
        const { inputs } = this;
        let isSuccess = true;
        let data = {};

        event.preventDefault();

        inputs.forEach((input) => {
            const inputName = input.name;
            const isError = this.validateInput(`#${inputName}`);
            let value;

            if (isSuccess && !isError) {
                isSuccess = false;
            }

            if (input.type === "checkbox") {
                value = input.checked;
            } else {
                value = input.value?.trim();
            }

            data[inputName] = {
                value,
                disabled: input.disabled,
            };
        });

        if (!isSuccess) {
            return;
        }

        console.log(data);
    }
}
