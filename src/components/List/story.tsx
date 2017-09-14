import * as React from 'react';
import ListWrapper from './ListWrapper';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('List', module)
  .add('normal', () => (
    <ListWrapper></ListWrapper>
  ))
