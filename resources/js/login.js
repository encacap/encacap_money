import Form from "./form";
import axios from "axios";

(() => {
    window.localStorage.removeItem("userConfigs");

    const form = new Form("#login", {
        autofocus: "#username",
    });

    const showUnexpectedError = () => {
        form.showError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!");
    };

    form.validate({
        "#username": [
            { rule: "required", message: "Tên đăng nhập không được phép để trống" },
            { rule: "min:6", message: "Tên đăng nhập hoặc Email yêu cầu tối thiểu 6 ký tự" },
            "max:20",
        ],
        "#password": ["required", "min:6", "max:20"],
    });

    form.submit = async (data) => {
        const body = {
            data: {
                attributes: {
                    username: data.username.value,
                    password: data.password.value,
                },
            },
        };

        form.showLoading();
        form.disabled();

        try {
            const response = await axios.post("http://localhost:3000/auth/login", body);
            const { data } = response.data;
            const { token, refreshToken } = data.attributes;

            window.localStorage.setItem(
                "userConfigs",
                JSON.stringify({
                    token,
                    refreshToken,
                })
            );

            window.location.href = "/";
        } catch (error) {
            if (error.response) {
                const { data } = error.response;

                if (data) {
                    const [{ code, source }] = data.errors;
                    let inputFocusSelector = "";

                    if (code === "ERR_AUTH_NOT_EXISTS") {
                        form.showError("#username", "Tên đăng nhập không tồn tại");
                        inputFocusSelector = "#username";
                    } else if (code === "ERR_AUTH_INCORECT") {
                        if (source.pointer.includes("username")) {
                            inputFocusSelector = "#username";
                        } else {
                            inputFocusSelector = "#password";
                        }
                        form.showError("Tên đăng nhập hoặc mật khẩu không chính xác.");
                    } else {
                        showUnexpectedError();
                        return;
                    }

                    form.hideLoading();
                    form.abled();
                    form.focus(inputFocusSelector);
                } else {
                    showUnexpectedError();
                }
            } else {
                showUnexpectedError();
            }
        }
    };
})();
