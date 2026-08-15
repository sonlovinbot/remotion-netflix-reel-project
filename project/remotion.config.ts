import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// The reel is mostly still images pushed around, so quality matters more than
// encode speed here.
Config.setCrf(16);
