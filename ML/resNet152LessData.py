import utils
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import keras
from keras import regularizers
from keras.preprocessing.image import ImageDataGenerator
from keras.utils.np_utils import to_categorical

from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.models import Sequential
from tensorflow.keras.applications import resnet

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

np.random.seed(123)
inputData = utils.GetInputData((150, 112))

inputData = inputData.drop(
    inputData[inputData['cellTypeId'] == 4].iloc[:2500].index)


# The dataset includes lesions with multiple images, which can be tracked by the lesion_id column
# We group the images number under the same lesion that they belong
inputData['num_images'] = inputData.groupby(
    'lesion_id')["image_id"].transform("count")

# Split inputData in Single & Multiple images per lesion vars
sgLesImg = inputData[inputData['num_images'] == 1]
mltLesImg = inputData[inputData['num_images'] != 1]

# Shuffle & Split Dataset
train1, testSet = train_test_split(sgLesImg, test_size=0.20, random_state=80)
train2, validateSet = train_test_split(train1, test_size=0.20, random_state=80)
train = pd.concat([train2, mltLesImg])

# Display new distribution of data
# fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
# train['cellType'].value_counts().plot(kind='bar', ax=ax1)
# plt.show()

# fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
# testSet['cellType'].value_counts().plot(kind='bar', ax=ax1)
# plt.show()

# fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
# validateSet['cellType'].value_counts().plot(kind='bar', ax=ax1)
# plt.show()


# Norm images
xTrain = utils.ResNetNormImages(list(train['image']))
xTest = utils.ResNetNormImages(list(testSet['image']))
xValidate = utils.ResNetNormImages(list(validateSet['image']))

# Features / Target split
yTrain = np.asarray(train['cellTypeId'])
yTest = np.asarray(testSet['cellTypeId'])
yValidate = np.asarray(validateSet['cellTypeId'])

# Resize images
imageSize = (112, 150, 3)
xTrain = xTrain.reshape(xTrain.shape[0], *imageSize)
xTest = xTest.reshape(xTest.shape[0], *imageSize)
xValidate = xValidate.reshape(xValidate.shape[0], *imageSize)

# Perform one-hot encoding on the labels
yTrain = to_categorical(yTrain, num_classes=7)
yTest = to_categorical(yTest, num_classes=7)
yValidate = to_categorical(yValidate, num_classes=7)

data_gen = ImageDataGenerator(
    rotation_range=90,
    zoom_range=0.1,
    width_shift_range=0.1,
    height_shift_range=0.1)
data_gen.fit(xTrain)


print('total features length : {0}'.format(len(inputData)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xTrain length : {0}'.format(len(xTrain)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xValidate length : {0}'.format(len(xValidate)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xTest length : {0}'.format(len(xTest)))


# ResNet50 model architechture
# baseModel = ResNet50
# model = dropout -> dense -> dropout -> dense -> out
numClasses = 7

model = Sequential()
baseModel = resnet.ResNet152(include_top=False, weights='imagenet',
                             input_shape=imageSize, pooling='max')

for layer in baseModel.layers:
    # freeze the weights of a particular layer
    layer.trainable = False

# defreeze just the last 25 layers
for layer in baseModel.layers[-50:]:
    layer.trainable = True

# print freezed status for each layers
for l in baseModel.layers:
    print(l.name, l.trainable)

model.add(baseModel)
model.add(Dropout(0.5))
model.add(Dense(128, activation="relu", kernel_regularizer=regularizers.l2(0.02)))
model.add(Dropout(0.5))
model.add(Dense(numClasses, activation='softmax',
                kernel_regularizer=regularizers.l2(0.02)))
model.summary()

optimizer = Adam(lr=0.001, beta_1=0.9, beta_2=0.999,
                 epsilon=None, decay=1e-6, amsgrad=False)

model.compile(optimizer=optimizer,
              loss="categorical_crossentropy",
              metrics=['accuracy', utils.CalculateF1Score])


cb_early_stopper = EarlyStopping(
    monitor='val_loss', mode='min', patience=10)

# Set a learning rate reductor
learningRateReduction = ReduceLROnPlateau(
    monitor='val_accuracy', patience=3, verbose=1, factor=0.5, min_lr=0.00001)


# Fit the model (50 epochs with batch size as 10)
epochs = 50
batchSze = 10
history = model.fit(data_gen.flow(xTrain, yTrain, batch_size=batchSze),
                    epochs=epochs, validation_data=(
    xValidate, yValidate),
    verbose=1, steps_per_epoch=xTrain.shape[0] // batchSze,
    callbacks=[cb_early_stopper, learningRateReduction])


print('Model metrics name: {0}'.format(model.metrics_names))

loss, accuracy, f1Score = model.evaluate(
    xTest, yTest, verbose=1)

lossVal, accuracyVal, f1ScoreVal = model.evaluate(
    xValidate, yValidate, verbose=1)


utils.PrintValidationStats(accuracyVal, lossVal, f1ScoreVal)
utils.PrintTestStats(accuracy, loss, f1Score)

model.save(
    "models/resNet152LessData/resNet152LessDataModel_epochs{0}.h5".format(epochs))
utils.PlotTrainEvolutionHistory(history, 'accuracy', 'val_accuracy')


# Model test predictions
yPred = model.predict(xTest)
# Transform test predictions classes to one hot vectors
yPredClasses = np.argmax(yPred, axis=1)
# Transform test target to one hot vectors
yTrue = np.argmax(yTest, axis=1)
# Create confusion matrix
confusionMatrix = confusion_matrix(yTrue, yPredClasses)
# Plot the confusion matrix
utils.PlotConfusionMatrix(confusionMatrix)


utils.PlotFractionClassifiedIncorrectly(confusionMatrix)
