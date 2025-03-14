import User from "../models/user.model.js"

export const addFriend = async (req, _REF) => {
    try {
        const { friendId } = req.body
        const userId = req.user._id
        console.log("friend:", friendId, "user:", userId);

        if (userId === friendId) return res.status(400).json({ message: "You can't add yourself as a friend" })

        const user = await User.findById(userId)
        const friend = await User.findById(friendId)
        if (!friend) return res.status(404).json({ message: "Friend not found" })

        // Check if the user is already friends with the friend
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "User is already friends" })
        }
        // Add the friend to the user's friends list
        if (user.friendRequests.includes(friendId)) {
            user.friends.push(friendId)
            friend.friends.push(userId)
            user.friendRequests = user.friendRequests.filter((id) => friendId !== id.toString())
            friend.friendRequests = friend.friendRequests.filter((id) => userId !== id.toString())
            await user.save()
            await friend.save()
            return res.status(200).json({ message: "Friend added successfully" })
        }
        if (!friend.friendRequests.includes(userId)) {
            friend.friendRequests.push(userId)
            await friend.save()
        }
        res.status(200).json({ message: "Friend request sent successfully" })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While adding a new friend" });

    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.body
        const userId = req.user._id
        console.log("friend:", friendId, "user:", userId);
        const user = await User.findById(userId)
        const friend = await User.findById(friendId)
        if (!friend) return res.status(404).json({ message: "Friend not found" })

        if (!user.friendRequests.includes(friendId))
            return res.status(400).json({ message: "No Friend Request from this user" })

        // Accept the friend request
        user.friends.push(friendId)
        friend.friends.push(userId)
        user.friendRequests = user.friendRequests.filter((id) => friendId !== id.toString())
        friend.friendRequests = friend.friendRequests.filter((id) => userId !== id.toString())
        await user.save()
        await friend.save()
        res.status(200).json({ message: "Friend request accepted successfully" })


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While accepting a new friend" });
    }
}