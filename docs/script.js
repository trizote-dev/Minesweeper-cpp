let LINHAS = 8;
let COLUNAS = 8;
let TOTAL_MINAS = 10;
let tempoInicio = null;
let jogoComecou = false;
let intervaloCronometro = null;
let nomeJogador = "";

const fases = [
  { numero: 1, linhas: 8,  colunas: 8,  minas: 10, tempoLimite: 60 },
  { numero: 2, linhas: 10, colunas: 10, minas: 18, tempoLimite: 55 },
  { numero: 3, linhas: 12, colunas: 12, minas: 28, tempoLimite: 50 },
  { numero: 4, linhas: 14, colunas: 14, minas: 40, tempoLimite: 45 },
];

let faseAtual = 0;

function atualizarVariaveisDaFase() {
  const dadosFase = fases[faseAtual];
  LINHAS = dadosFase.linhas;
  COLUNAS = dadosFase.colunas;
  TOTAL_MINAS = dadosFase.minas;
}

function iniciarFase() {
    atualizarVariaveisDaFase();
    criarMatrizes();
    gerarMinas();
    criarTabuleiroVisual();
}

let minas = [];
let aberta = [];
let marcada = [];

const tabuleiroElemento = document.getElementById("tabuleiro");

function criarMatrizes() {
    minas = [];
    aberta = [];
    marcada = [];
    for (let i = 0; i < LINHAS; i++) {
        minas.push(new Array(COLUNAS).fill(false));
        aberta.push(new Array(COLUNAS).fill(false));
        marcada.push(new Array(COLUNAS).fill(false));
    }
}

function gerarMinas() {
    let minasColocadas = 0;
    while (minasColocadas < TOTAL_MINAS) {
        const linha = Math.floor(Math.random() * LINHAS);
        const coluna = Math.floor(Math.random() * COLUNAS);

        if (!minas[linha][coluna]) {
            minas[linha][coluna] = true;
            minasColocadas++;
        }
    }
}

function contarMinasVizinhas(linha, coluna) {
    let contador = 0;

    for (let dl = -1; dl <= 1; dl++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dl === 0 && dc === 0) continue;

            const novaLinha = linha + dl;
            const novaColuna = coluna + dc;

            if (novaLinha >= 0 && novaLinha < LINHAS && novaColuna >= 0 && novaColuna < COLUNAS) {
                if (minas[novaLinha][novaColuna]) {
                    contador++;
                }
            }
        }
    }

    return contador;
}

function abrirCelula(linha, coluna) {
    if (linha < 0 || linha >= LINHAS || coluna < 0 || coluna >= COLUNAS) {
        return;
    }
    if (aberta[linha][coluna]) {
        return;
    }
    if (minas[linha][coluna]) {
        return;
    }

    aberta[linha][coluna] = true;

    const numero = contarMinasVizinhas(linha, coluna);

    if (numero === 0) {
        abrirCelula(linha - 1, coluna);
        abrirCelula(linha + 1, coluna);
        abrirCelula(linha, coluna - 1);
        abrirCelula(linha, coluna + 1);
        abrirCelula(linha - 1, coluna - 1);
        abrirCelula(linha - 1, coluna + 1);
        abrirCelula(linha + 1, coluna - 1);
        abrirCelula(linha + 1, coluna + 1);
    }
}

function verificarVitoria() {
    for (let i = 0; i < LINHAS; i++) {
        for (let j = 0; j < COLUNAS; j++) {
            if (!minas[i][j] && !aberta[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function revelarMinas() {
    const celulas = document.querySelectorAll(".celula");
    celulas.forEach(celula => {
        const linha = parseInt(celula.dataset.linha);
        const coluna = parseInt(celula.dataset.coluna);
        if (minas[linha][coluna]) {
            celula.classList.add("mina");
            celula.textContent = "💣";
        }
    });
}

function atualizarVisual() {
    const celulas = document.querySelectorAll(".celula");
    celulas.forEach(celula => {
        const linha = parseInt(celula.dataset.linha);
        const coluna = parseInt(celula.dataset.coluna);

        if (aberta[linha][coluna]) {
            celula.classList.add("aberta");
            const numero = contarMinasVizinhas(linha, coluna);
            celula.textContent = numero > 0 ? numero : "";
        }
    });
}

function atualizaCronometro() {
    const dadosFase = fases[faseAtual];
    const segundosPassados = Math.floor((Date.now() - tempoInicio) / 1000);
    const segundosRestantes = dadosFase.tempoLimite - segundosPassados;

    if (segundosRestantes <= 0) {
        document.getElementById("cronometro").textContent = "Tempo: 0s";
        clearInterval(intervaloCronometro);
        alert(`Tempo esgotado na fase ${dadosFase.numero}! Tentando novamente...`);
        iniciarFase();
        jogoComecou = false;
        tempoInicio = null;
        return;
    }

    document.getElementById("cronometro").textContent = `Tempo: ${segundosRestantes}s`;
}

function salvarRanking(nome, tempo) {
    let ranking = JSON.parse(localStorage.getItem("rankingCampoMinado")) || [];
    ranking.push({ nome: nome, tempo: tempo });
    ranking.sort((a, b) => a.tempo - b.tempo);
    ranking = ranking.slice(0, 5);
    localStorage.setItem("rankingCampoMinado", JSON.stringify(ranking));
}

function renderizarRanking() {
    const ranking = JSON.parse(localStorage.getItem("rankingCampoMinado")) || [];
    const lista = document.getElementById("listaRanking");
    lista.innerHTML = "";

    if (ranking.length === 0) {
        lista.innerHTML = "<li>Nenhum recorde ainda.</li>";
        return;
    }

    ranking.forEach(item => {
        const linha = document.createElement("li");
        linha.textContent = `${item.nome} — ${item.tempo}s`;
        lista.appendChild(linha);
    });
}

function criarTabuleiroVisual() {
    tabuleiroElemento.innerHTML = "";
    tabuleiroElemento.style.gridTemplateColumns = `repeat(${COLUNAS}, minmax(28px, 45px))`;

    for (let i = 0; i < LINHAS; i++) {
        for (let j = 0; j < COLUNAS; j++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            celula.dataset.linha = i;
            celula.dataset.coluna = j;

            celula.addEventListener("click", () => {
                if (!jogoComecou) {
                    tempoInicio = Date.now();
                    jogoComecou = true;
                    intervaloCronometro = setInterval(atualizaCronometro, 1000);
                }

                if (minas[i][j]) {
                    clearInterval(intervaloCronometro);
                    revelarMinas();
                    alert("BOOM! Voce pisou numa mina. Fim de jogo!");
                    return;
                }

                abrirCelula(i, j);
                atualizarVisual();

                if (verificarVitoria()) {
                    clearInterval(intervaloCronometro);

                    if (faseAtual < fases.length - 1) {
                        alert(`Fase ${fases[faseAtual].numero} concluida! Preparando a proxima fase...`);
                        faseAtual++;
                        iniciarFase();
                        jogoComecou = false;
                        tempoInicio = null;
                    } else {
                        const tempoFinal = Math.floor((Date.now() - tempoInicio) / 1000);
                        salvarRanking(nomeJogador, tempoFinal);
                        renderizarRanking();
                        alert(`Parabens, ${nomeJogador}! Voce venceu todas as fases em ${tempoFinal} segundos!`);
                    }
                }
            });

            celula.addEventListener("contextmenu", (e) => {
                e.preventDefault();

                if (aberta[i][j]) {
                    return;
                }

                marcada[i][j] = !marcada[i][j];

                if (marcada[i][j]) {
                    celula.textContent = "🚩";
                } else {
                    celula.textContent = "";
                }
            });

            tabuleiroElemento.appendChild(celula);
        }
    }
}

function reiniciarJogo() {
    clearInterval(intervaloCronometro);
    iniciarFase();
    jogoComecou = false;
    tempoInicio = null;
    document.getElementById("cronometro").textContent = "Tempo: 0s";
}

function iniciarJogoComNome() {
    const valor = document.getElementById("inputNome").value.trim();
    if (valor === "") {
        alert("Por favor, digite um nome antes de continuar.");
        return;
    }

    nomeJogador = valor;
    document.getElementById("jogadorAtual").textContent = `Jogando como: ${nomeJogador}`;
    document.getElementById("telaNickname").style.display = "none";
    document.getElementById("jogo").classList.remove("escondido");

    iniciarFase();
    renderizarRanking();
}

document.getElementById("botaoEntrar").addEventListener("click", iniciarJogoComNome);
document.getElementById("botaoReiniciar").addEventListener("click", reiniciarJogo);