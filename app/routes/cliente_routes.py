from flask import Blueprint, render_template, jsonify, request
from app.models.cliente import Cliente
from app import db

cliente_bp = Blueprint('cliente', __name__, url_prefix='/clientes')

@cliente_bp.route('/')
def index():
    return render_template("cliente_index.html")

@cliente_bp.route('/listar', methods=['GET'])
def listar_clientes():
    clientes = Cliente.query.all()
    clientes_dict = []
    for cliente in clientes:
        clientes_dict.append(cliente.to_dict())

    return jsonify(clientes_dict), 200

@cliente_bp.route('/cadastrar', methods=['POST'])
def cadastrar_cliente():
    data = request.get_json()

    new_cliente = Cliente(data.get('nome'), data.get('email'), data.get('telefone'))

    db.session.add(new_cliente)
    db.session.commit()

    return jsonify(new_cliente.to_dict()) , 201

@cliente_bp.route('/atualizar', methods=['PUT'])
def atualizar_cliente():
    data = request.get_json()
    id_cliente = data.get('id')
    cliente = Cliente.query.get_or_404(id_cliente)

    cliente.nome = data.get('nome')
    cliente.email = data.get('email')
    cliente.telefone = data.get('telefone')
    db.session.commit()

    return jsonify(cliente.to_dict()), 201

@cliente_bp.route('/excluir/<int:id>', methods=['DELETE'])
def excluir_cliente(id):

    cliente = Cliente.query.get_or_404(id)
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({}), 200