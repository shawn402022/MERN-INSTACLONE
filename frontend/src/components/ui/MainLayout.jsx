import { Outlet } from "react-router-dom"
import LeftSideBar from "./LeftSideBar"

const MainLayout = () => {
    return (
        <div>
            <LeftSideBar/>
            <Outlet/>
        </div>
    )
}

export default MainLayout
