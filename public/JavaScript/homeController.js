document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("buttonLogIn");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      window.location.href = "logIn.html";
    });
  }

  const collectorButton = document.getElementById("buttonColector");
  if (collectorButton) {
    collectorButton.addEventListener("click", function () {
      window.location.href = "collectorApplication.html";
    });
  }
});

