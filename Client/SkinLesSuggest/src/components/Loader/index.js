import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { colors } from '../../utils/consts';

const Loader = () => {
  const contentToRender = (
    <>
      <Spinner
        visible
        overlayColor="rgba(255, 255, 255, 0.7)"
        color={colors.customGreen}
      />
    </>
  );

  return contentToRender;
};

export default Loader;
