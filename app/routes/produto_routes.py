from flask import Blueprint, jsonify, render_template, request
from app.models.produto import Produto
from app import db

produto_bp = Blueprint('produto', __name__, url_prefix='/produtos')


@produto_bp.route('/')
def index():
    return render_template("produto_index.html")


@produto_bp.route('/listar', methods=['GET'])
def listar_produtos():
    produtos = Produto.query.all()
    produtos_dict = []
    for produto in produtos:
        produtos_dict.append(produto.to_dict())

    return jsonify(produtos_dict), 200


@produto_bp.route('/cadastrar', methods=['POST'])
def cadastrar_produto():
    data = request.get_json()

    new_produto = Produto(data.get('nome'), data.get('descricao'), data.get('preco'))

    db.session.add(new_produto)
    db.session.commit()

    return jsonify(new_produto.to_dict()), 201


@produto_bp.route('/atualizar', methods=['PUT'])
def atualizar_produto():
    data = request.get_json()
    id_produto = data.get('id')
    produto = Produto.query.get_or_404(id_produto)

    produto.nome = data.get('nome')
    produto.descricao = data.get('descricao')
    produto.preco = data.get('preco')

    db.session.commit()

    return jsonify(produto.to_dict()), 201


@produto_bp.route('/excluir/<int:id>', methods=['DELETE'])
def excluir_produto(id):
    produto = Produto.query.get_or_404(id)
    db.session.delete(produto)
    db.session.commit()
    return jsonify({}), 200
