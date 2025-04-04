import ShopContextProvider from "./ShopContext";
import AuthContextProvider from "./AuthContext";

const AppContextProvider = ({ children }) => {
    return (
        <AuthContextProvider>
            <ShopContextProvider>
                {children}
            </ShopContextProvider>
        </AuthContextProvider>
    );
};

export default AppContextProvider;