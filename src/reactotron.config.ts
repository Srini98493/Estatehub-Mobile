import Reactotron from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import { storage } from './App';
import config from '../app.json';

Reactotron.configure({
	name: config.name,
})
	.useReactNative()
	.use(mmkvPlugin({ storage }))
	.connect();

// Remove reactotron-react-query integration temporarily
