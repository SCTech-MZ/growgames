async function Cadastrar() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("password").value;
  const nome = document.getElementById("nome").value;
  const btnLogin = document.getElementById("btnLogin");
  let errorMsg = document.getElementById("errorMsg");

  errorMsg.classList.remove("show");
  errorMsg.textContent = "";
  if (!email || !senha) {
    errorMsg.innerText = "Preencha nome, e-mail e senha";
    errorMsg.classList.add("show");
    return;
  }
  btnLogin.classList.add("loading");
  try {
    const res = await fetch(`${Api_base}/auth/cadastrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.erro ||
          "Erro ao cadastrar tente novamente",
      );
    }
    window.location.href = "../index.html";
  } catch (erro) {
    errorMsg.textContent = erro.message || "Erro de conexao. Tente novamente.";
    errorMsg.classList.add("show");
    btnLogin.classList.remove("loading");
  } finally {
    btnLogin.classList.remove("loading");
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    Cadastrar();
  }
});

const btnLogin = document
  .getElementById("btnLogin")
  .addEventListener("click", () => {
    Cadastrar();
  });
