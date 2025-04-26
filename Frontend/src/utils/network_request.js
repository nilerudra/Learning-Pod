import axios from "axios";

async function networkRequest(
  url,
  handleResponse,
  requestType = "get",
  data = null,
  isFileUpload = false, // Flag to indicate if the request is a file upload
  customHeaders = {}
) {
  // Set up headers
  const headers = {
    Authorization: localStorage.getItem("access_token") || "",
    ...customHeaders,
  };

  if (isFileUpload) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  try {
    let response;

    // Execute the appropriate request based on type
    if (requestType.toLowerCase() === "post") {
      response = await axios.post(url, data, { headers });
    } else if (requestType.toLowerCase() === "get") {
      const params =
        data && typeof data === "object"
          ? new URLSearchParams(data).toString()
          : "";
      const fullUrl = params ? `${url}?${params}` : url;
      response = await axios.get(fullUrl, { headers });
    } else {
      throw new Error(
        "Unsupported request type. Only GET and POST are allowed."
      );
    }

    // Handle the response
    if (response.data && response.data["status"] === "ok") {
      handleResponse(response.data);
    } else {
      console.error(
        "Error in response:",
        response.data?.["message"] || "Unknown error"
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      let errorMessage =
        error.response.data?.["message"] || "An unknown error occurred";
      if (typeof errorMessage === "object") {
        errorMessage = JSON.stringify(errorMessage);
      }

      console.error("Axios error:", errorMessage);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

export { networkRequest };
