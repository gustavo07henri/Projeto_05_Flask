from app import db
from datetime import datetime


class Compra(db.Model):
    __tablename__ = 'compras'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, default=datetime.utcnow)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)

    produtos = db.relationship('CompraProduto', backref='compra', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Compra {self.id} - Cliente {self.cliente_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'data': self.data.isoformat(),
            'cliente': self.cliente.to_dict(),
            'produtos': [
                {
                    **cp.produto.to_dict(),
                    'quantidade': cp.quantidade,
                    'valor_produto': cp.valor_produto
                } for cp in self.produtos
            ]
        }

    def __init__(self, data, cliente):
        self.data = data
        self.cliente = cliente
        self.produtos = []
