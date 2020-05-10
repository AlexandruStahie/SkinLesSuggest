import utils
import numpy as np
import matplotlib.pyplot as plt

from keras.utils.np_utils import to_categorical

import tensorflow.keras
from tensorflow.keras import regularizers
from tensorflow.keras.callbacks import ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPool2D
from tensorflow.keras.models import Sequential

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

np.random.seed(123)
inputData = utils.GetInputData((32, 32))

# utils.PrintClassesInfo(inputData)

# Remove 5000 Melanocytic nevi images
inputData = inputData.drop(
    inputData[inputData['cellTypeId'] == 4].iloc[:3500].index)

# Display new distribution of data
fig, ax1 = plt.subplots(1, 1, figsize=(10, 5))
inputData['cellType'].value_counts().plot(kind='bar', ax=ax1)
plt.show()


# What we know
features = inputData.drop(columns=['cellTypeId'], axis=1)
# What we want to predict
target = inputData['cellTypeId']

xTrainSplit, xTestSplit, yTrainSplit, yTestSplit = train_test_split(
    features, target, test_size=0.25, random_state=1234)

xTrain = np.asarray(xTrainSplit['image'].tolist())
xTest = np.asarray(xTestSplit['image'].tolist())

xTrainMean = np.mean(xTrain)
xTrainStd = np.std(xTrain)

xTestMean = np.mean(xTest)
xTestStd = np.std(xTest)

# Print image details before normalization
# utils.PrintImgNormalizationsInfo(
#     xTrain=xTrain, xTrainMean=xTrainMean, xTrainStd=xTrainStd)

xTrain = (xTrain - xTrainMean)/xTrainStd
xTest = (xTest - xTestMean)/xTestStd

# Print image details after normalization
# utils.PrintImgNormalizationsInfo(xTrain=xTrain)

# Perform one-hot encoding on the labels
yTrain = to_categorical(yTrainSplit, num_classes=7)
yTest = to_categorical(yTestSplit, num_classes=7)

imageSize = (32, 32, 3)
xTrain = xTrain.reshape(xTrain.shape[0], *imageSize)
xTest = xTest.reshape(xTest.shape[0], *imageSize)

print('total features length : {0}'.format(len(features)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xTrain length : {0}'.format(len(xTrain)))
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print('xTest length : {0}'.format(len(xTest)))

# CNN model architechture
# [Conv2D->relu(32) -> Conv2D->relu(64) -> MaxPool2D -> Dropout]
# [Conv2D->relu(64) -> MaxPool2D -> Dropout]
# Flatten -> Dense -> Dropout -> Out
numClasses = 7

model = Sequential()
model.add(Conv2D(32, kernel_size=(3, 3), activation='relu',
                 input_shape=imageSize))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPool2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPool2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Flatten())
model.add(Dense(128, activation='relu', kernel_regularizer=regularizers.l2(0.01)))
model.add(Dropout(0.5))
model.add(Dense(numClasses, activation='softmax'))
model.summary()

# Define the optimizer
optimizer = Adam(lr=0.001)

# Compile the model
model.compile(optimizer=optimizer,
              loss="categorical_crossentropy",
              metrics=['accuracy', utils.CalculateF1Score])


# Fit the model (30 epochs with batch size as 15)
epochs = 30
batchSize = 15
history = model.fit(xTrain, yTrain, batch_size=batchSize, epochs=epochs,
                    verbose=1, validation_data=(xTest, yTest))

print('Model metrics name: {0}'.format(model.metrics_names))

loss, accuracy, f1Score = model.evaluate(xTest, yTest, verbose=1)
utils.PrintTestStats(accuracy, loss, f1Score)

model.save("models/cnnLessData/CNNLessDataModel_epochs{0}.h5".format(epochs))
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
