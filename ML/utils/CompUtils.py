import os
import numpy as np
from PIL import Image
import pandas as pd
from glob import glob
from tensorflow.keras import backend as K
from .LabelsDictionary import labelDictionary


# Read Images and Data related to it
def GetInputData(resizeDims):
    # inputDirectory = os.path.join('input')
    inputDirectory = os.path.join('newInput')

    # Get images from both folders HAM10000_images_part1 and HAM10000_images_part2
    imagesPath = {os.path.splitext(os.path.basename(x))[0]: x
                  for x in glob(os.path.join(inputDirectory, '*', '*.jpg'))}

    # read csv file
    inputData = pd.read_csv(os.path.join(
        inputDirectory, 'HAM10000_metadata.csv'))

    # Create new props for csv object
    inputData['path'] = inputData['image_id'].map(imagesPath.get)
    inputData['cellType'] = inputData['dx'].map(labelDictionary.get)
    inputData['cellTypeId'] = pd.Categorical(inputData['cellType']).codes

    # Dispaly a sample of data
    # print('Input data head: {0}'.format(inputData.head()))

    # Replace null ages with a mean of other age fields
    inputData.isnull().sum()
    inputData['age'].fillna((inputData['age'].mean()), inplace=True)
    inputData.isnull().sum()

    # Read and resize images
    inputData['image'] = inputData['path'].map(
        lambda x: np.asarray(Image.open(x).resize(resizeDims)))

    # Print image shape info
    # print('image shape info after read images: {0}'.format(
    #     inputData['image'].map(lambda x: x.shape).value_counts()))

    # Get general statistics for the dataset
    # print('input describe: {0}'.format(
    #     inputData.describe(exclude=[np.number])))

    return inputData


# Normalization per each channel
def ResNetNormImages(images):
    images = np.asarray(images).astype(np.float64)
    images = images[:, :, :, ::-1]
    m0 = np.mean(images[:, :, :, 0])
    m1 = np.mean(images[:, :, :, 1])
    m2 = np.mean(images[:, :, :, 2])
    images[:, :, :, 0] -= m0
    images[:, :, :, 1] -= m1
    images[:, :, :, 2] -= m2
    return images


# Function to calculate the F1 score - taken from keras old implementation
def CalculateF1Score(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    recall = true_positives / (possible_positives + K.epsilon())
    f1_val = 2*(precision*recall)/(precision+recall+K.epsilon())
    return f1_val
