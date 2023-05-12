import pandas as pd

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Read data from a CSV file into a DataFrame
    df = pd.read_csv('data.csv')

    # Perform data manipulation or analysis using Pandas functions
    # For example, get the mean of a column
    mean_value = df['column_name'].mean()

    # Pass the results to a template or return as JSON response
    return render_template('index.html', mean=mean_value)
