#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

void gerarMinas(vector<vector<bool>>& minas, int totalMinas) {
    int linhas = minas.size();
    int colunas = minas[0].size();
    int minasColocadas = 0;

    while (minasColocadas < totalMinas) {
        int linha = rand() % linhas;
        int coluna = rand() % colunas;

        if (!minas[linha][coluna]) {
            minas[linha][coluna] = true;
            minasColocadas++;
        }
    }
}

int contarMinasVizinhas(vector<vector<bool>>& minas, int linha, int coluna) {
    int totalLinhas = minas.size();
    int totalColunas = minas[0].size();
    int contador = 0;

    for (int dl = -1; dl <= 1; dl++) {
        for (int dc = -1; dc <= 1; dc++) {
            if (dl == 0 && dc == 0) continue;

            int novaLinha = linha + dl;
            int novaColuna = coluna + dc;

            if (novaLinha >= 0 && novaLinha < totalLinhas && novaColuna >= 0 && novaColuna < totalColunas) {
                if (minas[novaLinha][novaColuna]) {
                    contador++;
                }
            }
        }
    }
    return contador;
}

void abrirCelula(vector<vector<bool>>& minas, vector<vector<bool>>& aberta, int linha, int coluna) {
    int totalLinhas = minas.size();
    int totalColunas = minas[0].size();

    if (linha < 0 || linha >= totalLinhas || coluna < 0 || coluna >= totalColunas) {
        return;
    }
    if (aberta[linha][coluna]) {
        return;
    }
    if (minas[linha][coluna]) {
        return;
    }

    aberta[linha][coluna] = true;

    int numero = contarMinasVizinhas(minas, linha, coluna);

    if (numero == 0) {
        abrirCelula(minas, aberta, linha - 1, coluna);
        abrirCelula(minas, aberta, linha + 1, coluna);
        abrirCelula(minas, aberta, linha, coluna - 1);
        abrirCelula(minas, aberta, linha, coluna + 1);
        abrirCelula(minas, aberta, linha - 1, coluna - 1);
        abrirCelula(minas, aberta, linha - 1, coluna + 1);
        abrirCelula(minas, aberta, linha + 1, coluna - 1);
        abrirCelula(minas, aberta, linha + 1, coluna + 1);
    }
}

bool verificarVitoria(vector<vector<bool>>& minas, vector<vector<bool>>& aberta) {
    int linhas = minas.size();
    int colunas = minas[0].size();

    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < colunas; j++) {
            if (!minas[i][j] && !aberta[i][j]) {
                return false;
            }
        }
    }
    return true;
}

void imprimirTabuleiro(vector<vector<bool>>& minas, vector<vector<bool>>& aberta, bool mostrarMinas) {
    int linhas = minas.size();
    int colunas = minas[0].size();

    cout << "   ";
    for (int j = 0; j < colunas; j++) {
        cout << j << " ";
    }
    cout << endl;

    for (int i = 0; i < linhas; i++) {
        cout << i << "  ";
        for (int j = 0; j < colunas; j++) {
            if (mostrarMinas && minas[i][j]) {
                cout << "* ";
            } else if (!aberta[i][j]) {
                cout << "# ";
            } else {
                int numero = contarMinasVizinhas(minas, i, j);
                if (numero == 0) {
                    cout << "  ";
                } else {
                    cout << numero << " ";
                }
            }
        }
        cout << endl;
    }
}

int main() {
    srand(time(0));

    int LINHAS = 8;
    int COLUNAS = 8;
    int TOTAL_MINAS = 2;

    vector<vector<bool>> minas(LINHAS, vector<bool>(COLUNAS, false));
    vector<vector<bool>> aberta(LINHAS, vector<bool>(COLUNAS, false));

    gerarMinas(minas, TOTAL_MINAS);

    bool jogoAtivo = true;

    while (jogoAtivo) {
        imprimirTabuleiro(minas, aberta, false);

        int linhaEscolhida, colunaEscolhida;
        cout << "Digite a linha e a coluna que deseja abrir (ex: 3 5): ";
        cin >> linhaEscolhida >> colunaEscolhida;

        if (linhaEscolhida < 0 || linhaEscolhida >= LINHAS || colunaEscolhida < 0 || colunaEscolhida >= COLUNAS) {
            cout << "Posicao invalida, tente novamente." << endl;
            continue;
        }

        if (minas[linhaEscolhida][colunaEscolhida]) {
            cout << "BOOM! Voce pisou numa mina. Fim de jogo!" << endl;
            imprimirTabuleiro(minas, aberta, true);
            jogoAtivo = false;
        } else {
            abrirCelula(minas, aberta, linhaEscolhida, colunaEscolhida);

            if (verificarVitoria(minas, aberta)) {
                cout << "Parabens! Voce venceu o jogo!" << endl;
                imprimirTabuleiro(minas, aberta, true);
                jogoAtivo = false;
            }
        }
    }

    return 0;
}