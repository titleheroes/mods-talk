import pandas as pd
import pickle



from pythainlp import word_tokenize

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer


from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def test():


    return "Hello mod's talk"


@app.route('/api/sentiment', methods=['POST'])
def index():

    data = request.get_json()
    received_string = data['string']

    python_string = str(received_string)
        
    with open('text_model2.pkl', 'rb') as file:  
        lr = pickle.load(file)

    df = pd.read_csv('comments-small-labeled2.csv', )
    df = df.loc[:, df.columns!='comment_id']

    from pythainlp.corpus.common import thai_stopwords
    thai_stopwords = list(thai_stopwords())


    from pythainlp import word_tokenize
    def text_process(text):
        
        final = word_tokenize(text)
        final = " ".join(word for word in final)
        final = " ".join(word for word in final.split() 
                        if word.lower not in thai_stopwords)
        return final

    df['text_tokens'] = df['text'].apply(text_process)

    from sklearn.model_selection import train_test_split
    X = df[['text_tokens']]
    y = df['class_label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=101)

    from sklearn.feature_extraction.text import CountVectorizer
    cvec = CountVectorizer(analyzer=lambda x:x.split(' '))
    cvec.fit_transform(X_train['text_tokens'])
    cvec.vocabulary_
    
    my_text = python_string
    my_tokens = text_process(my_text)

    my_bow = cvec.transform(pd.Series([my_tokens]))
    my_predictions = lr.predict(my_bow)


    string_value = str(my_predictions[0])

    response_data = {'result': string_value}

    return jsonify(response_data)






if __name__ == '__main__':
    app.run()
