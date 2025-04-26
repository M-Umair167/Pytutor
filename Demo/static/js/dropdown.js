document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.querySelector(".avatar");
  const dropdown = document.getElementById("dropdownMenu");

  // Toggle dropdown when avatar is clicked
  avatar.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents the click from bubbling up to window
    dropdown.classList.toggle("show");
  });

  // Hide dropdown when clicking outside
  window.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });
});
