import cv2 as cv
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

# NORM 1
# xTrainMean = np.mean(xTrain)
# xTrainStd = np.std(xTrain)

# xTestMean = np.mean(xTest)
# xTestStd = np.std(xTest)

# xValMean = np.mean(xValidate)
# xValStd = np.std(xValidate)

# xTrain = (xTrain - xTrainMean)/xTrainStd
# xTest = (xTest - xTestMean)/xTestStd
# xValidate = (xValidate - xValMean)/xValStd

# NORM 2
xTrain = xTrain.astype('float32') / 255.
xTest = xTest.astype('float32') / 255.
xValidate = xValidate.astype('float32') / 255.


newImgSize = (100, 100, 3)
xTrain = xTrain.reshape(xTrain.shape[0], *newImgSize)
xTest = xTest.reshape(xTest.shape[0], *imageSize)
xValidate = xValidate.reshape(xValidate.shape[0], *newImgSize)

epochs = 50
batch_size = 10

input_img = Input(shape=imageSize)

# autoencoder = load_model('models/autoEnc/autoencoder.h5', custom_objects={
autoencoder = load_model('models/autoEncWoNorm/autoencoderWoNorm.h5', custom_objects={
    'CalculateF1Score': utils.CalculateF1Score})

# Model test predictions
yPred = autoencoder.predict(xTest)

img = yPred[0]

# Initiate ORB detector
orb = cv.ORB_create()
# find the keypoints with ORB
kp = orb.detect(img, None)

# compute the descriptors with ORB
kp, des = orb.compute(img, kp)

print('Key points: {0}'.format(des))

kpimg = cv.drawKeypoints(
    yPred[0], kp, None, flags=cv.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
plt.imshow(kpimg), plt.show()


# draw only keypoints location,not size and orientation
img2 = cv.drawKeypoints(yPred[0], kp, None, color=(0, 255, 0), flags=0)
plt.imshow(img2), plt.show()
