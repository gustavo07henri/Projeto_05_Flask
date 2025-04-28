const formCadastro = document.getElementById('form_cadastro');
const formAtualizar = document.getElementById('form_atualizar')
const formDeletar = document.getElementById('form_deletar')

formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        nome: document.getElementById('nome_cadastro').value,
        descricao: document.getElementById('descricao_cadastro').value,
        preco: document.getElementById('preco_cadastro').value,
    }
    try {
        const response = await fetch('http://127.0.0.1:5000/produtos/cadastrar', {
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

        } else {
            console.error('Erro:', response.status);
            alert('Erro ao realizar o cadastro.');
        }
    } catch (err) {
        console.error('Erro:', err);
    }
    formCadastro.reset();
})

async function fetchDataProduto() {
    try {
        // Mostra a tabela e esconde o botão "Listar"
        document.getElementById("table_container").classList.remove("hidden");
        document.getElementById("Carregar_btn").classList.add("hidden");

        // Limpa a tabela
        document.getElementById('header_row').innerHTML = '';
        document.getElementById('table_body').innerHTML = '';

        // Busca os dados
        const response = await fetch('http://127.0.0.1:5000/produtos/listar');
        const data = await response.json();

        if (data.length > 0) {
            // Cria o cabeçalho
            const headers = Object.keys(data[0]);
            const headerRow = document.getElementById("header_row");
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header.toUpperCase();
                headerRow.appendChild(th);
            });

            // Preenche o corpo da tabela
            const tableBody = document.getElementById('table_body');
            data.forEach(item => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = item[header] || '-';
                    row.appendChild(td);
                });
                tableBody.appendChild(row);
            });
        } else {
            const tableBody = document.getElementById('table_body');
            tableBody.innerHTML = '<tr><td colspan="100%">Nenhum produto encontrado</td></tr>';
        }
    } catch (err) {
        console.error('Erro:', err);
        const tableBody = document.getElementById('table_body');
        tableBody.innerHTML = '<tr><td colspan="100%">Erro ao carregar dados</td></tr>';
    }
}

function resetTable() {
    // Reseta a tabela
    document.getElementById('table_container').classList.add('hidden');
    document.getElementById('Carregar_btn').classList.remove('hidden');
    document.getElementById('header_row').innerHTML = '';
    document.getElementById('table_body').innerHTML = '';
}

formAtualizar.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
        id: document.getElementById('id_atualizar').value,
        nome: document.getElementById('nome_atualizar').value,
        descricao: document.getElementById('descricao_atualizar').value,
        preco: document.getElementById('valor_atualizar').value,
    }
    try {
        const response = await fetch('http://127.0.0.1:5000/produtos/atualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const resultado = await response.json();
            console.log("Sucesso: ", resultado);
            alert('Cadastro atualizado com sucesso!');

        } else {
            console.error('Erro:', response.status);
            alert('Erro ao atualizar o cadastro.');
        }
    } catch (err) {
        console.error('Erro:', err);
    }
    formAtualizar.reset();
})
formDeletar.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deleteId = document.getElementById('id_deletar');
    const button = document.querySelector('.button.is-danger');
    button.disabled = true;
    try {
        const response = await fetch(`http://127.0.0.1:5000/produtos/excluir/${deleteId.value}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        response.statusText = undefined;
        if (response.ok) {
            alert('Produto deletado com sucesso!');
            deleteId.value = '';
        } else {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

    } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao deletar o cadastro.');
    } finally {
        button.disabled = false;
    }
});