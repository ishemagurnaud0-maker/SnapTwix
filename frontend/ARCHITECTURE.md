## 🗃️ Database Design
 
SnapTwix uses **Appwrite's NoSQL database** with the following collections:
 
### Users Collection
```
users
├── $id             → unique user ID (auto)
├── name            → display name
├── username        → unique handle e.g. @johndoe
├── email           → user email
├── bio             → short profile description
├── imageUrl        → profile photo URL
├── followers       → array of user IDs who follow this user
└── following       → array of user IDs this user follows
```
 
### Posts Collection
```
posts
├── $id             → unique post ID (auto)
├── creator         → reference to users.$id
├── imageUrl        → post image URL
├── imageId         → storage file ID
├── caption         → post caption
├── location        → optional location tag
├── tags            → array of tag strings
├── likes           → array of user IDs who liked this post
└── saves           → array of user IDs who saved this post
```