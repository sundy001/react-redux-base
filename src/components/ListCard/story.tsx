import 'what-input';
import * as React from 'react';
import ListCard from './ListCard';
import { storiesOf } from '@storybook/react';

storiesOf('ListCard', module)
    .add('basic', () => (
        <ul className="list">
            <ListCard>Hello Button</ListCard>
        </ul>
    ))
;
