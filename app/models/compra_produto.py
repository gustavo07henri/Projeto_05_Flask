from app import db

class CompraProduto(db.Model):
    __tablename__ = 'compra_produto'

    id = db.Column(db.Integer, primary_key=True)
    compra_id = db.Column(db.Integer, db.ForeignKey('compras.id'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    valor_produto = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False, default=1)

    produto = db.relationship('Produto', backref='compra_associacoes')

    def __repr__(self):
        return f'<CompraProduto Compra={self.compra_id} Produto={self.produto_id} Qtd={self.quantidade}>'

    def to_dict(self):
        return {
            'id': self.id,
            'compra_id': self.compra_id,
            'produto_id': self.produto_id,
            'quantidade': self.quantidade
        }
    def __init__(self, compra_id, produto_id, quantidade, valor_produto):
        self.compra_id = compra_id
        self.produto_id = produto_id
        self.quantidade = quantidade
        self.valor_produto = valor_produto

    def valor_total(self):
        return self.valor_produto * self.quantidade