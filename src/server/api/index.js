import { Router } from "express"
import usersRoutes from "./users/routes"
import landingPageRoutes from "./landingPage/routes"
import authRoutes from "./auth/routes"
import listEndpoints from "express-list-endpoints"
// import authenticate from '~/middleware/authenticate'
import { handleServerErrors } from "express-server-error"

const router = Router()

router.use("/", handleServerErrors())
router.use("/auth", authRoutes)
router.use("/landing-page", landingPageRoutes)
router.use("/users", usersRoutes)

router.get("/", (req, res) => {
  res.json(listEndpoints(router))
})

export default router
