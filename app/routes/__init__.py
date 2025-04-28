from flask import blueprints

from app.routes.cliente_routes import cliente_bp
from app.routes.compra_route import compra_bp
from app.routes.produto_routes import produto_bp

all_blueprints = [
    compra_bp,
    produto_bp,
    cliente_bp,
]