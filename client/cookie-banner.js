document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");

  // Verify elements exist
  if (!banner || !acceptBtn || !rejectBtn) {
    console.error("Missing cookie banner elements!", { banner, acceptBtn, rejectBtn });
    return;
  }

  const agreement = localStorage.getItem("cookieAgreement");

  if (agreement === null || agreement === undefined) {
    banner.style.display = "block"; 
  } else {
    banner.style.display = "none";
    return;
  }

  // Button handlers
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieAgreement", "accepted");
    banner.style.display = "none";
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookieAgreement", "rejected");
    banner.style.display = "none";
  });
});