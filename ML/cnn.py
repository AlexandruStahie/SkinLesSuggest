import utils
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from keras.utils.np_utils import to_categorical
from keras.preprocessing.image import ImageDataGenerator

import tensorflow.keras
from tensorflow.keras.callbacks import ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPool2D
from tensorflow.keras.models import Sequential
from tensorflow.keras.utils import plot_model

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

np.random.seed(123)
inputData = utils.GetInputData((100, 75))


akiec = inputData[inputData['cellTypeId'] == 0]
bcc = inputData[inputData['cellTypeId'] == 1]
bkl = inputData[inputData['cellTypeId'] == 2]
df = inputData[inputData['cellTypeId'] == 3]
nv = inputData[inputData['cellTypeId'] == 4]
mel = inputData[inputData['cellTypeId'] == 5]
vasc = inputData[inputData['cellTypeId'] == 6]


print('akiec: {0}'.format(len(akiec)))
print('bcc: {0}'.format(len(bcc)))
print('bkl: {0}'.format(len(bkl)))
print('df: {0}'.format(len(df)))
print('nv: {0}'.format(len(nv)))
print('mel: {0}'.format(len(mel)))
print('vasc: {0}'.format(len(vasc)))


# # What we know
# features = inputData.drop(columns=['cellTypeId'], axis=1)
# # What we want to predict
# target = inputData['cellTypeId']

# xTrainSplit, xTestSplit, yTrainSplit, yTestSplit = train_test_split(
#     features, target, test_size=0.05, random_state=123)

# xTrain, xValidate, yTrain, yValidate = train_test_split(
#     xTrainSplit, yTrainSplit, test_size=0.30, random_state=123)

# Split
trainToSplit, validate = train_test_split(
    inputData, test_size=0.35, random_state=123)

train, test = train_test_split(
    trainToSplit, test_size=0.15, random_state=123)

# Change Test set
melanocyticNevi = test[test['cellTypeId'] == 4]
test = test.drop(
    test[test['cellTypeId'] == 4].iloc[:len(test)].index)
test = pd.concat([test, melanocyticNevi[:150]])


# Display new distribution of data
fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
train['cellType'].value_counts().plot(kind='bar', ax=ax1)
plt.show()

fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
test['cellType'].value_counts().plot(kind='bar', ax=ax1)
plt.show()

fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
validate['cellType'].value_counts().plot(kind='bar', ax=ax1)
plt.show()


# Label / feature split
xTrain = train.drop(columns=['cellTypeId'], axis=1)
xValidate = validate.drop(columns=['cellTypeId'], axis=1)
xTestSplit = test.drop(columns=['cellTypeId'], axis=1)

yTrain = train['cellTypeId']
yValidate = validate['cellTypeId']
yTestSplit = test['cellTypeId']


xTrain = np.asarray(xTrain['image'].tolist())
xTest = np.asarray(xTestSplit['image'].tolist())
xValidate = np.asarray(xValidate['image'].tolist())

# Norm 1
xTrainMean = np.mean(xTrain)
xTrainStd = np.std(xTrain)

xTestMean = np.mean(xTest)
xTestStd = np.std(xTest)

xValMean = np.mean(xValidate)
xValStd = np.std(xValidate)

xTrain = (xTrain - xTrainMean)/xTrainStd
xTest = (xTest - xTestMean)/xTestStd
xValidate = (xValidate - xValMean)/xValStd

# Norm 2
# xTrain = xTrain.astype('float32') / 255.
# xTest = xTest.astype('float32') / 255.
# xValidate = xValidate.astype('float32') / 255.


# Perform one-hot encoding on the labels
yTrain = to_categorical(yTrain, num_classes=7)
yTest = to_categorical(yTestSplit, num_classes=7)
yValidate = to_categorical(yValidate, num_classes=7)


# Reshape image in 3 dimensions (height = 75px, width = 100px, canal = 3 RGB)
imageSize = (75, 100, 3)
xTrain = xTrain.reshape(xTrain.shape[0], *imageSize)
xTest = xTest.reshape(xTest.shape[0], *imageSize)
xValidate = xValidate.reshape(xValidate.shape[0], *imageSize)


# print('total features length : {0}'.format(len(features)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xTrain length : {0}'.format(len(xTrain)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xValidate length : {0}'.format(len(xValidate)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xTest length : {0}'.format(len(xTest)))


# CNN model architechture
# [Conv2D->relu (32)]*2 -> MaxPool2D -> Dropout]
# [Conv2D->relu (64)]*2 -> MaxPool2D -> Dropout]
# Flatten -> Dense -> Dropout -> Out
numClasses = 7

model = Sequential()
model.add(Conv2D(32, kernel_size=(3, 3), activation='relu',
                 padding='Same', input_shape=imageSize))
model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', padding='Same',))
model.add(MaxPool2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(64, (3, 3), activation='relu', padding='Same'))
model.add(Conv2D(64, (3, 3), activation='relu', padding='Same'))
model.add(MaxPool2D(pool_size=(2, 2)))
model.add(Dropout(0.5))

model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(numClasses, activation='softmax'))
model.summary()

# plot_model(model, to_file='cnn.png', rankdir='LR')

# Define the optimizer
optimizer = Adam(lr=0.001, beta_1=0.9, beta_2=0.999,
                 epsilon=None, decay=0.0, amsgrad=False)

# Compile the model
model.compile(optimizer=optimizer,
              loss="categorical_crossentropy",
              metrics=['accuracy', utils.CalculateF1Score])

# Set a learning rate reductor
learningRateReduction = ReduceLROnPlateau(
    monitor='val_accuracy', patience=3, verbose=1, factor=0.5, min_lr=0.00001)

# With data augmentation to prevent overfitting
datagen = ImageDataGenerator(
    rotation_range=10,
    zoom_range=0.1,
    width_shift_range=0.1,
    height_shift_range=0.1)
datagen.fit(xTrain)


# Fit the model
epochs = 50
batchSize = 10
history = model.fit(datagen.flow(xTrain, yTrain, batch_size=batchSize),
                    epochs=epochs, validation_data=(xValidate, yValidate),
                    verbose=1, steps_per_epoch=xTrain.shape[0] // batchSize,
                    callbacks=[learningRateReduction])


print('Model metrics name: {0}'.format(model.metrics_names))

loss, accuracy, f1Score = model.evaluate(
    xTest, yTest, verbose=1)

lossVal, accuracyVal, f1ScoreVal = model.evaluate(
    xValidate, yValidate, verbose=1)


utils.PrintValidationStats(accuracyVal, lossVal, f1ScoreVal)
utils.PrintTestStats(accuracy, loss, f1Score)

model.save("models/cnn/CNNModel_epochs{0}.h5".format(epochs))
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
