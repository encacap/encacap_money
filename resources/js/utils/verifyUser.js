import axios from "axios";
import API from "../configs/api";

export default async () => {
    const userConfigs = JSON.parse(localStorage.getItem("userConfigs"));

    if (!userConfigs?.token) {
        window.location.href = "/accounts/login";
        return undefined;
    }

    const { token } = userConfigs;

    try {
        await axios.get(`${API.gateway}/user/verify`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        const { data } = error.response;

        if (data) {
            const { code } = data.errors[0];

            if (code === "ERR_AUTH_TOKEN_EXPIRED") {
                // Refresh Token
            } else {
                window.location.href = "/accounts/login";
            }
        }

        return undefined;
    }

    return token;
};
