import { configure } from '@storybook/react';

function loadStories() {
  require('../src/components/Button/story.tsx');
  require('../src/components/List/story.tsx');
  // You can require as many stories as you need.
}

configure(loadStories, module);
