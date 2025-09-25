# ⚠️ Areas for Improvement

## For `config/db.js`

### Naming Consistency
You’re mixing English and Spanish (`conexion` vs `connection`). Better to stick with one language (`connection`) for maintainability.

### Error Logging
Right now, it just `console.log(error)`. You could make logs more descriptive (e.g., console.error("MongoDB connection error:", error.message));


---

## For `app.js`

### CORS Configuration
Using `app.use(cors())` allows requests from any origin. This is fine for development, but in production you may want to restrict it: app.use(cors({ origin: process.env.CLIENT_URL }));  

---

## For `./models/userModel.js`

### Email Validation
Right now, `email` is just a string. Adding `unique: true` and a regex validator would prevent duplicate accounts and invalid emails:
email: {
type: String,
required: true,
unique: true,
match: [/^\S+@\S+.\S+$/, "Please enter a valid email address"]
}



### Interests Field
You set `interests` as a `String`, but realistically, users may have multiple interests. Better to store as an array of strings:

interests: [{ type: String }]



### Schema Consistency
Field naming convention: you use `fullName` (camelCase), but then `phonenumber` (all lowercase). Consistency improves readability (`phoneNumber` is better).

---

## For `controllers/notificationController.js`

### Response Payloads
In `createNotification`, you only send `{ message: "Notification created" }`.  
It’s often useful to return the created object itself for the client: res.status(201).json(notification);  



### `getMyNotifications` Logic
`if (notifications)` always passes, since `.find()` returns an empty array (truthy).  

If no notifications, return an empty array with `200`, not `404`. That’s expected behavior.

---

## For `routes/userRouter.js`

### Login Should Be POST, Not GET
Fix:  
router.post("/login", getRegisteredUser);



---

## For `routes/notificationsRouter.js`

### Ambiguity Between `/:userId` and `/:notificationId`
Both are `/:id`-style params but mean different things. This can create route conflicts.  

Example:  
`GET /api/notifications/123` → is `123` a `userId` or `notificationId`?  

Suggested fix: make them explicit:
router.get("/user/:userId", getMyNotifications);
router.delete("/:notificationId", deleteNotification);