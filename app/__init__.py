from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config

## Instância global deo banco de dados
db = SQLAlchemy()
migrate = Migrate()


def create_app():
    ## Encarregado de criar o app

    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)

    # Todas as rotas da aplicação no servidor.
    # Facilita na adição de rotas no sistema
    from app.routes import all_blueprints
    for bp in all_blueprints:
        app.register_blueprint(bp)

    # Rota Central do programa
    # Retorna arquivo HTML que gerencia os link para as demais
    @app.route('/')
    def index():
        return render_template('index.html')

    ## Importa todos os modelos da classe para serem adicionados ao banco
    from app.models.cliente import Cliente
    from app.models.produto import Produto
    from app.models.compra import Compra
    from app.models.compra_produto import CompraProduto

    return app
