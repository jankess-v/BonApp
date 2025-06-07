const User = require("../models/User")

const getAllUsers = async (req, res) => {
    try {
        console.log(req.user)
        if(req.user._id !== '6842b7eb33610d076e834586') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const users = await User.find({role: {$ne: 'admin'}}).select('-password')
        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        if(req.user.role !== '6842b7eb33610d076e834586') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        if(req.params.id) {
            const user = User.findById(req.params.id)

            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "Nie znaleziono użytkownika"
                })
            }

            if(user.role === 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Nie można usunąć konta administratora"
                })
            }

            await User.findByIdAndDelete(req.params.id)

            res.status(200).json({
                success: true,
                message: "Użytkownik usunięty",
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    getAllUsers,
    deleteUser,
}