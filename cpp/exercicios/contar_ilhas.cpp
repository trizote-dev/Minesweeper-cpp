#include <iostream>
#include <vector>
using namespace std;

void afundarIlha(vector<vector<int>>& grid, vector<vector<bool>>& visitado, int linha, int coluna) {
    int totalLinhas = grid.size();
    int totalColunas = grid[0].size();

    if (linha < 0 || linha >= totalLinhas || coluna < 0 || coluna >= totalColunas) {
        return;
    }
    if (visitado[linha][coluna]) {
        return;
    }
    if (grid[linha][coluna] == 0) {
        return;
    }

    visitado[linha][coluna] = true;

    afundarIlha(grid, visitado, linha - 1, coluna);
    afundarIlha(grid, visitado, linha + 1, coluna);
    afundarIlha(grid, visitado, linha, coluna - 1);
    afundarIlha(grid, visitado, linha, coluna + 1);
}

int contarIlhas(vector<vector<int>>& grid) {
    int linhas = grid.size();
    int colunas = grid[0].size();
    vector<vector<bool>> visitado(linhas, vector<bool>(colunas, false));
    int contador = 0;

    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < colunas; j++) {
            if (grid[i][j] == 1 && !visitado[i][j]) {
                contador++;
                afundarIlha(grid, visitado, i, j);
            }
        }
    }

    return contador;
}

int main() {
    vector<vector<int>> grid = {
        {1, 1, 0, 0},
        {1, 1, 0, 0},
        {0, 0, 1, 0},
        {0, 0, 0, 1}
    };
    cout << "Numero de ilhas: " << contarIlhas(grid) << endl;
    return 0;
}