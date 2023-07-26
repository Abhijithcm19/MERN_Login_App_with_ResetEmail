import React from 'react';
import {createBrowserRouter, CreateBrowserRouter, RouterProvider} from 'react-router-dom'
import { Provider } from "react-redux";
import store from "./store/store";
/**import all components*/
import Username from './componets/Username'
import PageNotFount from './componets/PageNotFount'
import Password from './componets/Password'
import Profile from './componets/Profile'
import Recovery from './componets/Recovery'
import Reset from './componets/Reset'
import Register from './componets/Register'

/**root routes */
const router = createBrowserRouter([
    {
        path:'/',
        element : <Username></Username>
    },
    {
        path:'/register',
        element:<Register></Register>
    },
    {
        path:'/password',
        element:<Password></Password>
    },
    {
        path:'/profile',
        element:<Profile></Profile>
    },
    {
        path:'/recovery',
        element:<Recovery></Recovery>
    },
    {
        path:'/reset',
        element:<Reset></Reset>
    },
    {
        path:'*',
        element:<PageNotFount></PageNotFount>
    }
])

export default function () {
  return (
    <Provider store={store}>
    <main>
    <RouterProvider router={router}></RouterProvider>
    </main>
    </Provider>
  );
}
