import { configure } from '@storybook/react';

function loadStories() {
  require('../src/components/Button/story.tsx');
  require('../src/components/WaveButton/story.tsx');
  require('../src/components/WaveEffect/story.tsx');
  require('../src/components/List/story.tsx');
}

configure(loadStories, module);
