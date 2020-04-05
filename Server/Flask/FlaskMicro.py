# Load libraries
import numpy as np
from PIL import Image
import flask
import pandas as pd
import tensorflow as tf
import keras
from keras import backend as K
from keras.models import load_model
from flask_cors import CORS
from io import BytesIO
import base64

# instantiate flask
app = flask.Flask(__name__)
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
    print(images.shape)
    # images = images[:, :, :, ::-1]
    m0 = np.mean(images[:, :, 0])
    m1 = np.mean(images[:, :, 1])
    m2 = np.mean(images[:, :, 2])
    images[:, :, 0] -= m0
    images[:, :, 1] -= m1
    images[:, :, 2] -= m2
    return images


# load model
model = tf.keras.models.load_model('modelTestResNet.h5', custom_objects={
    'CalculateF1Score': CalculateF1Score})

# get the image
# path = 'ISIC_0024307.jpg'
# image = Image.open(path).resize((150, 112))
# image.show()

# Norm images
# img = ResNetNormImages(image)
# img = img.reshape(1, *(112, 150, 3))


# 'akiec': 'Actinic keratoses',  # 0
# 'bcc': 'Basal cell carcinoma',  # 1
# 'bkl': 'Benign keratosis-like lesions',  # 2
# 'df': 'Dermatofibroma',  # 3
# 'nv': 'Melanocytic nevi',  # 4
# 'mel': 'Melanoma',  # 5
# 'vasc': 'Vascular lesions'  # 6


# define a predict function as an endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data = {}

    # Body parameters
    jsonData = flask.request.get_json()
    img = Image.open(BytesIO(base64.b64decode(jsonData['data'])))

    image = img.resize((150, 112))
    image.show()
    img = ResNetNormImages(image)
    img = img.reshape(1, *(112, 150, 3))

    # Model validation predictions
    yPred_class = model.predict_classes(img)
    yPred = model.predict(img)
    pred = [x * 100 for x in yPred[0]]

    # Compose response
    data["prediction_class"] = str(yPred_class[0])
    data["prediction"] = str(pred)
    data["success"] = True

    # return a response in json format
    return flask.jsonify(data)


# start the flask app, allow remote connections
app.run(host='0.0.0.0')
# http://localhost:5000/predict
