import 'what-input';
import * as React from 'react';
import Test from './Test';
import { storiesOf } from '@storybook/react';

storiesOf('Ripple', module)
    .add('basic', () => (
        <Test>Hello Button</Test>
    ))
;
