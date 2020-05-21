import cv2
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import plot_model
from tensorflow.keras.models import Sequential, Model, load_model
from tensorflow.keras.layers import Dense, UpSampling2D, Conv2D, Input, BatchNormalization, MaxPooling2D
from tensorflow.keras.optimizers import Adam
import utils
import numpy as np
import matplotlib.pyplot as plt

from keras.utils.np_utils import to_categorical
from keras.preprocessing.image import ImageDataGenerator

import tensorflow.keras

np.random.seed(123)
inputData = utils.GetInputData((100, 100))
imageSize = (100, 100, 3)

nevi = inputData[inputData['cellTypeId'] == 4]
features = nevi.drop(columns=['cellTypeId'], axis=1)
target = nevi['cellTypeId']

xTrainSplit, xTest, yTrainSplit, yTest = train_test_split(
    features, target, test_size=0.05, random_state=123)

xTrain, xValidate, yTrain, yValidate = train_test_split(
    xTrainSplit, yTrainSplit, test_size=0.35, random_state=123)

xTrain = np.asarray(xTrain['image'].tolist())
xTest = np.asarray(xTest['image'].tolist())
xValidate = np.asarray(xValidate['image'].tolist())

xTrainMean = np.mean(xTrain)
xTrainStd = np.std(xTrain)

xTestMean = np.mean(xTest)
xTestStd = np.std(xTest)

xValMean = np.mean(xValidate)
xValStd = np.std(xValidate)

xTrain = (xTrain - xTrainMean)/xTrainStd
xTest = (xTest - xTestMean)/xTestStd
xValidate = (xValidate - xValMean)/xValStd

newImgSize = (100, 100, 3)
xTrain = xTrain.reshape(xTrain.shape[0], *newImgSize)
xTest = xTest.reshape(xTest.shape[0], *imageSize)
xValidate = xValidate.reshape(xValidate.shape[0], *newImgSize)

epochs = 50
batch_size = 10

input_img = Input(shape=imageSize)

autoencoder = load_model('models/autoEnc/autoencoder.h5', custom_objects={
    'CalculateF1Score': utils.CalculateF1Score})

# Model test predictions
yPred = autoencoder.predict(xTest)


# # All the 6 methods for comparison in a list
# methods = ['cv2.TM_CCOEFF', 'cv2.TM_CCOEFF_NORMED', 'cv2.TM_CCORR',
#            'cv2.TM_CCORR_NORMED', 'cv2.TM_SQDIFF', 'cv2.TM_SQDIFF_NORMED']

w = 100
h = 100

# Apply template Matching
res = cv2.matchTemplate(xTest[0].astype(
    np.uint8), yPred[0].astype(np.uint8), cv2.TM_CCORR)

print('res: {0}'.format(res))

# # Specify a threshold
# threshold = 0.8

# # Store the coordinates of matched area in a numpy array
# loc = np.where(res >= threshold)

# # Draw a rectangle around the matched region.
# for pt in zip(*loc[::-1]):
#     cv2.rectangle(xTest[0], pt, (pt[0] + w, pt[1] + h), (0, 255, 255), 2)

# # Show the final image with the matched area.
# cv2.imshow('Detected', xTest[0])
# cv2.waitKey(0)
