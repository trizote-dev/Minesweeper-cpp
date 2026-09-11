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
    int TOTAL_MINAS = 10;

    vector<vector<bool>> minas(LINHAS, vector<bool>(COLUNAS, false));
    vector<vector<bool>> aberta(LINHAS, vector<bool>(COLUNAS, false));

    gerarMinas(minas, TOTAL_MINAS);

    imprimirTabuleiro(minas, aberta, true);

    return 0;
}