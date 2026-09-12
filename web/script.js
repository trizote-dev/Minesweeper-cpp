const LINHAS = 8;
const COLUNAS = 8;
const TOTAL_MINAS = 10;

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

function criarTabuleiroVisual() {
    tabuleiroElemento.innerHTML = "";
    for (let i = 0; i < LINHAS; i++) {
        for (let j = 0; j < COLUNAS; j++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            celula.dataset.linha = i;
            celula.dataset.coluna = j;

            celula.addEventListener("click", () => {
                abrirCelula(i, j);
                atualizarVisual();
            });

            tabuleiroElemento.appendChild(celula);
        }
    }
}

criarMatrizes();
gerarMinas();
criarTabuleiroVisual();