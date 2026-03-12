/**
 * Toggle de modo oscuro (persistente).
 *
 * Requiere que Tailwind esté configurado con `darkMode: "class"` y que el HTML
 * tenga un botón con id `toggleDark`.
 */

/** @type {HTMLButtonElement | null} */
const toggleDark = document.getElementById("toggleDark");

const THEME_KEY = "theme";
const root = document.documentElement;

/**
 * Aplica el tema y persiste la preferencia si es posible.
 * @param {"light" | "dark"} nextTheme
 * @returns {void}
 */
function setTheme(nextTheme) {
  root.classList.toggle("dark", nextTheme === "dark");
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch {
    // Ignorar fallos de localStorage (modo privado/cuota)
  }
  toggleDark?.setAttribute("aria-pressed", String(nextTheme === "dark"));
}

const initialTheme = (() => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // ignore
  }
  return root.classList.contains("dark") ? "dark" : "light";
})();

setTheme(initialTheme);

toggleDark?.addEventListener("click", () => {
  setTheme(root.classList.contains("dark") ? "light" : "dark");
});

