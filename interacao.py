from flask import Flask, render_template, request, jsonify

site = Flask(__name__ )

#mostra o jogo ao acessar a página:
@site.route('/') 
def index():
    return render_template('index.html')


#O JavaScript envia o resultado para o Python registando o num. de movimento
@site.route('/historico_resultado', methods=['POST'])
def historico_resultado():
    dados = request.get_json()
    resultado = dados.get("resultado")
    print(f"Você fez {resultado} movimentos")
    return jsonify({"mensagem": "Seu resultado foi salvo!"})

if __name__ == '__main__':
    site.run(debug=True)

