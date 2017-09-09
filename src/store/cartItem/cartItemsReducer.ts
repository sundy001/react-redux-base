import {
    ADD_CART_ITEM,
    UPDATE_CART_ITEM_QUANTITY,
    UPDATE_CART_ITEM_OPTIONS,
    REMOVE_CART_ITEM,
    AddCartItemAction,
    UpdateCartItemQuantityAction,
    UpdateCartItemOptionsAction,
    RemoveCartItemAction,
    updateCartItemQuantity as updateCartItemQuantityAction,
    removeCartItem as removeCartItemAction,
} from './cartItemsActions';
import { assertEntityExist, assertEntitiesExist } from 'services/assets';
import { findIdentityItem } from 'services/cart';
import { combineReducers } from 'redux';
import cartReducer from './cartItemReducer';

const removeCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: RemoveCartItemAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, action.id);

    const byId: app.store.IdStore<app.entity.CartItem> = {...state.byId};
    delete byId[action.id];

    return {
        byId,
        allIds: state.allIds.filter(id => id !== action.id),
    };
}

const updateCartItemQuantity = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemQuantityAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {

    assertEntityExist('cartItems', state, action.id);
    const item = state.byId[action.id];

    if (action.quantity === item.quantity) {
        return state;
    } else if (action.quantity < 0) {
        return removeCartItem(state, removeCartItemAction(action.id));
    } else {
        return {
            byId: {
                ...state.byId,
                [action.id]: cartReducer(state.byId[action.id], action)
            },
            allIds: state.allIds
        };
    }
};

export default (state: app.store.ReadonlyStore<app.entity.CartItem>, action: Action): app.store.ReadonlyStore<app.entity.CartItem> => {
    switch(action.type) {
        case UPDATE_CART_ITEM_QUANTITY: return updateCartItemQuantity(state, action);
        case ADD_CART_ITEM:
            const existingItemId = findIdentityItem(action.options, action.item, action.owner, state.byId);

            let allIds: ReadonlyArray<string>;
            let resultAction: AddCartItemAction | UpdateCartItemQuantityAction | UpdateCartItemOptionsAction;

             if (existingItemId === undefined) {
                resultAction = action;
                allIds = [ ...state.allIds, resultAction.id ];
             } else {
                resultAction = updateCartItemQuantityAction(existingItemId, state.byId[existingItemId].quantity + action.quantity);
                allIds = state.allIds;
             }
        case UPDATE_CART_ITEM_OPTIONS:

            return {
                byId: {
                    ...state.byId,
                    [resultAction.id]: cartReducer(state.byId[resultAction.id], resultAction)
                },
                allIds
            };
        case REMOVE_CART_ITEM: return removeCartItem(state, action);
        default:
            return state;
    }
};

type Action = AddCartItemAction | UpdateCartItemQuantityAction | UpdateCartItemOptionsAction | RemoveCartItemAction;
