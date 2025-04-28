const formDeletar = document.getElementById("form_deletar");
const formCadastro = document.getElementById("form_cadastro")

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const idCliente = document.getElementById('id_cliente').value;
    const idProduto1 = document.getElementById('id_produto_1').value;
    const quantidade1 = document.getElementById('quantidade_1').value;

    const dataProdutos = [{
        id_produto: idProduto1,
        quantidade: quantidade1
    }];

    for (let i = 2; i <= 6; i++) {
        const idProdutoElement = document.getElementById(`id_produto_${i}`);
        const quantidadeElement = document.getElementById(`quantidade_${i}`);

        if (idProdutoElement && quantidadeElement) {
            const idProdutoAdicional = idProdutoElement.value;
            const quantidadeProdutoAdicional = quantidadeElement.value;

            if (idProdutoAdicional && quantidadeProdutoAdicional) {
                dataProdutos.push({
                    id_produto: idProdutoAdicional,
                    quantidade: quantidadeProdutoAdicional
                });
            }
        }
    }

    const data = {
        id_cliente: idCliente,
        produtos: dataProdutos
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/compras/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const resultado = await response.json();
            console.log("Sucesso: ", resultado);
            alert('Cadastro realizado com sucesso!');
            formCadastro.reset();
        } else {
            console.error('Erro:', response.status);
            alert('Erro ao realizar o cadastro.');
        }
    } catch (err) {
        console.error('Erro:', err);
    }


})

async function fetchData(filtros = null) {
    try {
        // Mostra a tabela e esconde o botão "Listar"
        document.getElementById("table_container").classList.remove("hidden");

        // Limpa a tabela
        document.getElementById('header_row').innerHTML = '';
        document.getElementById('table_body').innerHTML = '';

        // Faz a requisição
        let response;
        const url = 'http://127.0.0.1:5000/compras/consulta';
        if (filtros) {
            // Envia os filtros como POST com corpo JSON
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filtros)
            });
        } else {
            // Sem filtros, usa GET para listar todas as compras
            response = await fetch(url, {method: 'POST'});
        }

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        const dataArray = Array.isArray(data) ? data : data && data.id ? [data] : [];
        if (dataArray.length > 0) {
            // Define cabeçalhos da tabela principal
            const headers = ['ID', 'Data', 'Cliente', 'Valor Total', 'Produtos'];
            const headerRow = document.getElementById('header_row');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            const tableBody = document.getElementById('table_body');
            dataArray.forEach(item => {
                const row = document.createElement('tr');

                // ID da compra
                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                // Data formatada
                const dataCell = document.createElement('td');
                const date = new Date(item.data);
                dataCell.textContent = date.toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                });
                row.appendChild(dataCell);

                // Nome do cliente
                const clienteCell = document.createElement('td');
                clienteCell.textContent = item.cliente.nome;
                row.appendChild(clienteCell);

                // Valor total da compra
                const valorTotal = item.produtos.reduce((sum, prod) => {
                    return sum + (prod.quantidade * prod.preco);
                }, 0);
                const valorCell = document.createElement('td');
                valorCell.textContent = valorTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
                valorCell.style.textAlign = 'right';
                row.appendChild(valorCell);

                // Botão para exibir produtos
                const produtosCell = document.createElement('td');
                const toggleButton = document.createElement('button');
                toggleButton.className = 'button is-small is-info';
                toggleButton.textContent = 'Mostrar Produtos';
                toggleButton.onclick = () => toggleProdutos(row, item.produtos);
                produtosCell.appendChild(toggleButton);
                row.appendChild(produtosCell);

                tableBody.appendChild(row);
            });
        } else {
            const tableBody = document.getElementById('table_body');
            tableBody.innerHTML = '<tr><td colspan="5">Nenhuma compra encontrada</td></tr>';
        }
    } catch (err) {
        console.error('Erro:', err);
        const tableBody = document.getElementById('table_body');
        tableBody.innerHTML = '<tr><td colspan="5">Erro ao carregar dados</td></tr>';
    }
}

function toggleProdutos(row, produtos) {
    let produtosRow = row.nextSibling;
    if (produtosRow && produtosRow.classList.contains('produtos-row')) {
        // Remove a linha de produtos se já estiver visível
        produtosRow.remove();
    } else {
        // Cria uma nova linha para exibir os produtos
        produtosRow = document.createElement('tr');
        produtosRow.className = 'produtos-row';
        const produtosCell = document.createElement('td');
        produtosCell.colSpan = 5;

        // Cria uma sub-tabela para os produtos
        const subTable = document.createElement('table');
        subTable.className = 'table is-bordered is-fullwidth';
        const subThead = document.createElement('thead');
        const subHeaderRow = document.createElement('tr');
        ['ID', 'Nome', 'Quantidade', 'Preço', 'Total'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            subHeaderRow.appendChild(th);
        });
        subThead.appendChild(subHeaderRow);
        subTable.appendChild(subThead);

        const subTbody = document.createElement('tbody');
        produtos.forEach(prod => {
            const subRow = document.createElement('tr');

            // Alinhar preços e quantidades à direita
            const idCell = document.createElement('td');
            idCell.textContent = prod.id;
            subRow.appendChild(idCell);

            const nomeCell = document.createElement('td');
            nomeCell.textContent = prod.nome;
            subRow.appendChild(nomeCell);

            const qtdCell = document.createElement('td');
            qtdCell.textContent = prod.quantidade;
            qtdCell.style.textAlign = 'right';
            subRow.appendChild(qtdCell);

            const precoCell = document.createElement('td');
            precoCell.textContent = prod.preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            precoCell.style.textAlign = 'right';
            subRow.appendChild(precoCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = (prod.quantidade * prod.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            totalCell.style.textAlign = 'right';
            subRow.appendChild(totalCell);

            subTbody.appendChild(subRow);
        });
        subTable.appendChild(subTbody);

        produtosCell.appendChild(subTable);
        produtosRow.appendChild(produtosCell);

        // Insere a linha de produtos após a linha da compra
        row.insertAdjacentElement('afterend', produtosRow);
    }
}

function resetTable() {
    document.getElementById('table_container').classList.add('hidden');
    document.getElementById('header_row').innerHTML = '';
    document.getElementById('table_body').innerHTML = '';
}

formDeletar.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deleteId = document.getElementById('id_deletar');
    const button = document.querySelector('.button.is-danger');
    button.disabled = true;
    try {
        const response = await fetch(`http://127.0.0.1:5000/compras/deletar/${deleteId.value}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        response.statusText = undefined;
        if (response.ok) {
            alert('Compra deletada com sucesso!');
            deleteId.value = '';
        } else {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

    } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao deletar o Compra.');
    } finally {
        button.disabled = false;
    }
});

let produtoCount = 1
const maxProdutos = 6

function adicionarProduto() {
    if (produtoCount >= maxProdutos) {
        alert("Numero máximo de produtos atingidos (6)");
        return;
    }

    produtoCount++;
    const container = document.getElementById("produtos_container")
    const newField = document.createElement('div');
    newField.className = "produto_field mb-4";
    newField.innerHTML = `
            <div class="columns">
                <div class="column">
                    <label class="label" for="id_produto_${produtoCount}">ID do Produto:</label>
                    <div class="control has-icons-left">
                        <input class="input" type="number" id="id_produto_${produtoCount}" name="produtos[${produtoCount - 1}][id_produto]" placeholder="ID do Produto">
                        <span class="icon is-small is-left">
                            <i class="fas fa-box"></i>
                        </span>
                    </div>
                </div>
                <div class="column">
                    <label class="label" for="quantidade_${produtoCount}">Quantidade:</label>
                    <div class="control has-icons-left">
                        <input class="input" type="number" id="quantidade_${produtoCount}" name="produtos[${produtoCount - 1}][quantidade]" placeholder="Quantidade" min="1">
                        <span class="icon is-small is-left">
                            <i class="fas fa-sort-numeric-up"></i>
                        </span>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(newField);
    if (produtoCount >= maxProdutos) {
        document.getElementById('adicionar_produto').disabled = true;
    }
}

document.getElementById('form_consultar').addEventListener('submit', async function (event) {
    event.preventDefault();

    const idCliente = document.getElementById('id_cliente_consulta').value.trim();
    const idProduto = document.getElementById('id_produto_consulta').value.trim();
    const idCompra = document.getElementById('id_compra_consulta').value.trim();

    const filtros = {};

    if (idCompra) {
        filtros.id_compra = Number(idCompra);
    } else {
        if (idCliente) filtros.id_cliente = Number(idCliente);
        if (idProduto) filtros.id_produto = Number(idProduto);
    }

    await fetchData(Object.keys(filtros).length > 0 ? filtros : null);
});

document.getElementById('id_compra_consulta').addEventListener('input', function () {
    const idCompra = this.value.trim();
    const idClienteInput = document.getElementById('id_cliente_consulta');
    const idProdutoInput = document.getElementById('id_produto_consulta');

    if (idCompra) {
        idClienteInput.disabled = true;
        idProdutoInput.disabled = true;
    } else {
        idClienteInput.disabled = false;
        idProdutoInput.disabled = false;
    }
});