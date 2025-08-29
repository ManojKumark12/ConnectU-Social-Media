// apiFetch.js
import { useDispatch } from "react-redux";
import { store } from "./redux/store";
import { removeUser } from "./redux/user.slice";
import { toast } from "react-toastify";

export async function apiFetch(url, options = {}) {
  const state = store.getState();
  const token = state.user?.token || localStorage.getItem("access_token");

  // Setting up headers
  let headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  // Setting the content type if it's not a FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(url, { ...options, headers });

    // If the response is 401 (unauthorized), refresh the token
    if (response.status === 401) {
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refresh: localStorage.getItem("refresh_token"),
          }),
        }
      );

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();

        // Update the access token in the state and localStorage
        store.dispatch({
          type: "user/setToken",  // Assuming you have an action to store the new token
          payload: data.access,
        });
        localStorage.setItem("access_token", data.access);

        // Retry the original request with the new token
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${data.access}`,
        };
        response = await fetch(url, { ...options, headers: retryHeaders });
      } else {
        // Refresh failed → log out the user and clear the session
        store.dispatch(removeUser());
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        toast.error("Session expired. Please sign in again.");
        window.location.href = "/signin"; // Redirect to sign-in
        return;
      }
    }

    // If response is not okay, handle it
    if (!response.ok) {
      let errMsg = "Something went wrong";
      try {
        const errData = await response.json();
        errMsg = errData.error || JSON.stringify(errData);
      } catch (error) {
        console.error("Error parsing error response", error);
      }

      toast.error(errMsg); 
      store.dispatch(removeUser());
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/signin"; // Redirect to sign-in
      return;
    }

    // Return the response if everything is okay
    return response;

  } catch (err) {
    
    store.dispatch(removeUser());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.error(err.message || "Network error"); // Global catch toast
    window.location.href = "/signin"; // Redirect to sign-in
  }
}
