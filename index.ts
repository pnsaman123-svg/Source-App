import { Buffer } from 'buffer';
// Polyfill Buffer globally for react-native-svg
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
