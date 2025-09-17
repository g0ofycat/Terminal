import { paragraph, iconFrames, loadingFrames, artText } from './js_files/terminal_content.js';
import { Terminal } from './js_files/terminal_main.js';

const app = new Terminal({ paragraph, iconFrames, loadingFrames, artText });

app.init();