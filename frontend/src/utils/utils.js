export function explainError(err) {
  // if (!navigator.onLine) return "No internet connection.";
  if (!err.response) return "Couldn't reach the server. Try again later.";

  const messages = {
    400: "Something's wrong with the request. Please check your input.",
    401: "Incorrect credentials.",
    403: "You don't have permission to do this.",
    404: "We couldn't find what you're looking for.",
    409: "This already exists.",
    429: "Too many attempts. Please slow down.",
    500: "Something went wrong on our end. Try again later.",
    502: "Couldn't access the backend. Try again later.",
    503: "Service is temporarily unavailable.",
  };

  return messages[err.response.status] ?? err.message;
};