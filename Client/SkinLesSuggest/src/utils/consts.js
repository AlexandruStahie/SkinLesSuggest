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

const possibleSolutionsShortCuts = [
  'akiec',
  'bcc',
  'bkl',
  'df',
  'nv',
  'mel',
  'vasc',
];

const instructions = [
  { text: 'Take clear pictures;', key: 1 },
  { text: 'Frame the lesion well;', key: 2 },
  { text: 'Use the custom zoom for a good fit;', key: 3 },
  { text: 'Example image:', key: 4 }
];

const disclaimers = [
  { text: 'Please notice that the application offers only suggestions regarding the categorization of your injuries.', key: 1 },
  { text: 'The received result is not a real diagnostic, just an suggestion. For a valid diagnostic please contact a medic.', key: 2, extraStyle: { marginTop: 20 } }
];

const chartLegend = [
  { text: 'akiec - Actinic keratoses', key: 1 },
  { text: 'bcc - Basal cell carcinoma', key: 2 },
  { text: 'bkl - Benign keratosis-like lesions', key: 3 },
  { text: 'df - Dermatofibroma', key: 4 },
  { text: 'nv - Melanocytic nevi', key: 5 },
  { text: 'mel - Melanoma', key: 6 },
  { text: 'vasc - Vascular lesions', key: 7 },
];

export {
  colors,
  possibleSolutions,
  possibleSolutionsShortCuts,
  instructions,
  disclaimers,
  chartLegend
};
