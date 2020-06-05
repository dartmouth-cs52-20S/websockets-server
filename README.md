Solution to lab5 part 1 and part 2.

## Part 2
In this lab, a few more components are added, users can now sign up for an account with a username, an email and a password, and signout if needed.

The app now supports authentication: Only signed in users can see all the posts, otherwise would be redirected to the signin page.

The user model stores username, salt+hashed password, and email. An id of the user, which is later used to populate the record, is also stored as a ref in the post model.

## EC

### error handling
Upon failed operations:
- unauthorized 'create post'
- signing up for an existing username
- providing wrong password while logging in

To achieve this, error reducer, error action, error component are all added. 

### permissions
The app only allows users to create and edit their own posts. When a user tries to modify others' posts, they will be directed to an error page.