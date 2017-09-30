import { configure } from '@storybook/react';

function loadStories() {
  require('../src/components/Button/story.tsx');
  require('../src/components/WaveButton/story.tsx');
  require('../src/components/WaveEffect/story.tsx');
  require('../src/components/Submenu/story.tsx');
  require('../src/components/ProductListItem/story.tsx');
  require('../src/components/Modal/story.tsx');
  require('../src/components/RippleContainer/story.tsx');
}

configure(loadStories, module);
