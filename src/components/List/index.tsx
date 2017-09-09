import './style';
import * as React from 'react';
import * as classNames from 'classnames';

type Props = {
    items: app.ui.ListItem[]
};

const List = ({
    items
}: Props) => {
    const listItems = items.map(({
        id,
        title,
        isActive,
    }) => (
        <li key={id}>
            <a
                className={classNames({
                    'jason-submenu__link': true,
                    'is-active': isActive,
                })}
                href="#"
            >
                {title}
            </a>
        </li>
    ));

    return (
        <ul className="jason-submenu">
            {listItems}
        </ul>
    );
}

export default List;
