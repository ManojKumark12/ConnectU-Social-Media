// apiFetch.js
import { useDispatch } from "react-redux";
import { store } from "./redux/store";
import { removeUser } from "./redux/user.slice";
import { toast } from "react-toastify";

export async function apiFetch(url, options = {}) {
  const state = store.getState();

  const token = state.user?.token || localStorage.getItem("access_token");

  let headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(url, { ...options, headers });

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
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${data.access}`,
        };
        response = await fetch(url, { ...options, headers: retryHeaders });
      } else {
        // Refresh failed → logout
        store.dispatch(removeUser());
        localStorage.removeItem("access_token");

        toast.error("Session expired. Please sign in again.");
        window.location.href = "/signin";
        return;
      }
    }

    if (!response.ok) {
      let errMsg = "Something went wrong";
      try {
        const errData = await response.json();
        errMsg = errData.error || JSON.stringify(errData);
      } catch {}

      toast.error(errMsg); 
         store.dispatch(removeUser());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
       window.location.href = "/signin";  // 🔴 Show error toast
      // throw new Error(errMsg);
    }


    return response;
  } catch (err) {
    console.error("apiFetch error:", err);
             store.dispatch(removeUser());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.error(err.message || "Network error"); // 🔴 Global catch toast
    window.location.href = "/signin"; 
  
  }
}
