from app import db


class Cliente(db.Model):
    __tablename__ = 'clientes'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    telefone = db.Column(db.String(20))

    compras = db.relationship('Compra', backref='cliente', lazy=True, cascade='all, delete-orphan')

    def __init__(self, nome, email, telefone=None):
        self.nome = nome
        self.email = email
        self.telefone = telefone

    def __repr__(self):
        return f'<Cliente {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone
        }
