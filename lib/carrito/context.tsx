"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

export interface CarritoItem {
  productoId: string;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  proceso: string;
  cantidad: number;
}

interface CarritoState {
  items: CarritoItem[];
  drawerOpen: boolean;
}

type CarritoAction =
  | { type: "AGREGAR"; item: Omit<CarritoItem, "cantidad"> }
  | { type: "QUITAR"; productoId: string }
  | { type: "CAMBIAR_CANTIDAD"; productoId: string; cantidad: number }
  | { type: "LIMPIAR" }
  | { type: "TOGGLE_DRAWER"; open?: boolean }
  | { type: "HYDRATE"; items: CarritoItem[] };

interface CarritoContextValue extends CarritoState {
  total: number;
  cantidadItems: number;
  agregarItem: (item: Omit<CarritoItem, "cantidad">) => void;
  quitarItem: (productoId: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  abrirDrawer: () => void;
  cerrarDrawer: () => void;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

const STORAGE_KEY = "pusu_carrito";

function reducer(state: CarritoState, action: CarritoAction): CarritoState {
  switch (action.type) {
    case "AGREGAR": {
      const existe = state.items.find(
        (i) => i.productoId === action.item.productoId
      );
      if (existe) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productoId === action.item.productoId
              ? { ...i, cantidad: i.cantidad + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, cantidad: 1 }],
      };
    }
    case "QUITAR":
      return {
        ...state,
        items: state.items.filter((i) => i.productoId !== action.productoId),
      };
    case "CAMBIAR_CANTIDAD": {
      if (action.cantidad <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productoId !== action.productoId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productoId === action.productoId
            ? { ...i, cantidad: action.cantidad }
            : i
        ),
      };
    }
    case "LIMPIAR":
      return { ...state, items: [] };
    case "TOGGLE_DRAWER":
      return { ...state, drawerOpen: action.open ?? !state.drawerOpen };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    drawerOpen: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const total = state.items.reduce(
    (acc, i) => acc + i.precio * i.cantidad,
    0
  );
  const cantidadItems = state.items.reduce((acc, i) => acc + i.cantidad, 0);

  const agregarItem = useCallback(
    (item: Omit<CarritoItem, "cantidad">) => {
      dispatch({ type: "AGREGAR", item });
      dispatch({ type: "TOGGLE_DRAWER", open: true });
    },
    []
  );
  const quitarItem = useCallback(
    (productoId: string) => dispatch({ type: "QUITAR", productoId }),
    []
  );
  const cambiarCantidad = useCallback(
    (productoId: string, cantidad: number) =>
      dispatch({ type: "CAMBIAR_CANTIDAD", productoId, cantidad }),
    []
  );
  const limpiarCarrito = useCallback(
    () => dispatch({ type: "LIMPIAR" }),
    []
  );
  const abrirDrawer = useCallback(
    () => dispatch({ type: "TOGGLE_DRAWER", open: true }),
    []
  );
  const cerrarDrawer = useCallback(
    () => dispatch({ type: "TOGGLE_DRAWER", open: false }),
    []
  );

  return (
    <CarritoContext.Provider
      value={{
        ...state,
        total,
        cantidadItems,
        agregarItem,
        quitarItem,
        cambiarCantidad,
        limpiarCarrito,
        abrirDrawer,
        cerrarDrawer,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
