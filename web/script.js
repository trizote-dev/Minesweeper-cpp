const LINHAS = 8;
const COLUNAS = 8;

const tabuleiroElemento = document.getElementById("tabuleiro");

function criarTabuleiroVisual() {
    for (let i = 0; i < LINHAS; i++) {
        for (let j = 0; j < COLUNAS; j++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            celula.dataset.linha = i;
            celula.dataset.coluna = j;
            tabuleiroElemento.appendChild(celula);
        }
    }
}

criarTabuleiroVisual();