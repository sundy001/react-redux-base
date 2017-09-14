import * as React from 'react';
import { List, ListItem } from './List';

export default class DateRangePickerWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            items: [
                { id: 1, title: 'salads', isActive: true },
                { id: 2, title: 'wraps', isActive: false  },
                { id: 3, title: 'bowls', isActive: false  },
                { id: 4, title: 'snacks', isActive: false  },
                { id: 5, title: 'pastry', isActive: false  },
            ],
        }
    }

    onClick = (event: React.MouseEvent<HTMLLIElement>) => {
        const items = this.state.items.map(item => {
            // TODO: change to string key?
            const shouldActive = event.currentTarget.dataset.id === item.id + '';

            return item.isActive !== shouldActive
                ? {...item, isActive: shouldActive}
                : item
            ;
        });

        this.setState({
            items
        });
    }

    render() {
        const { items } = this.state;
        return (
            <List items={items} onClick={this.onClick}></List>
        );
    }
}

interface Props {

}

interface State {
    items: ReadonlyArray<ListItem>;
}
