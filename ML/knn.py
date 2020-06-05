import utils
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input

from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, accuracy_score
from sklearn.neighbors import KNeighborsClassifier

np.random.seed(123)
model = VGG16(weights='imagenet', include_top=False)
imageSize = (112, 150, 3)
n_neighbors = 4
h = .02
cmap_light = ListedColormap(['orange', 'cyan', 'cornflowerblue'])
cmap_bold = ListedColormap(['darkorange', 'c', 'darkblue'])


def GetFeatureWithVgg(trainSet):
    img_features = []
    labels = []

    for row_index, row in trainSet.iterrows():
        image = row['image']
        label = row['cellTypeId']

        # # For Plot
        # image = image.astype('float32') / 255.
        # image = image.reshape(1, *imageSize)
        # img_features.append(image.flatten())

        image = image.reshape(1, *imageSize)
        image = preprocess_input(image)
        vgg_features = np.array(model.predict(image))

        # print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        # print(vgg_features)
        # break

        img_features.append(vgg_features.flatten())
        labels.append(label)

    return (np.array(img_features), np.array(labels))


inputData = utils.GetInputData((150, 112))

train, test = train_test_split(inputData, test_size=0.30, random_state=1234)
features_list, labels = GetFeatureWithVgg(train)
features_list_test, labels_test = GetFeatureWithVgg(test)

# # FOR PLOT
# features_list = features_list[:, :2]
# features_list_test = features_list_test[:, :2]


neigh = KNeighborsClassifier(n_neighbors=n_neighbors)
neigh.fit(features_list, labels)

y_kmeans = neigh.predict(features_list_test)
acc = accuracy_score(labels_test, y_kmeans)
print('Accuracy: {0}'.format(acc))


y__trainkmeans = neigh.predict(features_list)
acc = accuracy_score(labels, y__trainkmeans)
print('Accuracy train: {0}'.format(acc))


# # PLOT
# # calculate min, max and limits
# x_min, x_max = features_list_test[:, 0].min(
# ) - 1, features_list_test[:, 0].max() + 1
# y_min, y_max = features_list_test[:, 1].min(
# ) - 1, features_list_test[:, 1].max() + 1
# xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
#                      np.arange(y_min, y_max, h))

# # predict class using data and kNN classifier
# Z = neigh.predict(np.c_[xx.ravel(), yy.ravel()])

# # Put the result into a color plot
# Z = Z.reshape(xx.shape)
# plt.figure()
# plt.pcolormesh(xx, yy, Z, cmap=cmap_light)

# # Plot also the training points
# plt.scatter(features_list_test[:, 0],
#             features_list_test[:, 1], c=labels_test, cmap=cmap_bold)
# plt.xlim(xx.min(), xx.max())
# plt.ylim(yy.min(), yy.max())
# plt.title("7-Class classification (k = %i)" % (n_neighbors))
# plt.show()
