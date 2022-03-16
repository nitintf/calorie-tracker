import connectDb from "./db/connect";
import User from "./app/User/user.entity";

const update = async () => {
    await connectDb()
    await User.update({ id: 2 }, { dailyCalorieLimit: 3000 })
}

update()