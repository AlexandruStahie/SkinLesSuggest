
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

inputDataWoNevi = inputData.drop(
    inputData[inputData['cellTypeId'] == 4].iloc[:len(inputData)].index)


features = nevi.drop(columns=['cellTypeId'], axis=1)
target = nevi['cellTypeId']

xTrainSplit, xTest, yTrainSplit, yTest = train_test_split(
    features, target, test_size=0.05, random_state=123)

xTrain, xValidate, yTrain, yValidate = train_test_split(
    xTrainSplit, yTrainSplit, test_size=0.35, random_state=123)

xTrain = np.asarray(xTrain['image'].tolist())
xTest = np.asarray(xTest['image'].tolist())
xValidate = np.asarray(xValidate['image'].tolist())

inputDataWoNevi = np.asarray(inputDataWoNevi['image'].tolist())

# NORM
# xTrainMean = np.mean(xTrain)
# xTrainStd = np.std(xTrain)

# xTestMean = np.mean(xTest)
# xTestStd = np.std(xTest)

# xValMean = np.mean(xValidate)
# xValStd = np.std(xValidate)

# xTrain = (xTrain - xTrainMean)/xTrainStd
# xTest = (xTest - xTestMean)/xTestStd
# xValidate = (xValidate - xValMean)/xValStd

# NO NORM
xTrain = xTrain.astype('float32') / 255.
xTest = xTest.astype('float32') / 255.
xValidate = xValidate.astype('float32') / 255.

inputDataWoNevi = inputDataWoNevi.astype('float32') / 255.


newImgSize = (100, 100, 3)
xTrain = xTrain.reshape(xTrain.shape[0], *newImgSize)
xTest = xTest.reshape(xTest.shape[0], *imageSize)
xValidate = xValidate.reshape(xValidate.shape[0], *newImgSize)

inputDataWoNevi = inputDataWoNevi.reshape(
    inputDataWoNevi.shape[0], *newImgSize)

epochs = 50
batch_size = 10

# autoencoder = load_model('models/autoEnc/autoencoder.h5', custom_objects={
autoencoder = load_model('models/autoEncWoNorm/autoencoderWoNorm.h5', custom_objects={
    'CalculateF1Score': utils.CalculateF1Score})

# Model test predictions
goodImagesPred = autoencoder.predict(xTest)
badImagesPred = autoencoder.predict(inputDataWoNevi)

# reconstruction error
rec1 = np.sum((goodImagesPred - xTest)**2, axis=(1, 2, 3))
rec2 = np.sum((badImagesPred - inputDataWoNevi)**2, axis=(1, 2, 3))

# histogram
plt.figure(figsize=(10, 5))
plt.subplot(2, 1, 1)
plt.hist(rec1, bins=30, range=(0, 300), color='g')
plt.tick_params(axis='x', which='both', bottom=False,
                top=False, labelbottom=False)
plt.ylabel("count of good images")
plt.subplot(2, 1, 2)
plt.hist(rec2, bins=30, range=(0, 300), color='r')
plt.xlabel("reconstruction error")
plt.ylabel("count of bad images")
plt.show()


np.shape(goodImagesPred)
plt.figure(figsize=(8, 8))
plt.scatter(goodImagesPred[:, 0], goodImagesPred[:, 1])
plt.show()

np.shape(badImagesPred)
plt.figure(figsize=(8, 8))
plt.scatter(badImagesPred[:, 0], badImagesPred[:, 1])
plt.show()
