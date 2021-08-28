import Validator from "./validator";

(() => {
    const validator = new Validator("#login", {});

    validator.validate({
        "#username": [
            { rule: "required", message: "Tên đăng nhập không được phép để trống" },
            { rule: "min:6", message: "Tên đăng nhập hoặc Email yêu cầu tối thiểu 6 ký tự" },
            "max:20",
        ],
        "#password": ["required", "min:6", "max:20"],
    });
})();
