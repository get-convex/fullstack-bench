# Navigation and Project Management

1. Homepage shows welcome message when no project is selected
2. Sidebar lists all projects the user has access to
3. Projects with no access are not visible in the sidebar
4. Can create a new project with emoji and description
5. Creating a new project updates the page without a refresh
6. Project view shows project name, emoji, and description in the header

# Authorization and Access Control

7. Admin users can access all projects
8. Non-admin users can only access projects they are members of
9. Admin users can promote other users to admin
10. Admin users can demote other admin users
11. Non-admin users cannot modify admin status

# File System Operations

12. Project view shows file/directory tree structure
13. Can create new files in a directory
14. Can create new directories in a directory
15. Creating a duplicate file name in a directory fails
16. New files/directories appear without a page refresh
17. Can edit file contents
18. File content changes are saved without a page refresh
19. Can rename files and directories
20. Renamed files/directories update without a page refresh
21. Can delete empty directories
22. Cannot delete non-empty directories
23. Can delete files
24. Deleted files/directories are removed without a page refresh

# Group Management

25. Can create new groups
26. Can add users to groups
27. Creating a cyclic group fails
28. Can add groups to projects
29. Group members inherit project access
30. Nested group membership works (user in group A, group A in group B, group B in project)
31. Can remove users from groups
32. Removed users lose access to projects
33. Can remove groups from projects
34. Removed group members lose access to projects
