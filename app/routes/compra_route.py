from datetime import datetime
from app import db
from flask import Blueprint, jsonify, render_template, request
from sqlalchemy import func

from app.models import Cliente, Produto, CompraProduto
from app.models.compra import Compra

compra_bp = Blueprint('compra', __name__, url_prefix='/compras')


@compra_bp.route('/')
def index():
    return render_template("compra_index.html")


# Preciso criar rotas para registrar e consultar compras

@compra_bp.route('/cadastrar', methods=['POST'])
def registrar_compra():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Json inválido ou ausente'}), 400

    id_cliente = data.get('id_cliente')
    produtos = data.get('produtos')

    if not (id_cliente and produtos):
        return jsonify({'Error': 'id_cliente e produtos são obrigatórios'}), 400

    if not isinstance(produtos, list) or not produtos:
        return jsonify({'Error': 'produtos deve ser uma lista não vazia'})

    for prod in produtos:
        if not (prod.get('id_produto') and prod.get('quantidade')):
            return jsonify({'error': 'Cada produto deve ter id_produto e quantidade'}), 400
        try:
            quantidade = int(prod.get('quantidade'))
            if quantidade < 1:
                raise ValueError
        except (ValueError, TypeError):
            return jsonify(
                {'error': f'Quantidade de id_produto {prod.get("id_produto")} deve ser um inteiro positivo'}), 400

    cliente = Cliente.query.get_or_404(id_cliente)

    compra = Compra(data=datetime.utcnow(), cliente=cliente, )
    db.session.add(compra)
    db.session.commit()

    produtos_resposta = []
    for prod in produtos:
        id_produto = prod['id_produto']
        quantidade = int(prod['quantidade'])

        produto = Produto.query.get_or_404(id_produto)

        compra_produto = CompraProduto(
            compra_id=compra.id,
            produto_id=produto.id,
            quantidade=quantidade,
            valor_produto=produto.preco
        )

        db.session.add(compra_produto)

        produto_dict = produto.to_dict()
        produto_dict['quantidade'] = quantidade
        produto_dict['valor_total'] = produto.preco * quantidade
        produtos_resposta.append(produto_dict)

    db.session.commit()

    resposta = {
        'id': compra.id,
        'data': compra.data.isoformat(),
        'cliente': cliente.to_dict(),
        'produtos': produtos_resposta
    }
    return jsonify(resposta), 201


@compra_bp.route('/consulta', methods=['POST'])
def consulta_compra():
    # Obtem os dados do request
    data = request.get_json(silent=True) or {}

    # Definição dos filtros permitidos
    filtros_permitidos = {
        'id_produto': int,
        'id_compra': int,
        'id_cliente': int,
        'data_inicial': datetime,
        'data_final': datetime
    }

    # Limite máximo de itens por consulta
    MAX_ITENS = 100

    # Validação e conversão dos filtros
    filtros = {}
    try:
        for chave, type_cast in filtros_permitidos.items():
            valor = data.get(chave)
            if valor is not None:
                try:
                    if chave in ['data_inicial', 'data_final']:
                        valor_convertido = datetime.fromisoformat(valor)
                        filtros[chave] = valor_convertido
                    else:
                        # Converte para o tipo apropriado e valida
                        valor_convertido = type_cast(valor)
                        if type_cast == int and valor_convertido < 1:
                            raise ValueError
                        filtros[chave] = valor_convertido

                except (ValueError, TypeError):
                    return jsonify({'error': f'O Campo {chave} deve ser um inteiro positivo'}), 400

                # Valida se há mais de um filtro quando id_compra está presente
                if 'id_compra' in filtros and len(filtros) > 1:
                    return jsonify(
                        {'error: "Quando id_compra é especificado, nenhum outro filtro pode ser aplicado'}), 400

        # Validar se a data inicial não é maior que a final
        if 'data_inicial' in filtros and 'data_final' in filtros:
            if filtros['data_inicial'] > filtros['data_final']:
                return jsonify({'error': 'data_inicio não pode ser posterior a data_fim'}), 400

    except Exception as e:
        return jsonify({'error': 'Erro na validação dos filtros'}), 400

    try:
        # Consulta com base nos filtros
        if 'id_compra' in filtros:
            compra = Compra.query.get_or_404(filtros['id_compra'])
            return jsonify(compra.to_dict()), 200

        # Construção da query dinâmica para multiplos filtros
        query = Compra.query

        if 'id_cliente' in filtros:
            query = query.filter_by(cliente_id=filtros["id_cliente"])

        if 'id_produto' in filtros:
            compra_ids = (
                # Subquery para encontrar compras relacionadas ao produto
                CompraProduto.query
                .filter_by(produto_id=filtros['id_produto'])
                .with_entities(CompraProduto.compra_id)
                .subquery()
            )
            query = query.filter(Compra.id.in_(compra_ids))

        if 'data_inicial' in filtros:
            query = query.filter(Compra.data >= filtros['data_inicial'])
        if 'data_final' in filtros:
            query = query.filter(Compra.data <= filtros['data_final'])

        # Aplica limite de filtros
        compras = query.limit(MAX_ITENS).all()

        dict_qtn_prod = []


        # Transforma o resultado em uma lista json
        return jsonify([compra.to_dict() for compra in compras]), 200

    except Exception as e:
        return jsonify({'error': 'Erro ao processar a consulta'}), 500


@compra_bp.route('/deletar/<int:id_compra>', methods=['DELETE'])
def deletar_compra(id_compra):
    compra = Compra.query.get_or_404(id_compra)
    db.session.delete(compra)
    db.session.commit()

    return jsonify({}), 200

@compra_bp.route('/relatorio/vendas_por_produto', methods=['GET'])
def relatorio_vendas_por_produto():
    try:
        # Consulta que soma a quantidade de cada produto vendido
        resultados = (
            CompraProduto.query
            .join(Produto)
            .group_by(CompraProduto.produto_id)
            .with_entities(
                CompraProduto.produto_id,
                Produto.nome,
                func.sum(CompraProduto.quantidade).label('quantidade_total')
            )
            .all()
        )

        # Formata o resultado como um dicionário
        relatorio = [
            {
                'Produto_id': resultado.produto_id,
                'Nome': resultado.nome,
                'Quantidade_Total_Vendida': int(resultado.quantidade_total)
            }
            for resultado in resultados
        ]

        return jsonify(relatorio), 200

    except Exception as e:
        return jsonify({'error': 'Erro ao gerar relatório'}), 500
