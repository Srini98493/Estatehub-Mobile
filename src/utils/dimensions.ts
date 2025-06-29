import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;

export const normalize = (size: number) => {
  return (width / guidelineBaseWidth) * size;
}; 