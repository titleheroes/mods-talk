import pandas as pd
import pickle


from pythainlp.corpus.common import thai_stopwords
from pythainlp import word_tokenize

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer


from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/endpoint', methods=['POST'])
def receive_string_from_react():
    data = request.get_json()
    received_string = data['string']
    # Process the received string as needed
    processed_string = received_string.upper()
    return jsonify(result=received_string)


@app.route('/api/sentiment')
def index():

    with open('text_model.pkl', 'rb') as file:  
        lr = pickle.load(file)

    # Read data from a CSV file into a DataFrame
    df = pd.read_csv('comments-small-labeled2.csv')

    df = df.loc[:, df.columns!='comment_id']

    
    thai_stopwords = list(thai_stopwords())


    


    array = df.values.tolist()
    

    # Pass the results to a template or return as JSON response
    return array

if __name__ == '__main__':
    app.run()
