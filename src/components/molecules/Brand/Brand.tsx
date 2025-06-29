import { View, DimensionValue } from 'react-native';
import LogoLight from '@/theme/assets/images/Spalsh_Screen.png';
import LogoDark from '@/theme/assets/images/Spalsh_Screen.png';

import { ImageVariant } from '@/components/atoms';
import { useTheme } from '@/theme';
import { isImageSourcePropType } from '@/types/guards/image';

type Props = {
	height?: DimensionValue;
	width?: DimensionValue;
	mode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
};

function Brand({ height = "100%", width = "100%", mode = 'contain' }: Props) {
	const { layout } = useTheme();

	if (!isImageSourcePropType(LogoLight) || !isImageSourcePropType(LogoDark)) {
		throw new Error('Image source is not valid');
	}

	return (
		<View 
			testID="brand-img-wrapper" 
			style={{ 
				height, 
				width, 
				backgroundColor: '#0A547E',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}}
		>
			<ImageVariant
				testID="brand-img"
				style={[layout.fullHeight, layout.fullWidth]}
				source={LogoLight}
				sourceDark={LogoDark}
				resizeMode={mode}
			/>
		</View>
	);
}

export default Brand;