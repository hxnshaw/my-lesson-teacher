# MY LESSON-TEACHER APP
## INTRODUCTION
A learning platform for software developers, equipped with video tutorials and access to every learning material after they subscribe.
Subscription to the lesson-teacher plan is made possible via Paystack Subscription service.

# AUTHENTICATION AND AUTHORIZATION
The lesson-teacher app makes use of google oauth to authenticate users. Only authorized users are granted access to some routes. For example, only the admins can view all the users that are registered.


# FEATURES
* Users can register, Login and logout of their accounts as either students or tutors.
* Google authentication.
* Paystack to process payment.
* Three categories of users: Admins, Teachers (also known as Tutors) and Students.
* Teachers can upload video content.
* Only subscribed students can view the tutorials.
* Tutors(Lesson-teachers) can create new courses, edit and delete the courses they created.
* Students can add comments to the tutorials.
* Edit and delete comments.
* View all the comments associated with a tutorial.
* Data is saved to the database (MongoDB).
# Admins can do the following:
* Admins are super-users; create, edit and delete data that violates any rules.
* View all the users (tutors and students)

