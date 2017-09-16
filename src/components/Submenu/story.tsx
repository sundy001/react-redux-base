import 'what-input';
import * as React from 'react';
import SubmenuWrapper from './SubmenuWrapper';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('Submenu', module)
  .add('normal', () => (
    <SubmenuWrapper></SubmenuWrapper>
  ))
