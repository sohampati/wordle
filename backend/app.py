# app.py
from flask import Flask, request, jsonify
from solver import filter_words, possible_words, get_best_guess
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/solve", methods=["POST"])
def solve():
    data = request.json
    guesses = data.get("guesses", [])

    current_possible = possible_words.copy()
    
    for guess in guesses:
        word, result = guess["word"], guess["result"]
        current_possible = filter_words(current_possible, word, result)
    best_guess = get_best_guess(current_possible)

    return jsonify({
        "remaining": current_possible[:10],
        "count": len(current_possible),
        "best_guess": best_guess
    })

if __name__ == "__main__":
    app.run(debug=True)
