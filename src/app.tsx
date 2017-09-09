import "reflect-metadata";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './style';
import Button from 'components/Button';
import Modal from 'components/Modal';
import List from 'components/List';
import { StickyContainer, Sticky } from 'components/Sticky';

const items = [
    { id: 1, title: 'salads', isActive: true },
    { id: 2, title: 'wraps', isActive: false  },
    { id: 3, title: 'bowls', isActive: false  },
    { id: 4, title: 'snacks', isActive: false  },
    { id: 5, title: 'pastry', isActive: false  },
];

ReactDOM.render(
    <div>
        <List items={items}></List>
    </div>,
    document.getElementById('app')
);
