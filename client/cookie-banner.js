// Debugging starter
console.log("Script loaded!");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready!");
  
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");

  // Verify elements exist
  if (!banner || !acceptBtn || !rejectBtn) {
    console.error("Missing elements!", { banner, acceptBtn, rejectBtn });
    return;
  }

  // Check localStorage
  const agreement = localStorage.getItem("cookieAgreement");
  console.log("Current agreement:", agreement);

  // Hide banner if already agreed or rejected
  if (agreement === "accepted") {
    banner.style.display = "none";
    console.log("User already made a choice:", agreement);
    return;
  }

  // Button handlers
  acceptBtn.addEventListener("click", () => {
    console.log("Accept clicked");
    localStorage.setItem("cookieAgreement", "accepted");
    banner.style.display = "none";
  });

  rejectBtn.addEventListener("click", () => {
    console.log("Reject clicked");
    localStorage.setItem("cookieAgreement", "rejected");
    banner.style.display = "none";
  });
});
