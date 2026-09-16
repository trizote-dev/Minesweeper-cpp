const LINHAS = 8;
const COLUNAS = 8;
const TOTAL_MINAS = 10;
let tempoInicio = null;
let jogoComecou = false;
let intervaloCronometro = null;

let minas = [];
let aberta = [];

const tabuleiroElemento = document.getElementById("tabuleiro");

function criarMatrizes() {
    minas = [];
    aberta = [];
    for (let i = 0; i < LINHAS; i++) {
        minas.push(new Array(COLUNAS).fill(false));
        aberta.push(new Array(COLUNAS).fill(false));
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
    const segundos = Math.floor((Date.now() - tempoInicio) / 1000);
    document.getElementById("cronometro").textContent = `Tempo: ${segundos}s`;
}

function criarTabuleiroVisual() {
    tabuleiroElemento.innerHTML = "";
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
                    const tempoFinal = Math.floor((Date.now() - tempoInicio) / 1000);
                    alert(`Parabens! Voce venceu em ${tempoFinal} segundos!`);
                }
            });

            tabuleiroElemento.appendChild(celula);
        }
    }
}

function reiniciarJogo() {
    clearInterval(intervaloCronometro);
    criarMatrizes();
    gerarMinas();
    criarTabuleiroVisual();
    jogoComecou = false;
    tempoInicio = null;
    document.getElementById("cronometro").textContent = "Tempo: 0s";
}

document.getElementById("botaoReiniciar").addEventListener("click", reiniciarJogo);

criarMatrizes();
gerarMinas();
criarTabuleiroVisual();