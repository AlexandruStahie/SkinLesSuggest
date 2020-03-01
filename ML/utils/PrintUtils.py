

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
