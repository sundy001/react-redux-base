import '../../scss/all';
import * as React from 'react';
import * as classNames from 'classnames';

const Submenu = ({
    items,
    onClick,
}: Props) => {
    const submenuItems = items.map(({
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
            {submenuItems}
        </ul>
    );
};

export default Submenu;

export type SubmenuItem =  {
    id: number,
    title: string,
    isActive: boolean
};

type Props = {
    readonly items: ReadonlyArray<SubmenuItem>
    readonly onClick?: React.MouseEventHandler<HTMLLIElement>
};

