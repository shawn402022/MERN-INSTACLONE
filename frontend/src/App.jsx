import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { browser } from "globals"
import MainLayout from "./components/ui/MainLayout"
import Home from "./pages/Home"
import Profile from "./pages/Profile"

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element: <MainLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/profile',
        element:<Profile/>
      }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/Signup',
    element:<Signup/>
  }
])

const App = () => {
  return (
    <div>
      <RouterProvider router={browserRouter}/>
    </div>
  )
}

export default App
