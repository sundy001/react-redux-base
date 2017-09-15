import '../../scss/all';
import * as React from 'react';
import * as classNames from 'classnames';

export const List = ({
    items,
    onClick,
}: Props) => {
    const listItems = items.map(({
        id,
        title,
        isActive,
    }) => (
        <li
            key={id}
            data-id={id}
            onClick={onClick}
        >
            <a
                className={
                    classNames('submenu__link', {
                        'is-active': isActive,
                    })
                }
                href="javascript:void(0)"
            >
                {title}
            </a>
        </li>
    ));

    return (
        <ul className="submenu">
            {listItems}
        </ul>
    );
}

export type ListItem =  {
    id: number,
    title: string,
    isActive: boolean
};

type Props = {
    readonly items: ReadonlyArray<ListItem>
    readonly onClick?: React.MouseEventHandler<HTMLLIElement>
};

