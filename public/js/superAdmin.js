//INICIALIZAÇÃO
// MENU MOBILE
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    menuToggle?.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', closeSidebar);

    // Fechar ao clicar em um link da sidebar (navegação)
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
});
let paginaAtual = 'dashboard';

document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    const perfil = sessionStorage.getItem('perfil');

    if (!token || perfil !== 'super') {
        window.location.href = '../index.html';
        return;
    }

    try {
        const dados = await api.verificarToken();
        document.getElementById('nomeUsuario').textContent = dados.nome || 'Super Admin';
        document.getElementById('avatarInicial').textContent = (dados.nome || 'S').charAt(0).toUpperCase();
        carregarDashboard();
        iniciarPollingNotificacoes();
    } catch (erro) {
        window.location.href = '../index.html';
    }
});

//NAVEGAÇÃO
document.querySelector('.sidebar-nav').addEventListener('click', (e) => {
    e.preventDefault();
    const link = e.target.closest('a');
    if (!link || !link.dataset.page) return;

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    const page = link.dataset.page;
    paginaAtual = page;
    switch (page) {
        case 'dashboard': carregarDashboard(); break;
        case 'aparelhos': carregarAparelhos(); break;
        case 'energia': carregarEnergia(); break;
        case 'jogos': carregarJogos(); break;
        case 'financeiro': carregarFinanceiro(); break;
        case 'user': window.location.href = "../superAdmin/register.html";
    }
    document.getElementById('pageTitle').textContent = link.textContent.trim();
});

//DASHBOARD
async function carregarDashboard() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const [aparelhos, energia, jogosHoje, ganhoHoje, ganhoSemana, ganhoMes, energiaRestante, contagemNotif] = await Promise.all([
            api.getAparelhos(),
            api.getEnergiaConfig(),
            api.getJogos(hoje),
            api.getGanhoDia(hoje),
            api.getGanhoSemana(),
            api.getGanhoMes(),
            api.getEnergiaRestante(),
            api.getContagemNotificacoes()
        ]);
        atualizarBadge(contagemNotif);

        const totalAparelhos = aparelhos.length;
        const precisamManutencao = aparelhos.filter(a => a.precisa_manutencao).length;
        const energiaClass =
          energia.total_disponivel_kwh < 20
            ? "low"
            : energia.total_disponivel_kwh < 50
              ? "mid"
              : "good";

        document.getElementById("contentArea").innerHTML = `
            <div class="stats-grid" style="margin-bottom:20px;">
                <div class="stat-card animate-fade-up">
                    <div class="card-icon icon-blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg></div>
                    <div class="card-value">${totalAparelhos}</div>
                    <div class="card-label">Total de Aparelhos</div>
                </div>
                <div class="stat-card animate-fade-up delay-1">
                    <div class="card-icon ${precisamManutencao > 0 ? "icon-danger" : "icon-green"}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg></div>
                    <div class="card-value">${precisamManutencao}</div>
                    <div class="card-label">Precisam de Manutenção</div>
                </div>
                <div class="stat-card animate-fade-up delay-2">
                    <div class="card-icon icon-green"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        <line x1="12" y1="12" x2="12" y2="12.01"/>
                    </svg></div>
                    <div class="card-value">${ganhoHoje.toLocaleString("pt-MZ")} MTS</div>
                    <div class="card-label">Ganho Hoje</div>
                </div>
                <div class="stat-card animate-fade-up delay-3">
                    <div class="card-icon icon-purple"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg></div>
                    <div class="card-value">${ganhoSemana.toLocaleString("pt-MZ")} MTS</div>
                    <div class="card-label">Ganho na Semana</div>
                </div>
            </div>

            <div class="energy-meter animate-fade-up delay-1" style="margin-bottom:20px;">
                <div class="energy-circle ${energiaClass}">
                    ${energia.total_disponivel_kwh}<small style="font-size:12px;display:block;">kWh</small>
                </div>
                <div class="card-label">Energia Restante</div>
                <div style="font-size:13px;color:var(--text-secondary);">Contador: ${energia?.numero_contador || "N/A"}</div>
            </div>

            <div class="table-container animate-fade-up delay-2">
                <div class="table-header"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg> Aparelhos com Manutenção Pendente</h3></div>
                <table>
                    <thead><tr><th>Nome</th><th>Status</th><th>Observação</th></tr></thead>
                    <tbody>
                        ${
                          aparelhos
                            .filter((a) => a.precisa_manutencao)
                            .map(
                              (a) => `
                            <tr>
                                <td>${a.nome}</td>
                                <td><span class="status-badge status-danger">Urgente</span></td>
                                <td>${a.observacao || "—"}</td>
                            </tr>
                        `,
                            )
                            .join("") ||
                          '<tr><td colspan="3" style="color:var(--text-secondary);text-align:center;">Nenhum pendente </td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}
// Reportes
async function enviarReporte() {
    const energiaKwh = parseInt(document.getElementById('reportEnergia')?.value) || 0;
    const aparelhoId = parseInt(document.getElementById('reporteAparelho')?.value) || null;
    const observacao = document.getElementById('reportObs')?.value || '';

    try {
        if (aparelhoId) {
            const aparelhos = await api.getAparelhos();
            const aparelho = aparelhos.find(a => a.id === aparelhoId);
            if (aparelho) {
                await api.editarAparelho(aparelhoId, { precisa_manutencao: true, status: 'atencao', observacao: observacao || aparelho.observacao });
            }
            if (energiaKwh > 0) {
                await api.definirTotalDisponivel(energiaKwh);
            }

            showToast("Reporte enviado com sucesso", 'info');

            const novacontagem = await api.getContagemNotificacoes();
            atualizarBadge(novacontagem);

            carregarDashboard();
        }
    } catch (erro) {
        showToast("Erro ao enviar reporte:",erro, 'danger')
    }
}

// APARELHOS
async function carregarAparelhos() {
    try {
        const aparelhos = await api.getAparelhos();

        document.getElementById("contentArea").innerHTML = `
            <div class="table-container animate-fade-up">
                <div class="table-header">
                    <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg> Gerenciar Aparelhos</h3>
                    <button class="btn btn-primary btn-sm" onclick="mostrarFormAparelho()">&plus; Novo</button>
                </div>
                <table>
                    <thead><tr><th>Nome</th><th>Tipo</th><th>Status</th><th>Manutenção</th><th>Uso (h)</th><th>Última Manut.</th><th>Ações</th></tr></thead>
                    <tbody>
                        ${aparelhos
                          .map(
                            (a) => `
                            <tr>
                                <td><strong>${a.nome}</strong></td>
                                <td>${a.tipo}</td>
                                <td><span class="status-badge ${a.status === "ok" ? "status-ok" : a.status === "warning" ? "status-warning" : "status-danger"}">${a.status}</span></td>
                                <td>${a.precisa_manutencao ? '<span class="status-badge status-danger">Sim</span>' : '<span class="status-badge status-ok">Não</span>'}</td>
                                <td>${a.uso_hoje || 0}h</td>
                                <td>${a.ultima_manutencao || "—"}</td>
                                <td>
                                    <button class="btn btn-outline btn-sm" onclick="editarAparelho(${a.id})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 20h9"/>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L5 21l-4 1 1-4 14.5-14.5z"/>
                                    </svg></button>
                                    <button class="btn btn-danger btn-sm" onclick="deletarAparelho(${a.id})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        <line x1="10" y1="11" x2="10" y2="17"/>
                                        <line x1="14" y1="11" x2="14" y2="17"/>
                                    </svg></button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

function mostrarFormAparelho(aparelho = null) {
    const editando = aparelho !== null;
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h3>${editando ? 'Editar' : 'Novo'} Aparelho</h3>
        <div class="form-group-modal">
            <label>Nome</label>
            <input type="text" id="apNome" value="${editando ? aparelho.nome : ''}">
        </div>
        <div class="form-group-modal">
            <label>Tipo</label>
            <select id="apTipo">
                <option value="Desktop" ${editando && aparelho.tipo === 'Desktop' ? 'selected' : ''}>Desktop</option>
                <option value="Console" ${editando && aparelho.tipo === 'Console' ? 'selected' : ''}>Console</option>
                <option value="Notebook" ${editando && aparelho.tipo === 'Notebook' ? 'selected' : ''}>Notebook</option>
            </select>
        </div>
        <div class="form-group-modal">
            <label>Status</label>
            <select id="apStatus">
                <option value="ok" ${editando && aparelho.status === 'ok' ? 'selected' : ''}>OK</option>
                <option value="warning" ${editando && aparelho.status === 'warning' ? 'selected' : ''}>Atenção</option>
                <option value="danger" ${editando && aparelho.status === 'danger' ? 'selected' : ''}>Crítico</option>
            </select>
        </div>
        <div class="form-group-modal">
            <label>Precisa de Manutenção?</label>
            <select id="apManutencao">
                <option value="false" ${editando && !aparelho.precisa_manutencao ? 'selected' : ''}>Não</option>
                <option value="true" ${editando && aparelho.precisa_manutencao ? 'selected' : ''}>Sim</option>
            </select>
        </div>
        <div class="form-group-modal">
            <label>Observação</label>
            <textarea id="apObs">${editando ? aparelho.observacao || '' : ''}</textarea>
        </div>
        <div class="modal-actions">
            <button class="btn btn-outline" onclick="fecharModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="salvarAparelho(${editando ? aparelho.id : 'null'})"> Salvar</button>
        </div>
    `;
    document.getElementById('modalOverlay').classList.remove('hidden');
}

async function salvarAparelho(id) {
    const dados = {
        nome: document.getElementById('apNome').value.trim(),
        tipo: document.getElementById('apTipo').value,
        status: document.getElementById('apStatus').value,
        precisa_manutencao: document.getElementById('apManutencao').value === 'true',
        observacao: document.getElementById('apObs').value
    };

    if (!dados.nome) {
        showToast('Nome é obrigatório', 'warning');
        return;
    }

    try {
        if (id && id !== 'null') {
            await api.editarAparelho(id, dados);
            showToast('Aparelho atualizado!', 'success');
        } else {
            await api.criarAparelho(dados);
            showToast('Aparelho cadastrado!', 'success');
        }
        fecharModal();
        carregarAparelhos();
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

function editarAparelho(id) {
    api.getAparelhos().then(aparelhos => {
        const aparelho = aparelhos.find(a => a.id === id);
        if (aparelho) mostrarFormAparelho(aparelho);
    });
}

async function deletarAparelho(id) {
    if (!confirm('Remover este aparelho permanentemente?')) return;
    try {
        await api.deletarAparelho(id);
        showToast('Aparelho removido', 'info');
        carregarAparelhos();
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

//ENERGIA 

async function ajustarEnergia() {
    const novoTotal = prompt("novo total em kwh:");
    if (novoTotal === null) return;
    const valor = parseFloat(novoTotal);
    if (isNaN(valor)) {
        showToast("Valor invalido", 'warning');
        return;
    }
    try {
        await api.definirTotalDisponivel(valor);
        showToast("Saldo de energia atualizado!", "sucess");
        carregarDashboard();
    } catch (erro) {
        showToast("Erro ao ajustar valor de energia" + erro.message, 'danger');
    }
}

async function carregarEnergia() {
    try {
        const [energia, recargas, restante] = await Promise.all([
          api.getEnergiaConfig(),
          api.getRecargas(),
          api.getEnergiaRestante(),
        //   api.definirTotalDisponivel(),
        ]);

        const EnergiaRestante = energia.total_disponivel_kwh;

        const energiaClass = EnergiaRestante < 20 ? 'low' : EnergiaRestante < 50 ? 'mid' : 'good';

        document.getElementById("contentArea").innerHTML = `
            <div class="energy-meter animate-fade-up" style="margin-bottom:20px;">
                <div class="energy-circle ${energiaClass}">
                    ${EnergiaRestante}<small style="font-size:12px;display:block;">kWh</small>
                </div>
                <div class="card-label">Energia Restante</div>
            </div>

            <div class="table-container animate-fade-up delay-1" style="margin-bottom:20px;">
                <div class="table-header"><h3>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg> Configuração do Credeleque</h3>
                </div>
                <div style="padding:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
                    <div class="form-group-modal" style="flex:1;min-width:200px;">
                        <label>Nº do Contador</label>
                        <input type="text" id="numContador" value="${energia?.numero_contador || ""}">
                    </div>
                    <button class="btn btn-primary" onclick="salvarContador()"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg> Salvar</button>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-2" style="margin-bottom:20px;">
                <div class="table-header"><h3>&plus; Registrar Recarga</h3></div>
                <div style="padding:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
                    <div class="form-group-modal" style="flex:1;min-width:120px;">
                        <label>kWh</label>
                        <input type="number" id="recKwh" placeholder="Ex: 50">
                    </div>
                    <div class="form-group-modal" style="flex:1;min-width:120px;">
                        <label>Valor Pago (MTS)</label>
                        <input type="number" id="recValor" placeholder="Ex: 2500">
                    </div>
                    <button class="btn btn-primary" onclick="registrarRecarga()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg> Registrar</button>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-3">
                <div class="table-header"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg> Histórico de Recargas</h3>
                </div>
                <table>
                    <thead><tr><th>Data</th><th>kWh</th><th>Valor Pago</th></tr></thead>
                    <tbody>
                        ${
                          recargas
                            .slice(0, 15)
                            .map(
                              (r) => `
                            <tr><td>${r.data}</td><td>${r.valor_kwh} kWh</td><td>${r.valor_pago.toLocaleString("pt-BR")} MTS</td></tr>
                        `,
                            )
                            .join("") ||
                          '<tr><td colspan="3" style="color:var(--text-secondary);text-align:center;">Nenhuma recarga</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

async function salvarContador() {
    const numero = document.getElementById('numContador')?.value.trim();
    if (!numero) {
        showToast('Informe o número do contador', 'warning');
        return;
    }
    if (numero < 0) {
        showToast("Os numeros devem ser positivos", "warning");
        return;
    }
    try {
        await api.atualizarContador(numero);
        showToast('Contador atualizado!', 'success');
        carregarEnergia();
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

async function registrarRecarga() {
    const kwh = parseFloat(document.getElementById('recKwh')?.value) || 0;
    const valorPago = parseFloat(document.getElementById('recValor')?.value) || 0;
    if (kwh <= 0 || valorPago <= 0) {
        showToast('Valores inválidos', 'warning');
        return;
    }
    try {
        await api.registrarRecarga(kwh, valorPago);
        showToast('Recarga registrada!', 'success');
        carregarEnergia();
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

//JOGOS
async function carregarJogos() {
    const hoje = new Date().toISOString().split('T')[0];
    try {
        const jogos = await api.getJogos(hoje);
        console.log(jogos)
        const arrayJogos = Array.isArray(jogos) ? jogos : (jogos? [jogos]: []);
        console.log(arrayJogos.length)
        console.log(Object.keys(jogos))
        console.log(arrayJogos)
        const total = arrayJogos.reduce((s, j) => s + parseFloat(j.total || j.quantidade * j.valor_por_jogo), 0);


        document.getElementById("contentArea").innerHTML = `
            <div class="stat-card animate-fade-up" style="margin-bottom:20px;">
                <div class="card-icon icon-green"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    <line x1="12" y1="12" x2="12" y2="12.01"/>
                    </svg>
                </div>
                <div class="card-value">${total.toLocaleString("pt-BR")} MTS</div>
                <div class="card-label">Ganho de Hoje (${hoje})</div>
            </div>
            <div class="table-container animate-fade-up delay-2">
                <div class="table-header"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg> Jogos de Hoje</h3>
                </div>
                <table>
                    <thead><tr><th>Jogo</th><th>Qtd</th><th>Valor</th><th>Total</th></tr></thead>
                    <tbody>
                        ${
                          arrayJogos
                            .map(
                              (j) => `
                            <tr>
                                <td>${j.jogo}</td>
                                <td>${j.quantidade}</td>
                                <td>${j.valor_por_jogo} MTS</td>
                                <td><strong>${(j.total || j.quantidade * j.valor_por_jogo).toLocaleString("pt-BR")} MTS</strong></td>
                            </tr>
                        `,
                            )
                            .join("") ||
                          '<tr><td colspan="4" style="color:var(--text-secondary);text-align:center;">Nenhum jogo hoje</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

//FINANCEIRO
async function carregarFinanceiro() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const [ganhoDia, ganhoSemana, ganhoMes, historico] = await Promise.all([
            api.getGanhoDia(hoje),
            api.getGanhoSemana(),
            api.getGanhoMes(),
            api.getHistoricoGanhos(30)
        ]);
        console.log(historico)

        document.getElementById("contentArea").innerHTML = `
            <div class="stats-grid" style="margin-bottom:20px;">
                <div class="stat-card animate-fade-up">
                    <div class="card-icon icon-green"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg></div>
                    <div class="card-value">${ganhoDia.toLocaleString("pt-BR")} MTS</div>
                    <div class="card-label">Hoje</div>
                </div>
                <div class="stat-card animate-fade-up delay-1">
                    <div class="card-icon icon-blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg></div>
                    <div class="card-value">${ganhoSemana.toLocaleString("pt-BR")} MTS</div>
                    <div class="card-label">Semana</div>
                </div>
                <div class="stat-card animate-fade-up delay-2">
                    <div class="card-icon icon-purple"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg></div>
                    <div class="card-value">${ganhoMes.toLocaleString("pt-BR")} MTS</div>
                    <div class="card-label">Mês</div>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-3">
                <div class="table-header"><h3> Histórico de Ganhos</h3></div>
                <table>
                    <thead><tr><th>Data</th><th>Ganho (MTS)</th></tr></thead>
                    <tbody>${
                      Array.isArray(historico) && historico.length > 0
                        ? historico
                            .map(
                              (h) => `
                            <tr>
                                <td>${h.data}</td>
                                <td><strong>${h.total.toLocaleString("pt-BR")} MTS</strong></td>
                            </tr>
                        `,
                            )
                            .join("")
                        : '<tr><td colspan="2" style="color:var(--text-secondary);">Sem dados</td></tr>'
                    }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

//NOTIFICAÇÕES
async function mostrarNotificacoes() {
    try {
        const notificacoes = await api.getNotificacoesNaoLidas();
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg> Notificações</h3>
            <div style="max-height:350px;overflow-y:auto;">
                ${
                  notificacoes.length > 0
                    ? notificacoes
                        .map(
                          (n) => `
                    <div style="padding:10px;border-left:3px solid ${n.tipo === "danger" ? "var(--danger)" : n.tipo === "warning" ? "var(--warning)" : "var(--accent)"};margin-bottom:8px;background:rgba(255,255,255,0.02);border-radius:6px;">
                        <div style="font-size:12px;color:var(--text-secondary);">${new Date(n.data_criacao).toLocaleString("pt-BR")}</div>
                        <div style="font-size:13px;">${n.mensagem}</div>
                    </div>
                `,
                        )
                        .join("")
                    : '<p style="color:var(--text-secondary);">Nenhuma notificação.</p>'
                }
            </div>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="fecharModal()">Fechar</button>
                ${notificacoes.length > 0 ? '<button class="btn btn-primary" onclick="marcarLidas()"> Marcar como Lidas</button>' : ""}
            </div>
        `;
        document.getElementById('modalOverlay').classList.remove('hidden');
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

async function marcarLidas() {
    try {
        await api.marcarNotificacoesLidas();
        fecharModal();
        atualizarBadge(0);
        showToast('Notificações marcadas como lidas', 'success');
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

function fecharModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

//UTILITÁRIOS
function showToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
        const icones = {
          success: "✅",
          warning: "⚠️",
          danger: "🔴",
          info: "ℹ️",
        };
    toast.innerHTML = `<span>${icones[tipo] || "ℹ️"}</span> ${mensagem}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function atualizarBadge(count) {
    const badge = document.getElementById('notifBadge');
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

async function iniciarPollingNotificacoes() {
    try {
        const contagem = await api.getContagemNotificacoes();
        atualizarBadge(contagem);
    } catch (e) {}


    setInterval(async () => {
        try {
            const contagem = await api.getContagemNotificacoes();
            atualizarBadge(contagem);
        } catch (e) {}
    }, 15000);
}

function logout() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}

document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
        fecharModal();
    }
});
