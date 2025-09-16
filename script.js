import { paragraph, iconFrames, loadingFrames } from './data/terminal_content.js';
import { Terminal } from './data/terminal_main.js';
const app = new Terminal({ paragraph, iconFrames, loadingFrames });
app.init();