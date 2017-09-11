import "reflect-metadata";
import 'jest';
import { cloneDeep } from 'lodash';
import {
    ADD_CART_ITEM,
    addCartItem,
    updateCartItemQuantity,
    updateCartItemOptions,
    removeCartItem,
    AddCartItemAction,
} from './cartItemsActions';
import cartItems from './cartItemsReducer';
import {
    createAddExpectation,
    entityNotFoundShouldThrowError,
    storeShouldBeImmutable,
    storeByIdShouldBeImmutable,
    propertyShouldBeImmutable,
    createRandomCartItem,
} from 'services/test';
import { generateEntityId } from 'services/storeUtil';
import * as matchers from 'services/matchers';

describe('cartsReducer', function(this: TestEnv) {
    const createAddCartItemActionByEntity = (cartItem: app.entity.CartItem): AddCartItemAction => {
        return addCartItem(cartItem.item, cartItem.owner, cartItem.quantity, cartItem.options);
    };

    const generateCartItemId = (id: number): string => {
        return generateEntityId('cartItem', id);
    };

    beforeEach(() => {
        jest.addMatchers(matchers as any);

        this.NEXT_ID = 9;

        this.store = {
            byId:{
                cartItem1: {id: 'cartItem1', item: 'item1', owner: 'user2', quantity: 3, options: []},
                cartItem2: {
                    id: 'cartItem2',
                    item: 'item2',
                    owner: 'user2',
                    quantity: 5,
                    options: [
                        {type: 'topping', id: 'topping1'},
                        {type: 'topping', id: 'topping2'},
                        {type: 'topping', id: 'topping3'},
                    ]
                },
                cartItem3: {id: 'cartItem3', item: 'item3', owner: 'user3', quantity: 7, options: []},
                cartItem4: {id: 'cartItem4', item: 'item2', owner: 'user2', quantity: 2, options: []},
                cartItem5: {id: 'cartItem5', item: 'item3', owner: 'user4', quantity: 2, options: []},
            },
            allIds:['cartItem1', 'cartItem2', 'cartItem3', 'cartItem4', 'cartItem5'],
            idCounter: this.NEXT_ID,
        };
    });

    describe('#AddCartItemAction', () => {
        it('should add item when the store is empty', () => {
            const NEXT_ID = 9;
            const newCartItem = createRandomCartItem(generateCartItemId(NEXT_ID), 'item9');
            const initState: app.store.ReadonlyStore<app.entity.CartItem> = { byId:{}, allIds:[], idCounter: NEXT_ID };

            const result = cartItems(initState, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual({
                byId: {
                    [newCartItem.id]: newCartItem,
                },
                allIds: [ newCartItem.id ],
                idCounter: NEXT_ID + 1,
            });
        });

        it('should append new item at tail when new item added', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item9');
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter++;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should sum item quantity when item has same itemId, ownerId and options', () => {
            const QUANTITY = 5;
            const CART_ITEM_ID = 'cartItem1';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId.cartItem1.quantity += QUANTITY;

            const result = cartItems(this.store, addCartItem(
                cartItem.item,
                cartItem.owner,
                QUANTITY,
                cartItem.options,
            ));

            expect(result).toEqual(expectation);
        });

        it('should sum item quantity when item has same itemId, ownerId and options, even if options order is different', () => {
            const QUANTITY = 2;
            const CART_ITEM_ID = 'cartItem2';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId.cartItem2.quantity += QUANTITY;

            const result = cartItems(this.store, addCartItem(
                cartItem.item,
                cartItem.owner,
                QUANTITY,
                [
                    { type: 'topping', id: 'topping3' },
                    { type: 'topping', id: 'topping1' },
                    { type: 'topping', id: 'topping2' },
                ],
            ));

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when item has same ownerId and options but different itemId', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item4', 'user2');
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter++;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when item has same itemId and options but different ownerId', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item8', 'user4');
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter++;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when item has same itemId and ownerId but different options', () => {
            const newCartItem = createRandomCartItem(
                generateCartItemId(this.NEXT_ID),
                'item1',
                'user2',
                undefined,
                [{ type: 'topping', id: 'topping1' }],
            );
            const expectation = createAddExpectation(this.store, newCartItem);
            expectation.idCounter++;

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item  when quantity is 0', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item9', 'user9', 0);

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(this.store);
        });

        it('should return ideintity item  when quantity is < 0', () => {
            const newCartItem = createRandomCartItem(generateCartItemId(this.NEXT_ID), 'item9', 'user9', -3);

            const result = cartItems(this.store, createAddCartItemActionByEntity(newCartItem));

            expect(result).toEqual(this.store);
        });

        storeShouldBeImmutable(this)(cartItems, addCartItem('item2', 'user8', 3, []));
    });

    describe('#updateCartItemQuantity', () => {
        it('should update item quantity', () => {
            const QUANTITY = 8;
            const CART_ITEM_ID = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[CART_ITEM_ID].quantity = QUANTITY;
            const action = updateCartItemQuantity(CART_ITEM_ID, QUANTITY);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item object when quantity is same', () => {
            const CART_ITEM_ID = 'cartItem2';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const action = updateCartItemQuantity(cartItem.id, cartItem.quantity);

            const result = cartItems(this.store, action);

            expect(result).toBe(this.store);
        });

        it('should remove item when quantity is 0', () => {
            const CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);
            const action = updateCartItemQuantity(CART_ITEM_ID, 0);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should remove item when quantity is < 0', () => {
            const CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);
            const action = updateCartItemQuantity(CART_ITEM_ID, -9);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        storeByIdShouldBeImmutable(this)(cartItems, updateCartItemQuantity('cartItem1', 9));
        entityNotFoundShouldThrowError(this)(cartItems, updateCartItemQuantity('cartItem10', 9));
    });

    describe('#updateCartItemOptions', () => {
        it('should update item options when the item belongs to the item owner', () => {
            const CART_ITEM_ID = 'cartItem1';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const cartItem = expectation.byId[CART_ITEM_ID];
            cartItem.options = [{type: 'topping', id: 'topping1'}];
            const action = updateCartItemOptions(CART_ITEM_ID, cartItem.options, {
                [cartItem.owner]: cartItem.quantity
            });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should update item quantity when the item belongs to the item owner', () => {
            const QUANTITY = 6;
            const CART_ITEM_ID = 'cartItem1';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const cartItem = expectation.byId[CART_ITEM_ID];
            cartItem.quantity = QUANTITY;
            const action = updateCartItemOptions(CART_ITEM_ID, cartItem.options, {
                [cartItem.owner]: QUANTITY
            });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should remove item when the quantity of item owner is 0', () => {
            const ZERO_QUANTITY = 0;
            const CART_ITEM_ID = 'cartItem1';
            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);

            const action = updateCartItemOptions(
                CART_ITEM_ID,
                cartItem.options,
                {
                    [cartItem.owner]: ZERO_QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should remove item when the quantity of item owner is < 0', () => {
            const NEGATIVE_QUANTITY = -3;
            const CART_ITEM_ID = 'cartItem1';
            const cartItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);

            const action = updateCartItemOptions(
                CART_ITEM_ID,
                cartItem.options,
                {
                    [cartItem.owner]: NEGATIVE_QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should merge to exist item when the item owner has the same item', () => {
            const QUANTITY = 6;
            const CART_ITEM_ID1 = 'cartItem4';
            const CART_ITEM_ID2 = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[CART_ITEM_ID2].quantity += QUANTITY;
            delete expectation.byId[CART_ITEM_ID1];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID1);

            const action = updateCartItemOptions(
                CART_ITEM_ID1,
                this.store.byId[CART_ITEM_ID2].options,
                {
                    [this.store.byId[CART_ITEM_ID1].owner]: QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should merge and follow existing topping order when the item owner has the same item', () => {
            const QUANTITY = 3;
            const CART_ITEM_ID1 = 'cartItem4';
            const CART_ITEM_ID2 = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[CART_ITEM_ID2].quantity += QUANTITY;
            delete expectation.byId[CART_ITEM_ID1];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID1);

            const action = updateCartItemOptions(
                CART_ITEM_ID1,
                [
                    {type: 'topping', id: 'topping3'},
                    {type: 'topping', id: 'topping1'},
                    {type: 'topping', id: 'topping2'},
                ],
                {
                    [this.store.byId[CART_ITEM_ID1].owner]: QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should not merge and remove item when the quantity of item owner is 0', () => {
            const ZERO_QUANTITY = 0;
            const CART_ITEM_ID1 = 'cartItem4';
            const CART_ITEM_ID2 = 'cartItem2';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            delete expectation.byId[CART_ITEM_ID1];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID1);

            const action = updateCartItemOptions(
                CART_ITEM_ID1,
                this.store.byId[CART_ITEM_ID2].options,
                {
                    [this.store.byId[CART_ITEM_ID1].owner]: ZERO_QUANTITY,
                },
            );

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should add new item when the item is assigned to other user', () => {
            const QUANTITY = 6;
            const OTHER_USER = 'user9';
            const CART_ITEM_ID = 'cartItem4';
            const NEXT_ENTITY_ID = generateCartItemId(this.NEXT_ID);

            const originalItem = this.store.byId[CART_ITEM_ID];
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId[NEXT_ENTITY_ID] = createRandomCartItem(
                NEXT_ENTITY_ID,
                originalItem.item,
                OTHER_USER,
                QUANTITY,
                originalItem.options
            );
            expectation.allIds.push(NEXT_ENTITY_ID);
            expectation.idCounter++;
            const action = updateCartItemOptions(CART_ITEM_ID, [], {[OTHER_USER]: QUANTITY});

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item object when quantity and options are same', () => {
            const CART_ITEM_ID = 'cartItem3';
            const TEST_OWNER = 'user4';

            const cartItem = this.store.byId[CART_ITEM_ID];
            const action = updateCartItemOptions(
                cartItem.id,
                cartItem.options,
                {
                    [cartItem.owner]: cartItem.quantity,
                    [TEST_OWNER]: 0,
                },
            );

            const result = cartItems(this.store, action);
            expect(result).toBe(this.store);
        });

        const action = updateCartItemOptions('cartItem1', [], { 'user2': 1 });
        storeByIdShouldBeImmutable(this)(cartItems, action);
        // propertyShouldBeImmutable(this)(cartItems, action, '[0].options');
        entityNotFoundShouldThrowError(this)(cartItems, updateCartItemOptions('cartItem10', [], { 'user2': 1 }));
    });

    describe('#removeCartItem', () => {
        it('should remove item', () => {
            const CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== CART_ITEM_ID);
            const action = removeCartItem(CART_ITEM_ID);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        storeShouldBeImmutable(this)(cartItems, removeCartItem('cartItem1'));
        entityNotFoundShouldThrowError(this)(cartItems, removeCartItem('cartItem10'));
    });
});

interface CartItem extends app.store.Entity {
    item: string;
    owner: string;
    quantity: number;
    options: ReadonlyArray<app.store.GenericId>;
}

type TestEnv = {
    NEXT_ID: number,
    store: app.store.ReadonlyStore<app.entity.CartItem>
}
