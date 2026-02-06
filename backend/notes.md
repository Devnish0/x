# router and controller with debugging

distributing the routes and the controllers into their own files

previously we were writing:

```javascript
app.post(
  "/api/comment",
  protectedroute,
  asyncHandler((req, res) => {
    console.log("lol");
    res.status(201).json(new ApiResponse(201, "comment route hit"));
  })
);
```

now we have:

> controllers.js

```javascript
// userController.js
const addUser = asyncHandler((req, res) => {
  console.log("lol");
  res.status(201).json(new ApiResponse(201, "comment route hit"));
});
```

> routes.js

```javascript
// user.route.js
import { Router } from "express";
const router = Router();
router.route("/register").post(protectedroute, addUser);
```

> app.js

```javascript
import userRoutes from "./routes/user.route.js";
app.use("/api/users", userRoutes);
```

This way, we separate the route definitions from the controller logic, making the codebase cleaner and more maintainable.
