const Api_base = "https://growgames.onrender.com/api";

function getToken() {
  return sessionStorage.getItem("token");
}

function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-Type');
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Resposta nao e json")
  }

  if (response.status === 401) {
    sessionStorage.clear();
    window.location.href = "../index.html";
    throw new Error("Sessão expirada");
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ erro: "Erro desconhecido" }));
    throw new Error(error.erro || "Erro na requisição");
  }
  if (response.status === 204) {
    return null;
  }
  try {
    return response.json();
    
  } catch (erro) {
    throw new Error("Resposta invalida do back");
  }
}

const api = {
  // Auth
  async verificarToken() {
      const res = await fetch(`${Api_base}/auth/verificar`, {headers: getHeaders(),}); 
    return handleResponse(res);
  },

  // Aparelhos
  async getAparelhos() {
    const response = await fetch(`${Api_base}/aparelhos`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async criarAparelho(dados) {
    const response = await fetch(`${Api_base}/aparelhos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dados),
    });
    return handleResponse(response);
  },

  async editarAparelho(id, dados) {
    const response = await fetch(`${Api_base}/aparelhos/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(dados),
    });
    return handleResponse(response);
  },

  async deletarAparelho(id) {
    const response = await fetch(`${Api_base}/aparelhos/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (response.status === 204) return;
    return handleResponse(response);
  },

  // Energia
  async definirTotalDisponivel(data) {
    const response = await fetch(`${Api_base}/energia/definir-total`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ data })
    });
    return handleResponse(response);
  },
  async getEnergiaConfig() {
    const response = await fetch(`${Api_base}/energia/configuracao`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async atualizarContador(numero) {
    const response = await fetch(`${Api_base}/energia/contador`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ numero }),
    });
    return handleResponse(response);
  },

  async registrarRecarga(kwh, valor_pago) {
    const response = await fetch(`${Api_base}/energia/recargas`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ kwh, valor_pago }),
    });
    return handleResponse(response);
  },

  async getRecargas() {
    const response = await fetch(`${Api_base}/energia/recargas`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getEnergiaRestante() {
    const response = await fetch(`${Api_base}/energia/restante`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.restante;
  },

  async getJogos(data) {
    const response = await fetch(`${Api_base}/jogos?data=${data}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async registrarJogo(dados) {
    const response = await fetch(`${Api_base}/jogos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dados),
    });
    return handleResponse(response);
  },

  async deletarJogo(id) {
    const response = await fetch(`${Api_base}/jogos/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (response.status === 204) return;
    return handleResponse(response);
  },

  // Financeiro
  async getGanhoDia(data) {
    const response = await fetch(`${Api_base}/financeiro/dia?data=${data}`, {
      headers: getHeaders(),
    });
    const dados = await handleResponse(response);
    return dados.ganho;
  },

  async getGanhoSemana() {
    const response = await fetch(`${Api_base}/financeiro/semana`, {
      headers: getHeaders(),
    });
    const dados = await handleResponse(response);
    return dados.ganho;
  },

  async getGanhoMes() {
    const response = await fetch(`${Api_base}/financeiro/mes`, {
      headers: getHeaders(),
    });
    const dados = await handleResponse(response);
    return dados.ganho;
  },

  async getHistoricoGanhos(limite = 30) {
    const response = await fetch(
      `${Api_base}/financeiro/historico?limite=${limite}`,
      { headers: getHeaders() },
    );
    return handleResponse(response);
  },

  // Notificações
  async getNotificacoesNaoLidas() {
    const response = await fetch(`${Api_base}/notificacoes?naoLidas=true`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async marcarNotificacoesLidas() {
    const response = await fetch(`${Api_base}/notificacoes/marcar-lidas`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getContagemNotificacoes() {
    const response = await fetch(`${Api_base}/notificacoes/contagem`, {
      headers: getHeaders(),
    });
    const dados = await handleResponse(response);
    return dados.contagem;
  },

  // Atividades
  async getAtividadesRecentes(limite = 10) {
    const response = await fetch(`${Api_base}/atividades?limite=${limite}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
