import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import SuggestedUsers from "./SuggestedUsers"


const RightSideBar = () => {
    const { user } = useSelector(store => store.auth)
    return (
        <div className='w-fit my-10 pr-32'>
            <Link to={`/profile/${user?._id}`} >
                <Avatar >
                    <AvatarImage
                        src={user?.profilePicture}
                        alt='User'
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>
            <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user?._id}`}
                >
                    {user?.username}
                </Link>
            </h1>
            <span className="text-gray-600 text-sm">{user?.bio || "Bio here..."}</span>
            <SuggestedUsers/>
        </div>
    )
}

export default RightSideBar
