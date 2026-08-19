export const saveAuth = (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("admin_user", JSON.stringify(data.user));
};

export const getToken = () => {
    return localStorage.getItem("access_token");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("admin_user");

    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin_user");
};

export const isAuthenticated = () => {
    return !!getToken();
};