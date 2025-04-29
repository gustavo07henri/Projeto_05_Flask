# Sistema de Gerenciamento de Compras

## Descrição do Projeto
Este projeto é um sistema web desenvolvido como parte do Trabalho Prático da disciplina de **Sistemas Distribuídos e Mobile**, ministrada pelo Professor Leonardo Augusto Ferreira. O objetivo é criar uma aplicação comercial que gerencie **Clientes**, **Produtos** e **Compras**, utilizando uma abordagem de separação de camadas com um backend baseado em **Flask** e um frontend responsivo.

O sistema permite:
- Cadastro, listagem, atualização e exclusão de clientes e produtos.
- Registro de compras associando clientes a múltiplos produtos.
- Consulta de compras com filtros dinâmicos (por cliente, produto, data ou ID da compra).
- Geração de relatórios de vendas por produto.
- Interface web intuitiva e responsiva, utilizando **Bulma CSS** para estilização e **JavaScript** para interações assíncronas com a API.

O banco de dados é implementado com **SQLite**, garantindo persistência local dos dados, e a comunicação entre frontend e backend é feita via requisições HTTP em formato JSON.

## Estrutura do Projeto
O projeto está organizado em camadas distintas para backend e frontend:

### Backend
- **Framework**: Flask com extensões Flask-SQLAlchemy (ORM) e Flask-Migrate (migrações de banco de dados).
- **Estrutura de Arquivos**:
  - `app/__init__.py`: Configuração inicial da aplicação Flask, inicialização do banco de dados e registro de blueprints.
  - `app/config.py`: Configurações do banco de dados SQLite.
  - `app/routes/`: Contém os blueprints para rotas de clientes, produtos e compras.
  - `app/models/`: Modelos das entidades `Cliente`, `Produto`, `Compra` e `CompraProduto` para o banco de dados.
- **Funcionalidades da API**:
  - Rotas para CRUD (Create, Read, Update, Delete) de clientes e produtos.
  - Rotas para registro, consulta e exclusão de compras.
  - Relatório de vendas por produto (`/compras/relatorio/vendas_por_produto`).
  - Tratamento de erros com respostas JSON.

### Frontend
- **Tecnologias**: HTML, Bulma CSS, JavaScript (com requisições `fetch` para a API).
- **Arquivos Principais**:
  - `templates/compra_index.html`: Página principal para gerenciamento de compras, com formulários para cadastro, consulta e exclusão, além de tabelas para listagem e relatórios.
  - `static/compra.js`: Lógica JavaScript para manipulação de formulários, requisições assíncronas e renderização dinâmica de tabelas.
- **Funcionalidades**:
  - Cadastro de compras com suporte a até 6 produtos por compra.
  - Filtros dinâmicos para consulta de compras (ID do cliente, produto, compra, ou intervalo de datas).
  - Exibição de detalhes dos produtos em uma sub-tabela expansível.
  - Relatório de vendas por produto com dados tabulados.
  - Interface responsiva, testada para desktop e dispositivos móveis.

### Banco de Dados
- **SQLite**: Banco de dados leve e local (`data.sqlite`)

- **Estrutura**:
  - **Cliente**: `id`, `nome`, `email`, `telefone`
  - **Produto**: `id`, `nome`, `descricao`, `preco`
  - **Compra**: `id`, `cliente_id`, `data_compra`
  - **CompraProduto**: `id`, `compra_id`, `produto_id`, `quantidade`

- **Relacionamentos**:
  - Cliente → Compra (1:N): Um cliente possui várias compras
  - Compra ↔ Produto (N:N): Produtos em compras via CompraProduto

- **Observações**: 
  - Banco pré-populado com dados de exemplo
  - Integridade referencial entre tabelas

## Requisitos
- **Python 3.8+**
- **Dependências Python** (listadas em `requirements.txt`):
  - `flask`
  - `flask-sqlalchemy`
  - `flask-migrate`
- **Navegador Web**: Chrome, Firefox ou outro compatível com ES6+.
- **Conexão Local**: O sistema roda em `http://127.0.0.1:5000`.

## Instruções de Instalação e Execução
1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/gustavo07henri/Projeto_05_Flask.git
   cd Projeto_05_Flask
   ```

2. **Crie e Ative um Ambiente Virtual** (opcional, mas recomendado):
   ```bash
   python -m venv venv
   ```

3. **Instale as Dependências**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute a Aplicação**:
   ```bash
   flask run
   ```
   Acesse o sistema em `http://127.0.0.1:5000`.

## Uso
1. **Página Inicial**:
   - Acesse `http://127.0.0.1:5000` para ver o menu principal (`index.html`), com links para gerenciar clientes, produtos e compras.
2. **Gerenciamento de Compras**:
   - **Cadastro**: Preencha o ID do cliente e adicione até 6 produtos (ID e quantidade). Clique em "Enviar" para registrar.
   - **Consulta**: Use os filtros (ID do cliente, produto, compra, ou datas) para listar compras. Clique em "Mostrar Produtos" para ver detalhes.
   - **Relatório**: Clique em "Listar" no relatório de vendas por produto para visualizar os dados.
   - **Exclusão**: Insira o ID da compra no formulário de exclusão e clique em "Deletar".
3. **Navegação**:
   - Use o botão "Voltar" para retornar ao menu principal.
   - A interface é responsiva e adapta-se a diferentes tamanhos de tela.

## Atendimento aos Requisitos do Trabalho
O projeto atende às cinco tarefas descritas no documento `projeto 05.pdf`:

- **Tarefa 1**: Modelagem do banco de dados com entidades `Cliente`, `Produto`, `Compra` e `CompraProduto`, implementadas em `app/models/`.
- **Tarefa 2**: API REST com Flask, rotas para CRUD, e respostas JSON, implementada em `app/routes/`.
- **Tarefa 3**: Interface web responsiva com formulários e tabelas dinâmicas.
- **Tarefa 4**: Filtros dinâmicos para consultas (por cliente, produto, data) e relatório de vendas por produto.
- **Tarefa 5**: Embora não tenha sido adotado um framework como React ou Vue.js, o sistema utiliza tecnologias modernas como Bulma CSS e requisições assíncronas com `fetch`, garantindo uma interface dinâmica e fluida.

## Possíveis Melhorias
- Adicionar autenticação de usuários para um painel administrativo.
- Implementar exportação de relatórios em CSV ou PDF.
- Utilizar um framework frontend (React ou Vue.js) para maior interatividade.
- Incluir gráficos interativos com Chart.js para visualização de relatórios.

## Contribuições
Este projeto foi desenvolvido como parte de um trabalho acadêmico. Contribuições ou sugestões podem ser enviadas via pull requests ou issues no repositório.

## Licença
Este projeto é destinado a fins acadêmicos e não possui uma licença comercial. Consulte o professor ou a instituição para detalhes sobre uso e distribuição.
