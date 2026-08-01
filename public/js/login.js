async function fazerLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value;
    const btnLogin = document.getElementById('btnLogin');
    let errorMsg = document.getElementById('errorMsg');

    errorMsg.classList.remove('show');
    errorMsg.textContent = '';
    if (!email || !senha) {
        errorMsg.innerText = 'Preencha e-mail e senha';
        errorMsg.classList.add('show');
        return;
    }
    btnLogin.classList.add('loading');
        try {
          const res = await fetch(`${Api_base}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
          });
          const data = await res.json();

          if (!res.ok){
            throw new Error(
              data.erro ||
                "Erro ao fazer login verifique seus dados e tente novamente",
              );
              localStorage.setItem('!res.ok',data.erro)
          }

          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("perfil", data.usuario.perfil);
          sessionStorage.setItem("usuarioNome", data.usuario.nome);
          sessionStorage.setItem("usuarioEmail", data.usuario.email);

          if (data.usuario.perfil === "super") {
            window.location.href = "superAdmin/dashboard.html";
          } else {
            window.location.href = "admin/dashboard.html";
          }
        } catch (erro) {
            localStorage.setItem('catcherror',erro.message)
          errorMsg.textContent =
            erro.message || "Erro de conexao. Tente novamente.";
          errorMsg.classList.add("show");
          btnLogin.classList.remove("loading");
        } finally {
          btnLogin.classList.remove("loading");
        }

}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        fazerLogin();
    }
})


const btnLogin = document.getElementById("btnLogin").addEventListener('click', () => {
    fazerLogin();
})    
    
// (function () {
// const token = sessionStorage.getItem('token');
// const perfil = sessionStorage.getItem('perfil');
//     if (token && perfil) {
//         if (perfil === "super") {
//             window.location.href = "superAdmin/dashboard.html";
//         } else {
//             window.location.href = "admin/dashboard.html";
//         }
//     }
// })();
