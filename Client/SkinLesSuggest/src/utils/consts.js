const colors = {
  white: '#FFFFFF',
  black: '#000000',
  customGreen: '#128c82',
  grey: '#8f8f8f',
  red: '#FF0000',
  customBlue: '#052F80'
};

const possibleSolutions = [
  'Actinic keratoses', // # 'akiec': 'Actinic keratoses',  # 0
  'Basal cell carcinoma', // # 'bcc': 'Basal cell carcinoma',  # 1
  'Benign keratosis-like lesions', // # 'bkl': 'Benign keratosis-like lesions',  # 2
  'Dermatofibroma', // # 'df': 'Dermatofibroma',  # 3
  'Melanocytic nevi', // # 'nv': 'Melanocytic nevi',  # 4
  'Melanoma', // # 'mel': 'Melanoma',  # 5
  'Vascular lesions', // # 'vasc': 'Vascular lesions'  # 6
];


export { colors, possibleSolutions };
