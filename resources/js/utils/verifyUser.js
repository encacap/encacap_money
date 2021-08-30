export default async () => {
    const userConfigs = localStorage.getItem("userConfigs");

    if (!userConfigs?.token) window.location.href = "/accounts/login";
};
