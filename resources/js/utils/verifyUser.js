import axios from "axios";
import API from "../configs/api";

const refreshToken = async (tokenRefresh) => {
    try {
        const response = await axios.post(`${API.gateway}/auth/token/refresh`, {
            data: {
                attributes: {
                    refreshToken: tokenRefresh,
                },
            },
        });

        const { data } = response.data;

        return data.attributes.token;
    } catch (error) {
        console.log(error);
    }
};

export default async () => {
    const userConfigs = JSON.parse(localStorage.getItem("userConfigs"));

    if (!userConfigs?.token) {
        window.location.href = "/accounts/login";
        return undefined;
    }

    const { token, refreshToken: tokenRefresh } = userConfigs;

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
                const newToken = await refreshToken(tokenRefresh);

                userConfigs.token = newToken;
                window.localStorage.setItem("userConfigs", JSON.stringify(userConfigs));

                return newToken;
            } else {
                window.location.href = "/accounts/login";
            }
        }

        window.location.href = "/accounts/login";
    }

    return token;
};
