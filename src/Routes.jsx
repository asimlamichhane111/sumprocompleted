import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/products";
import Beer from "./pages/products/Beer";
import Vodka from "./pages/products/Vodka";
import Rum from "./pages/products/Rum";
import Whisky from "./pages/products/Whisky";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./components/CartContext";
import { OrderProvider } from "./components/OrderContext";
import OrderHistory from "./pages/OrderHistory";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProducts from "./pages/owner/OwnerProducts";
import OwnerSalesAnalytics from "./pages/owner/OwnerSalesAnalytics";

const AppRoutes = () => {
    return (
        <>
        <Routes>
            <Route path="/" element={<Navigate to="/login"/>}/>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protect the Home page */}
            <Route 
                path="/home" 
                element={
                    <CartProvider>
                        <OrderProvider>  
                            <ProtectedRoute>                       
                                <Home /> 
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider> 
                    
                } 
            />
            <Route 
                path="/products/*" 
                element={
                    <CartProvider>
                    <OrderProvider>  
                        <ProtectedRoute>                       
                            <Products /> 
                        </ProtectedRoute>
                    </OrderProvider>
                </CartProvider> 

                } 
            />
            <Route 
                path="/cart" 
                element={
                    <CartProvider>
                        <OrderProvider>  
                            <ProtectedRoute>                       
                                <Cart /> 
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>                     
                } 
            />
            <Route path="/products/beer" 
                element={   
                    <CartProvider>
                        <OrderProvider> 
                            <ProtectedRoute>
                                <Beer />
                            </ProtectedRoute>
                        </OrderProvider> 
                    </CartProvider>
                    
                }
            />
            <Route path="/products/vodka"
                element={                    
                    <CartProvider>
                        <OrderProvider> 
                            <ProtectedRoute> 
                                <Vodka />
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>
                    
                }
            />
            <Route path="/products/rum" 
                element={                   
                    <CartProvider>
                        <OrderProvider>  
                            <ProtectedRoute>
                                <Rum />
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>
                    
                } 
            />
            <Route path="/products/whisky"
                element={                    
                    <CartProvider>
                        <OrderProvider>  
                            <ProtectedRoute>
                                <Whisky />
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>
                    
                } 
            />
            <Route path="/order-history" 
                element={
                    <CartProvider>
                        <OrderProvider>
                            <ProtectedRoute>
                                <OrderHistory />    
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>
                } 
            />

            {/* owner only */}
            <Route path="/owner/dashboard"
                element={
                    <CartProvider>
                        <OrderProvider>
                            <ProtectedRoute allowedRoles={['owner']}>
                                <OwnerDashboard/>
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>
                }
            />
            <Route path="/owner/products"
                element={
                    <CartProvider>
                        <OrderProvider>
                            <ProtectedRoute allowedRoles={['owner']}>
                                <OwnerProducts/>
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>
                }
            />
            <Route path="/owner/sales-analytics"
                element={
                    <CartProvider>
                        <OrderProvider>
                            <ProtectedRoute allowedRoles={['owner']}>
                                <OwnerSalesAnalytics />
                            </ProtectedRoute>
                        </OrderProvider>
                    </CartProvider>  
                } 
            />

        </Routes>

        </>
    );
};

export default AppRoutes;
