function mostrarMensaje() {
  alert("¡Prepárate para tu próxima aventura!");
}
const toggleDark = document.getElementById("toggleDark");

toggleDark.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});