const token = new URLSearchParams(window.location.search).get('token');

document.getElementById("successButton").addEventListener("click", function () {
  window.location.href = "logIn.html";
});

document.getElementById("resetForm").addEventListener('submit', async (e) => {
  e.preventDefault();

  const passwordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("newPasswordConfirmation");

  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!password || !confirmPassword) {
    const missingDataModal = new bootstrap.Modal(document.getElementById("missingData"));
    missingDataModal.show();
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    const invalidPasswordModal = new bootstrap.Modal(document.getElementById("invalidPassword"));
    invalidPasswordModal.show();
    return;
  }

  if (password !== confirmPassword) {
    const dontMatchModal = new bootstrap.Modal(document.getElementById("doesntMatch"));
    dontMatchModal.show();
    return;
  }

  try {
    const response = await fetch("../backend/resetPassword.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });

    const data = await response.json();

    if (data.success) {
      const successModal = new bootstrap.Modal(document.getElementById("success"));
      successModal.show();
    }
  } catch (err) {
    console.log(err);
  }
});
