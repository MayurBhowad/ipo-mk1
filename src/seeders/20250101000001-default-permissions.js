'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Define default permissions for IPO and User management modules
    const permissions = [
      // IPO Module Permissions
      {
        id: require('uuid').v4(),
        permission_name: 'ipo_read',
        description: 'Read access to IPO module',
        module: 'ipo',
        action: 'read',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        permission_name: 'ipo_create',
        description: 'Create access to IPO module',
        module: 'ipo',
        action: 'create',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        permission_name: 'ipo_edit',
        description: 'Edit access to IPO module',
        module: 'ipo',
        action: 'edit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        permission_name: 'ipo_delete',
        description: 'Delete access to IPO module',
        module: 'ipo',
        action: 'delete',
        created_at: new Date(),
        updated_at: new Date(),
      },



      // User Management Permissions
      {
        id: require('uuid').v4(),
        permission_name: 'user_read',
        description: 'Read access to User management',
        module: 'user',
        action: 'read',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        permission_name: 'user_create',
        description: 'Create access to User management',
        module: 'user',
        action: 'create',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        permission_name: 'user_edit',
        description: 'Edit access to User management',
        module: 'user',
        action: 'edit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: require('uuid').v4(),
        permission_name: 'user_delete',
        description: 'Delete access to User management',
        module: 'user',
        action: 'delete',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('permissions', permissions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
