import matplotlib.pyplot as plt
import numpy as np
import itertools

# Function to plot model's loss and accuracy graphics


def PlotTrainEvolutionHistory(trainHistory, accProp, valAccProp):
    fig, axs = plt.subplots(1, 3, figsize=(15, 5))
    f1Score = 'CalculateF1Score'
    valF1Score = 'val_CalculateF1Score'

    # plot f1 score
    axs[0].plot(range(1, len(trainHistory.history[f1Score])+1),
                trainHistory.history[f1Score])
    axs[0].plot(range(1, len(trainHistory.history[valF1Score])+1),
                trainHistory.history[valF1Score])
    axs[0].set_title('Model F1 Score')
    axs[0].set_ylabel('F1 Score')
    axs[0].set_xlabel('Epoch')
    axs[0].set_xticks(np.arange(
        1, len(trainHistory.history[f1Score])+1), len(trainHistory.history[f1Score])/10)
    axs[0].legend(['train', 'val'], loc='best')

    # plot accuracy
    axs[1].plot(range(1, len(trainHistory.history[accProp])+1),
                trainHistory.history[accProp])
    axs[1].plot(range(1, len(trainHistory.history[valAccProp])+1),
                trainHistory.history[valAccProp])
    axs[1].set_title('Model Accuracy')
    axs[1].set_ylabel('Accuracy')
    axs[1].set_xlabel('Epoch')
    axs[1].set_xticks(np.arange(
        1, len(trainHistory.history[accProp])+1), len(trainHistory.history[accProp])/10)
    axs[1].legend(['train', 'val'], loc='best')

    # plot loss
    axs[2].plot(range(1, len(trainHistory.history['loss'])+1),
                trainHistory.history['loss'])
    axs[2].plot(range(1, len(trainHistory.history['val_loss'])+1),
                trainHistory.history['val_loss'])
    axs[2].set_title('Model Loss')
    axs[2].set_ylabel('Loss')
    axs[2].set_xlabel('Epoch')
    axs[2].set_xticks(np.arange(
        1, len(trainHistory.history['loss'])+1), len(trainHistory.history['loss'])/10)
    axs[2].legend(['train', 'val'], loc='best')
    plt.show()


# Function to plot confusion matrix
def PlotConfusionMatrix(confusionMatrix, classes=range(7)):
    plt.imshow(confusionMatrix, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('Confusion matrix')
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    thresh = confusionMatrix.max() / 2.
    for i, j in itertools.product(range(confusionMatrix.shape[0]), range(confusionMatrix.shape[1])):
        plt.text(j, i, confusionMatrix[i, j],
                 horizontalalignment="center",
                 color="white" if confusionMatrix[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.show()


# Function to plot Fraction classified incorrectly
def PlotFractionClassifiedIncorrectly(confusion_mtx):
    label_frac_error = 1 - np.diag(confusion_mtx) / \
        np.sum(confusion_mtx, axis=1)
    plt.bar(np.arange(7), label_frac_error)
    plt.xlabel('True Label')
    plt.ylabel('Fraction classified incorrectly')
    plt.show()
