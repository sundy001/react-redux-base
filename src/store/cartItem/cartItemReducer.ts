import {
    ADD_CART_ITEM,
    UPDATE_CART_ITEM_QUANTITY,
    UPDATE_CART_ITEM_OPTIONS,
    AddCartItemAction,
    UpdateCartItemQuantityAction,
    UpdateCartItemOptionsAction,
} from './cartItemsActions';

const itemOptionMapper = (option: app.store.GenericId): string => `${option.type}|${option.id}`;

export const createCartItem = (
    id: string,
    item: string,
    owner: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): app.entity.CartItem => {
    return {
        id,
        item,
        owner,
        quantity,
        options,
    }
};

export default (
    state: app.entity.CartItem,
    action: Action
): app.entity.CartItem => {
    switch(action.type) {
        case ADD_CART_ITEM:
            return createCartItem(action.id, action.item, action.owner, action.quantity, action.options);
        case UPDATE_CART_ITEM_QUANTITY:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                quantity: action.quantity,
            };
        case UPDATE_CART_ITEM_OPTIONS:
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                quantity: action.quantity,
                options: action.options,
            };
        default:
            return state;
    }
}

type Action = AddCartItemAction | UpdateCartItemQuantityAction | UpdateCartItemOptionsAction;
