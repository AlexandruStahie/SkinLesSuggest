# SkinLesSuggest

The main purpose of this project is to provide suggestions for its users based on the images received with their skin lesions. The suggestions consist in classifying the lesion into 7 distinct categories. Of course, the application also offers the possibility to save the received results in a history table, for later re-evaluation. This was implemented by developing a mobile application. The project is divided into 3 main parts:

## 1. ML
  The database used for training, validation and testing is available on Kaggle (Skin Cancer MNIST: HAM10000). Here, multiple classification algorithms were tested in order to compare their results and use the best method in the final mobile application for real predictions. Algorithms and other classification methods used: CNN, ResNet50, Xception (& Inception V3), KNN, Anomaly Detection. The main library used is TensorFlow 2.1 and the program was written in python 3.6.
  
## 2. APIs
  The first API was developed using Flask and python, to make use of the pre-trained machine learning model and based on images received, it will return the new predictions.
  The second API is a .NET Core one, developed in C#, which connects the mobile application and the SQL Server Database. The overall architecture is a MVC one and for the database connection it was used the Entity Framework Core library, code first method. Other main libraries that were used: AutoMapper, Swagger UI and Authentication.JwtBearer (for JSON token authentication). Both the SQL Database and this api were  
 
