export default class Validator {
    constructor(formSelector, options) {
        this.form = document.querySelector(formSelector);
        this.inputs = this.form.querySelectorAll("[name]:not(ion-icon)");
        this.buttons = this.form.querySelectorAll("button");
        this.error = this.form.querySelector(".form-error");
        this.options = options;
        this.disabledInputs = [];

        this.initialize.call(this);
        this.validate.bind(this);
        // this.disabled.bind(this);
    }

    initialize() {
        const { inputs, form } = this;
        const { autofocus } = this.options;

        inputs.forEach((input) => {
            const formGroup = input.closest(".form-group");

            if (input.disabled) {
                const { name } = input;
                this.disabledInputs.push(name);
            }

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

    getNodeFromSelector(selector) {
        let input = selector;
        if (typeof selector === "string") {
            input = this.form.querySelector(selector);

            if (!input) {
                throw Error(`No input found for selector: ${selector}`);
            }
        }
        return input;
    }

    showGlobalError(message) {
        const { error: errorNode } = this;

        errorNode.textContent = message;
        errorNode.classList.add("show");
    }

    clearGlobalError() {
        this.error.classList.remove("show");
    }

    showError(selector, message) {
        if (!message && selector) {
            message = selector;
            selector = null;
        }

        if (!selector) {
            this.showGlobalError(message);
            return;
        }

        const input = this.getNodeFromSelector(selector);

        const formGroup = input.closest(".form-group");
        const formMessage = formGroup.querySelector(".form-message");

        formGroup.classList.add("invalid");
        formMessage.textContent = message;
    }

    clearError(selector) {
        if (!selector) {
            this.clearGlobalError();
            return;
        }

        const input = this.getNodeFromSelector(selector);
        const formGroup = input.closest(".form-group");
        const formMessage = formGroup.querySelector(".form-message");

        formGroup.classList.remove("invalid");
        formMessage.textContent = "";
    }

    showLoading(selector) {
        if (!selector) {
            this.form.classList.add("loading");
            return;
        }

        const input = this.getNodeFromSelector(selector);
        input.classList.add("loading");
    }

    hideLoading(selector) {
        if (!selector) {
            this.form.classList.remove("loading");
            return;
        }

        const input = this.getNodeFromSelector(selector);

        input?.classList.remove("loading");
    }

    disabled(selector) {
        if (!selector) {
            this.disabledAllInputs();
            return;
        }

        const input = this.getNodeFromSelector(selector);
        input.disabled = true;
    }

    abled(selector) {
        if (!selector) {
            this.disabledAllInputs(false);
            return;
        }

        const input = this.getNodeFromSelector(selector);
        input.disabled = false;
    }

    disabledAllInputs(disabled = true) {
        this.inputs.forEach((input) => {
            const { name } = input;
            if (!this.disabledInputs.includes(name)) {
                input.disabled = disabled;
            }
        });

        this.buttons.forEach((button) => {
            const { name } = button;
            if (!this.disabledInputs.includes(name)) {
                button.disabled = disabled;
            }
        });
    }

    focus(selector) {
        if (!selector) return;

        const input = this.getNodeFromSelector(selector);
        input.focus();
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

    validateInput(selector) {
        const input = this.form.querySelector(selector);
        const rules = this.rules[selector];

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

        if (typeof this.submit === "function") {
            this.submit(data);
            return;
        }

        this.form.submit();
    }
}
