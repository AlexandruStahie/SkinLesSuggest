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


def encoder(input_img):
    # encoder
    conv1 = Conv2D(32, (3, 3), activation='relu', padding='same')(input_img)
    conv1 = BatchNormalization()(conv1)
    conv1 = Conv2D(32, (3, 3), activation='relu', padding='same')(conv1)
    conv1 = BatchNormalization()(conv1)
    pool1 = MaxPooling2D(pool_size=(2, 2))(conv1)
    conv2 = Conv2D(64, (3, 3), activation='relu', padding='same')(pool1)
    conv2 = BatchNormalization()(conv2)
    conv2 = Conv2D(64, (3, 3), activation='relu', padding='same')(conv2)
    conv2 = BatchNormalization()(conv2)
    pool2 = MaxPooling2D(pool_size=(2, 2))(conv2)
    conv3 = Conv2D(128, (3, 3), activation='relu', padding='same')(pool2)
    conv3 = BatchNormalization()(conv3)
    conv3 = Conv2D(128, (3, 3), activation='relu', padding='same')(conv3)
    conv3 = BatchNormalization()(conv3)
    conv4 = Conv2D(256, (3, 3), activation='relu', padding='same')(conv3)
    conv4 = BatchNormalization()(conv4)
    conv4 = Conv2D(256, (3, 3), activation='relu', padding='same')(conv4)
    conv4 = BatchNormalization()(conv4)
    return conv4


def decoder(conv4):
    conv5 = Conv2D(128, (3, 3), activation='relu', padding='same')(conv4)
    conv5 = BatchNormalization()(conv5)
    conv5 = Conv2D(128, (3, 3), activation='relu', padding='same')(conv5)
    conv5 = BatchNormalization()(conv5)
    conv6 = Conv2D(64, (3, 3), activation='relu', padding='same')(conv5)
    conv6 = BatchNormalization()(conv6)
    conv6 = Conv2D(64, (3, 3), activation='relu', padding='same')(conv6)
    conv6 = BatchNormalization()(conv6)
    up1 = UpSampling2D((2, 2))(conv6)
    conv7 = Conv2D(32, (3, 3), activation='relu', padding='same')(up1)
    conv7 = BatchNormalization()(conv7)
    conv7 = Conv2D(32, (3, 3), activation='relu', padding='same')(conv7)
    conv7 = BatchNormalization()(conv7)
    up2 = UpSampling2D((2, 2))(conv7)
    decoded = Conv2D(3, (3, 3), activation='sigmoid', padding='same')(up2)
    return decoded


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

autoencoder = Model(input_img, decoder(encoder(input_img)))
autoencoder.compile(
    loss="mse", optimizer="adadelta", metrics=['accuracy', utils.CalculateF1Score])
autoencoder.summary()

history = autoencoder.fit(xTrain, xTrain, batch_size=batch_size,
                          epochs=epochs, verbose=1, validation_data=(xValidate, xValidate))
autoencoder.save('models/autoEncWoNorm/autoencoderWoNorm.h5')
utils.PlotTrainEvolutionHistory(history, 'accuracy', 'val_accuracy')

autoencoder = load_model('models/autoEncWoNorm/autoencoderWoNorm.h5', custom_objects={
    'CalculateF1Score': utils.CalculateF1Score})


# Model test predictions
yPred = autoencoder.predict(xTest)


# PLOT
n = 10  # how many digits we will display
plt.figure(figsize=(20, 4))
for i in range(n):
    # display original
    ax = plt.subplot(2, n, i + 1)
    plt.imshow(xTest[i].reshape(newImgSize))
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)

    # display reconstruction
    ax = plt.subplot(2, n, i + 1 + n)
    plt.imshow(yPred[i].reshape(newImgSize))
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
plt.show()
