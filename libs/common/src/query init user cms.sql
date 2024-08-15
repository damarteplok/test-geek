INSERT INTO "user" (email, password, "createdAt", "deletedAt") VALUES ('damar21@damar2.com', '$2a$10$GXqScZALOcZQ.fgD5mOjTuycixshN/ca8lmbn0btL8uRgEzivRGLW', NOW(), NOW());
INSERT INTO "role" (name, description, "createdAt", "deletedAt") VALUES ('superadmin', 'role for superadmin', NOW(), NOW());
INSERT INTO "permission" (resource, description, path, method, "createdAt", "deletedAt")
      VALUES 
        ('user', 'user get', '*', 'get', NOW(), NOW()),
        ('user', 'user post', '*', 'post', NOW(), NOW()),
        ('user', 'user patch', '*', 'patch', NOW(), NOW()),
        ('user', 'user delete', '*', 'delete', NOW(), NOW());
        
INSERT INTO "role_user" ("userId", "roleId")
      VALUES (1, 1);

INSERT INTO "role_permission" ("roleId", "permissionId")
      VALUES 
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4);
        

        