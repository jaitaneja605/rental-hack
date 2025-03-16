import config from "../config";
import store from "../store";

const SimpleApiHandler = async (url, method, body, message = true) => {
  try {
    const response = await fetch(config.apiUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "POST" ? JSON.stringify(body) : null,
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error("Invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    if (message) {
      store.addMessage({
        type: "Success",
        content: data.message,
      });
    }

    return data;
  } catch (err) {
    store.addMessage({
      type: "Danger",
      content: err.message,
    });
    throw err;
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const data = await SimpleApiHandler(
      "users/refresh-access-token",
      "POST",
      { refreshToken },
      false
    );
    if (!data.data.accessToken) {
      throw new Error("Access token not found, please login");
    }
    sessionStorage.setItem("accessToken", data.data.accessToken);
    return data.data.accessToken;
  } catch (err) {
    store.addMessage({
      type: "Danger",
      content: err.message,
    });
    if (err.message.includes("Refresh token is expired")) {
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    throw err;
  }
};

const ApiHandler = async (url, method, body, message = true) => {
  try {
    let accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        store.addMessage({
          type: "Danger",
          content: "Refresh token not found, please login",
        });
        window.location.href = "/login";
        return;
      }

      try {
        accessToken = await refreshAccessToken(refreshToken);
      } catch (error) {
        throw new Error("Failed to refresh access token: " + error.message);
      }
    }

    const response = await fetch(config.apiUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: method === "POST" ? JSON.stringify(body) : null,
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error("Invalid JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    if (message) {
      store.addMessage({
        type: "Success",
        content: data.message,
      });
    }

    return data;
  } catch (err) {
    store.addMessage({
      type: "Danger",
      content: err.message,
    });
    throw err;
  }
};

export { SimpleApiHandler, ApiHandler };
