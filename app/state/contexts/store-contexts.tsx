// import React, { useState, createContext, useContext, ReactNode } from "react";
// import { User } from "~/models/user";

// interface Store {
//   user: User;
//   cartCount: number;
//   login: () => void;
//   logout: () => void;
//   addToCart: () => void;
// }

// const useStore = (): Store => {
//   const [user, setUser] = useState<string>("");
//   const [cartCount, setCartCount] = useState<number>(0);

//   const login = () => setUser("Jack");
//   const logout = () => setUser("");
//   const addToCart = () => setCartCount(cartCount + 1);

//   return {
//     user,
//     cartCount,
//     login,
//     logout,
//     addToCart,
//   };
// };

// const StoreContext = createContext<Store | null>(null);

// interface StoreContextProviderProps {
//   children: ReactNode;
// }

// export const StoreContextProvider: React.FC<StoreContextProviderProps> = ({
//   children,
// }: StoreContextProviderProps) => (
//   <StoreContext.Provider value={useStore()}>{children}</StoreContext.Provider>
// );

// export const useLogin = () => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useLogin must be used within a StoreContextProvider");
//   }
//   return store.login;
// };

// export const useLogout = () => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useLogout must be used within a StoreContextProvider");
//   }
//   return store.logout;
// };

// export const useAddToCart = () => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useAddToCart must be used within a StoreContextProvider");
//   }
//   return store.addToCart;
// };

// export const useUser = () => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useUser must be used within a StoreContextProvider");
//   }
//   return store.user;
// };

// export const useCartCount = () => {
//   const store = useContext(StoreContext);
//   if (!store) {
//     throw new Error("useCartCount must be used within a StoreContextProvider");
//   }
//   return store.cartCount;
// };
