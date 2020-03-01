

# Print image normalization details
def PrintImgNormalizationsInfo(xTrain=None, xTrainMean=None, xTrainStd=None):
    if xTrain is not None:
        print('x Train images: {0}'.format(xTrain))

    if xTrainMean is not None:
        print('x Train Mean: {0}'.format(xTrainMean))

    if xTrainStd is not None:
        print('x Train Std: {0}'.format(xTrainStd))


# Print nr of rows and details for each class values in csv data
def PrintClassesInfo(inputData):
    print('0: {0}'.format(inputData[inputData['cellTypeId'] == 0]))
    print('1: {0}'.format(inputData[inputData['cellTypeId'] == 1]))
    print('2: {0}'.format(inputData[inputData['cellTypeId'] == 2]))
    print('3: {0}'.format(inputData[inputData['cellTypeId'] == 3]))
    print('4: {0}'.format(inputData[inputData['cellTypeId'] == 4]))
    print('5: {0}'.format(inputData[inputData['cellTypeId'] == 5]))
    print('6: {0}'.format(inputData[inputData['cellTypeId'] == 6]))


# Print data resulted from model validation process
def PrintValidationStats(accuracyVal, lossVal, f1ScoreVal):
    print(
        """
          Validation accuracy = %f  ;  
          Validation loss = %f ; 
          Validation F1 scoare = %f"  
        """ %
        (accuracyVal, lossVal, f1ScoreVal)
    )


# Print data resulted from model test process
def PrintTestStats(accuracy, loss, f1Score):
    print(
        """
          Test accuracy = %f  ;  
          Test loss = %f ; 
          Test F1 scoare = %f" 
        """ %
        (accuracy, loss, f1Score)
    )
