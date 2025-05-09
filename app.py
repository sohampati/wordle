# app.py
from flask import Flask, request, jsonify
from solver import filter_words
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/solve", methods=["POST"])
def solve():
    data = request.json
    guesses = data.get("guesses", [])

    from solver import possible_words
    current_possible = possible_words.copy()

    for guess in guesses:
        word, result = guess["word"], guess["result"]
        current_possible = filter_words(current_possible, word, result)

    return jsonify({
        "remaining": current_possible[:10],  # Top 10 candidates
        "count": len(current_possible)
    })

if __name__ == "__main__":
    app.run(debug=True)
