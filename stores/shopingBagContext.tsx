"use client";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export interface ShoppingBagItem {
  id: string;
  type?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Optional image URL
}

// Actions Types
type ShoppingBagAction =
  | { type: "ADD_ITEM"; payload: ShoppingBagItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_BAG" }
  | {
      type: "UPDATE_QUANTITY";
      payload: { id: string; quantity: number };
    }
  | { type: "RESTORE_ITEMS"; payload: ShoppingBagItem[] };

// State Type
interface ShoppingBagState {
  items: ShoppingBagItem[];
}

// Initial State
const initialState: ShoppingBagState = {
  items: [],
};

// Reducer Function
const shoppingBagReducer = (
  state: ShoppingBagState,
  action: ShoppingBagAction,
): ShoppingBagState => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "RESTORE_ITEMS":
      return { ...state, items: action.payload };

    case "CLEAR_BAG":
      return { ...state, items: [] };

    default:
      return state;
  }
};

// Context Interface
interface ShoppingBagContextType {
  items: ShoppingBagItem[];
  addItem: (item: ShoppingBagItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBag: () => void;
}

// Create Context
const ShoppingBagContext = createContext<ShoppingBagContextType | undefined>(
  undefined,
);

// Provider Component
export const ShoppingBagProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(shoppingBagReducer, initialState);

  const addItem = (item: ShoppingBagItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    saveItemsToLocalStorage();
  };
  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
    saveItemsToLocalStorage();
  };
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    saveItemsToLocalStorage();
  };
  const clearBag = () => {
    dispatch({ type: "CLEAR_BAG" });
    saveItemsToLocalStorage();
  };

  const saveItemsToLocalStorage = () => {
    window.localStorage.setItem("shoppingBag", JSON.stringify(state.items));
    console.log("saved");
  };

  useEffect(() => {
    const storedItems = window.localStorage.getItem("shoppingBag");
    const parsedStoredItems = storedItems ? JSON.parse(storedItems) : [];
    if (parsedStoredItems.length > 0) {
      dispatch({ type: "CLEAR_BAG" });
      dispatch({ type: "RESTORE_ITEMS", payload: parsedStoredItems });
    }
  }, []);

  useEffect(() => {
    saveItemsToLocalStorage();
  }, [state.items]);

  //  saveItemsToLocalStorage();

  return (
    <ShoppingBagContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearBag,
      }}
    >
      {children}
    </ShoppingBagContext.Provider>
  );
};

// Custom Hook for Usage
export const useShoppingBag = () => {
  const context = useContext(ShoppingBagContext);
  if (!context) {
    throw new Error("useShoppingBag must be used within a ShoppingBagProvider");
  }
  return context;
};
