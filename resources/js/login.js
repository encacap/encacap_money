import Form from "./form";
import axios from "axios";

(() => {
    const validator = new Form("#login", {
        autofocus: "#username",
    });

    validator.validate({
        "#username": [
            { rule: "required", message: "Tên đăng nhập không được phép để trống" },
            { rule: "min:6", message: "Tên đăng nhập hoặc Email yêu cầu tối thiểu 6 ký tự" },
            "max:20",
        ],
        "#password": ["required", "min:6", "max:20"],
    });

    validator.submit = async (data) => {
        const body = {
            data: {
                attributes: {
                    username: data.username.value,
                    password: data.password.value,
                },
            },
        };

        try {
            const response = await axios.post("http://localhost:3000/auth/login", body);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    validator.showGlobalError("Tên đăng nhập hoặc mật khẩu không chính xác.");
                } else if (status === 404) {
                    validator.showError("username", "Tên đăng nhập hoặc Email không tồn tại.");
                }
            }
        }
    };
})();
