import flask
import base64
from io import BytesIO

import tensorflow as tf

from keras.models import load_model
from keras import backend as K
import keras

from PIL import Image
import numpy as np

from flask_cors import CORS, cross_origin
from flask import Flask

app = Flask(__name__)
CORS(app)


def CalculateF1Score(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    recall = true_positives / (possible_positives + K.epsilon())
    f1_val = 2*(precision*recall)/(precision+recall+K.epsilon())
    return f1_val


def ResNetNormImages(images):
    images = np.asarray(images).astype(np.float64)
    m0 = np.mean(images[:, :, 0])
    m1 = np.mean(images[:, :, 1])
    m2 = np.mean(images[:, :, 2])
    images[:, :, 0] -= m0
    images[:, :, 1] -= m1
    images[:, :, 2] -= m2
    return images


@app.route("/")
@cross_origin(origin='*')
def home_view():
    return "<h1>Welcome to Test Main Page</h1>"


@app.route("/privacy")
@cross_origin(origin='*')
def privacy_view():
    return "<h1>This is still a test app. The app does not save you pictures in any way.</h1>"


model = tf.keras.models.load_model('modelTestResNet.h5', custom_objects={
    'CalculateF1Score': CalculateF1Score})

# define a predict function as an endpoint
@app.route("/predict", methods=["POST"])
@cross_origin(origin='*')
def predict():
    global model

    data = {}
    print(1)

    # Body parameters
    jsonData = flask.request.get_json()
    img = Image.open(BytesIO(base64.b64decode(jsonData['data'])))

    print(2)
    img = img.resize((150, 112))
    img = ResNetNormImages(img)
    img = img.reshape(1, *(112, 150, 3))

    print(4)
    # Model validation predictions
    yPred_class = model.predict_classes(img)
    # yPred = model.predict(img)
    # pred = [x * 100 for x in yPred[0]]

    print(5)
    # Compose response
    data["prediction_class"] = str(yPred_class[0])
    # data["prediction"] = str(pred)
    data["success"] = True

    # return a response in json format
    return flask.jsonify(data)


if __name__ == "__main__":
    app.run()
