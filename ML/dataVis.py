import utils
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(123)
inputData = utils.GetInputData((100, 75))

# Plot 4 graphics with different data statistics from csv input
plt.figure(figsize=(20, 14))
plt.subplot(2, 2, 1)
fig = sns.countplot(
    y=inputData['cellType'], order=inputData['cellType'].value_counts().index, palette='viridis')
plt.xticks(fig.get_xticks())
plt.title('Most Frequent Type of Cells')

plt.subplot(2, 2, 2)
sns.kdeplot(inputData['age'], shade=True, color='blue')
plt.title('Age Distribution')
plt.xticks(list(range(0, 100, 10)))

plt.subplot(2, 2, 3)
fig = sns.countplot(x=inputData['localization'], order=inputData['localization'].value_counts(
).index, palette='inferno')
plt.xticks(fig.get_xticks(), rotation=90)
plt.title('Most Frequent Localizations')

plt.subplot(2, 2, 4)
fig = sns.countplot(
    x=inputData['sex'], order=inputData['sex'].value_counts().index, palette='summer')
plt.xticks(fig.get_xticks(), rotation=90)
plt.title('Sex')

plt.show()


# dispaly sample of 5 images from each classification class
n_samples = 5
fig, m_axs = plt.subplots(7, n_samples, figsize=(4*n_samples, 3*7))
for n_axs, (type_name, type_rows) in zip(m_axs,
                                         inputData.sort_values(['cellType']).groupby('cellType')):
    n_axs[0].set_title(type_name)
    for c_ax, (_, c_row) in zip(n_axs, type_rows.sample(n_samples, random_state=1234).iterrows()):
        c_ax.imshow(c_row['image'])
        c_ax.axis('off')

plt.show()
