from flask import Flask, jsonify
from flask_cors import CORS
from time import sleep

app = Flask(__name__)

CORS(app)

@app.route('/api/details')
def get_details():
    sleep(0.05)
    return jsonify({'data': {'Name': 'Jameel Kaisar', 'Account': 'Savings', 'Number': '0246813579'}})

@app.route('/api/balance')
def get_balance():
    return jsonify({'data': '$7140'})

@app.route('/api/transactions')
def get_transactions():
    return jsonify({'data': ['Paid $100 to Jameel', 'Received $20 from Kaisar', 'Paid $100 to Khan']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
